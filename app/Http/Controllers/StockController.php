<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Sector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class StockController extends Controller
{
    public function dashboard(Request $request)
    {
        // For dashboard, we can just redirect to screener or show IHSG overview
        return redirect()->route('screener');
    }

    public function index(Request $request)
    {
        $allStocks = Stock::with('sector')->orderBy('ticker')->paginate(50);
        return view('stocks.index', compact('allStocks'));
    }

    public function show(Request $request, $ticker)
    {
        $tab = $request->query('tab', 'chart');
        
        $currentStock = Stock::with(['fundamentals', 'sector', 'latestIndicator'])->where('ticker', $ticker)->firstOrFail();
        
        // Fetch real-time data from Yahoo Finance for current stock
        $yahooData = $this->fetchYahooData($ticker);
        if ($yahooData) {
            $currentStock->price = $yahooData['price'];
            $currentStock->change = $yahooData['change'];
            $currentStock->change_percent = $yahooData['changePercent'];
            $currentStock->day_high = $yahooData['dayHigh'];
            $currentStock->day_low = $yahooData['dayLow'];
            
            if ($currentStock->name === $currentStock->ticker && isset($yahooData['longName'])) {
                $currentStock->name = $yahooData['longName'];
                Stock::where('id', $currentStock->id)->update(['name' => $yahooData['longName']]);
            }
        }
        
        $session_id = session()->getId();
        $watchlist = \App\Models\Watchlist::where('session_id', $session_id)->pluck('ticker')->toArray();
        if (empty($watchlist)) {
            $watchlist = ['BBCA', 'BBRI', 'TLKM', 'ASII', 'GOTO'];
        }
        
        $watchedStockObjects = Stock::with(['fundamentals', 'sector'])->whereIn('ticker', $watchlist)->get();
        $ihsgData = json_decode(file_get_contents(database_path('seeders/stocks_data.json')), true)['ihsgData'] ?? null;

        // Signal Engine
        $signalEngine = new \App\Services\Signals\SignalEngine();
        $signals = $signalEngine->analyze($currentStock);
        
        return view('app', compact('currentStock', 'ticker', 'tab', 'watchlist', 'watchedStockObjects', 'ihsgData', 'signals'));
    }
    
    public function apiSearch(Request $request)
    {
        $queryStr = strtoupper(trim($request->query('q')));
        if (empty($queryStr)) return response()->json([]);
        
        $results = Stock::with(['sector'])->where('ticker', 'like', "%{$queryStr}%")
            ->orWhere('name', 'like', "%{$queryStr}%")
            ->limit(20)
            ->get();
            
        // If exact 4-letter ticker match is not found in local DB, fetch from Yahoo Finance
        if (strlen($queryStr) === 4 && !$results->contains('ticker', $queryStr)) {
            $url = "https://query2.finance.yahoo.com/v1/finance/search?q={$queryStr}.JK&quotesCount=1&newsCount=0";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            $response = curl_exec($ch);
            curl_close($ch);
            
            $data = json_decode($response, true);
            if (isset($data['quotes'][0]) && $data['quotes'][0]['exchange'] === 'JKT') {
                $quote = $data['quotes'][0];
                
                // Find or create sector
                $sectorName = $quote['sectorDisp'] ?? 'Lainnya';
                $sector = \App\Models\Sector::firstOrCreate(
                    ['name' => $sectorName],
                    ['slug' => \Illuminate\Support\Str::slug($sectorName)]
                );
                
                // Create stock
                $stock = Stock::create([
                    'ticker' => $queryStr,
                    'symbol' => $queryStr . '.JK',
                    'name' => $quote['longname'] ?? $quote['shortname'] ?? $queryStr,
                    'sector_id' => $sector->id,
                    'sub_sector' => $quote['industryDisp'] ?? null,
                    'price' => 0, // Will be fetched later when viewed
                ]);
                
                $stock->load('sector');
                $results->prepend($stock);
            }
        }
            
        return response()->json($results);
    }
    
    public function apiChart($ticker)
    {
        $tickerJK = strtoupper($ticker) . '.JK';
        $url = "https://query1.finance.yahoo.com/v8/finance/chart/{$tickerJK}?interval=1d&range=6mo";
        
        $cacheKey = "chart_v2_{$ticker}";
        $data = Cache::remember($cacheKey, 60, function() use ($url) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            $result = curl_exec($ch);
            curl_close($ch);
            return json_decode($result, true);
        });
        
        $formattedData = [];
        if (isset($data['chart']['result'][0])) {
            $result = $data['chart']['result'][0];
            $timestamps = $result['timestamp'] ?? [];
            $quote = $result['indicators']['quote'][0] ?? [];
            
            for ($i = 0; $i < count($timestamps); $i++) {
                if ($quote['open'][$i] !== null) {
                    $formattedData[] = [
                        'time' => $timestamps[$i],
                        'open' => round($quote['open'][$i], 2),
                        'high' => round($quote['high'][$i], 2),
                        'low' => round($quote['low'][$i], 2),
                        'close' => round($quote['close'][$i], 2),
                        'value' => $quote['volume'][$i] ?? 0
                    ];
                }
            }
        }
        
        return response()->json($formattedData);
    }
    
    private function fetchYahooData($ticker)
    {
        $tickerJK = strtoupper($ticker) . '.JK';
        $url = "https://query1.finance.yahoo.com/v8/finance/chart/{$tickerJK}?interval=1d&range=1d";
        
        $cacheKey = "quote_v2_{$ticker}";
        return Cache::remember($cacheKey, 60, function() use ($url) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            $result = curl_exec($ch);
            curl_close($ch);
            
            $data = json_decode($result, true);
            if (isset($data['chart']['result'][0]['meta'])) {
                $meta = $data['chart']['result'][0]['meta'];
                return [
                    'price' => $meta['regularMarketPrice'] ?? 0,
                    'change' => $meta['regularMarketPrice'] - ($meta['chartPreviousClose'] ?? $meta['regularMarketPrice']),
                    'changePercent' => $meta['regularMarketChangePercent'] ?? 0,
                    'dayHigh' => $meta['regularMarketDayHigh'] ?? 0,
                    'dayLow' => $meta['regularMarketDayLow'] ?? 0,
                    'longName' => $meta['longName'] ?? $meta['shortName'] ?? null,
                ];
            }
            return null;
        });
    }
}
