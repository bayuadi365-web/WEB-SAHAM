<?php

namespace App\Services\Signals;

use App\Models\Stock;
use App\Services\Signals\Rules\SignalRuleInterface;
use App\Services\Signals\Rules\GoldenCross;
use App\Services\Signals\Rules\MacdBullishVolSpike;
use App\Services\Signals\Rules\RsiOversoldLowerBB;
use Illuminate\Support\Facades\DB;

class SignalEngine
{
    /** @var SignalRuleInterface[] */
    protected array $rules = [];

    public function __construct()
    {
        // Register all available rules here
        $this->rules = [
            new GoldenCross(),
            new MacdBullishVolSpike(),
            new RsiOversoldLowerBB(),
            // Add DeathCross, etc.
        ];
    }

    /**
     * Analyze a stock based on its latest indicators in the database.
     *
     * @param Stock $stock
     * @return Signal[] List of triggered signals
     */
    public function analyze(Stock $stock): array
    {
        // Fetch latest indicators
        $latestIndicator = DB::table('stock_indicators')
            ->where('stock_id', $stock->id)
            ->orderBy('date', 'desc')
            ->first();

        if (!$latestIndicator) {
            return [];
        }

        // We also need the current close price and volume, let's fetch it from Yahoo Finance
        // For performance in a screener, this might be slow to fetch real-time.
        // We'll use the daily synced values if available, but Yahoo doesn't give us today's close in the historical unless market is closed.
        // We will assume the indicator sync has the latest 'close' and 'volume'.
        // Wait, our stock_indicators table doesn't have 'close' and 'volume'.
        // For the sake of the signal engine, we should fetch real-time quote for 'close' and 'volume'.
        $quote = $this->getRealTimeQuote($stock->ticker);

        $indicatorsArray = (array) $latestIndicator;
        $indicatorsArray['close'] = $quote['close'] ?? 0;
        $indicatorsArray['volume'] = $quote['volume'] ?? 0;

        $triggeredSignals = [];

        foreach ($this->rules as $rule) {
            $signal = $rule->evaluate($indicatorsArray);
            if ($signal !== null) {
                $triggeredSignals[] = $signal;
            }
        }

        return $triggeredSignals;
    }

    protected function getRealTimeQuote(string $ticker): array
    {
        $symbol = $ticker . '.JK';
        $url = "https://query1.finance.yahoo.com/v8/finance/chart/{$symbol}?range=1d&interval=1d";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        $response = curl_exec($ch);
        curl_close($ch);

        if (!$response) return [];

        $data = json_decode($response, true);
        if (!isset($data['chart']['result'][0]['indicators']['quote'][0])) {
            return [];
        }

        $quote = $data['chart']['result'][0]['indicators']['quote'][0];
        
        $closeList = array_filter($quote['close'] ?? [], fn($v) => $v !== null);
        $volumeList = array_filter($quote['volume'] ?? [], fn($v) => $v !== null);

        return [
            'close' => empty($closeList) ? 0 : end($closeList),
            'volume' => empty($volumeList) ? 0 : end($volumeList)
        ];
    }
}
