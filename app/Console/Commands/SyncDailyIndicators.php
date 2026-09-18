<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;
use App\Services\Indicators\SMA;
use App\Services\Indicators\EMA;
use App\Services\Indicators\RSI;
use App\Services\Indicators\MACD;
use App\Services\Indicators\BollingerBands;
use App\Services\Indicators\ATR;
use App\Services\Indicators\VolumeMA;
use App\Services\Indicators\Stochastic;
use App\Services\Indicators\OBV;
use App\Services\Indicators\ADX;

class SyncDailyIndicators extends Command
{
    protected $signature = 'app:sync-daily-indicators';
    protected $description = 'Fetch daily OHLCV and calculate/store technical indicators for all stocks';

    public function handle()
    {
        $stocks = Stock::all();
        $this->info("Starting sync for {$stocks->count()} stocks.");

        $bar = $this->output->createProgressBar($stocks->count());
        $bar->start();

        foreach ($stocks as $stock) {
            try {
                $ohlcv = $this->fetchOhlcv($stock->ticker);
                
                if ($ohlcv->isEmpty()) {
                    $bar->advance();
                    continue;
                }

                $this->calculateAndStoreIndicators($stock, $ohlcv);
                
                $fundamentalService = app(\App\Services\FundamentalAnalysisService::class);
                $fundamentalService->syncFundamentals($stock);
                
            } catch (\Exception $e) {
                $this->error("Error syncing {$stock->ticker}: " . $e->getMessage());
            }
            
            // Sleep to avoid rate limits on Yahoo Finance
            usleep(200000); // 200ms
            $bar->advance();
        }

        $bar->finish();
        $this->info("\nSync completed.");
    }

    protected function fetchOhlcv(string $ticker)
    {
        $symbol = $ticker . '.JK';
        $url = "https://query1.finance.yahoo.com/v8/finance/chart/{$symbol}?range=1y&interval=1d";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        
        $response = curl_exec($ch);
        curl_close($ch);

        if (!$response) return collect([]);

        $data = json_decode($response, true);
        if (!isset($data['chart']['result'][0]['timestamp'])) {
            return collect([]);
        }

        $result = $data['chart']['result'][0];
        $timestamps = $result['timestamp'];
        $quote = $result['indicators']['quote'][0];
        
        $collection = collect();
        
        for ($i = 0; $i < count($timestamps); $i++) {
            if ($quote['close'][$i] === null) continue;
            
            $collection->push([
                'date' => date('Y-m-d', $timestamps[$i]),
                'open' => $quote['open'][$i],
                'high' => $quote['high'][$i],
                'low' => $quote['low'][$i],
                'close' => $quote['close'][$i],
                'volume' => $quote['volume'][$i] ?? 0,
            ]);
        }
        
        return $collection;
    }

    protected function calculateAndStoreIndicators(Stock $stock, $ohlcv)
    {
        $sma20 = (new SMA(20))->calculate($ohlcv);
        $sma50 = (new SMA(50))->calculate($ohlcv);
        $sma200 = (new SMA(200))->calculate($ohlcv);
        $ema20 = (new EMA(20))->calculate($ohlcv);
        $ema50 = (new EMA(50))->calculate($ohlcv);
        $rsi14 = (new RSI(14))->calculate($ohlcv);
        $macd = (new MACD())->calculate($ohlcv);
        $bb = (new BollingerBands())->calculate($ohlcv);
        $atr14 = (new ATR(14))->calculate($ohlcv);
        $volMa20 = (new VolumeMA(20))->calculate($ohlcv);
        $stoch = (new Stochastic())->calculate($ohlcv);
        $obv = (new OBV())->calculate($ohlcv);
        $adx14 = (new ADX(14))->calculate($ohlcv);

        // We only store the latest date for screener purposes to save DB space
        $latestData = $ohlcv->last();
        $date = $latestData['date'];

        DB::table('stock_indicators')->updateOrInsert(
            ['stock_id' => $stock->id, 'date' => $date],
            [
                'sma_20' => $sma20[$date] ?? null,
                'sma_50' => $sma50[$date] ?? null,
                'sma_200' => $sma200[$date] ?? null,
                'ema_20' => $ema20[$date] ?? null,
                'ema_50' => $ema50[$date] ?? null,
                'rsi_14' => $rsi14[$date] ?? null,
                'macd_line' => $macd[$date]['macd'] ?? null,
                'macd_signal' => $macd[$date]['signal'] ?? null,
                'macd_histogram' => $macd[$date]['histogram'] ?? null,
                'bb_upper' => $bb[$date]['upper'] ?? null,
                'bb_lower' => $bb[$date]['lower'] ?? null,
                'atr_14' => $atr14[$date] ?? null,
                'volume_ma_20' => $volMa20[$date] ?? null,
                'stoch_k' => $stoch[$date]['k'] ?? null,
                'stoch_d' => $stoch[$date]['d'] ?? null,
                'obv' => $obv[$date] ?? null,
                'adx_14' => $adx14[$date] ?? null,
                'updated_at' => now(),
            ]
        );
    }
}
