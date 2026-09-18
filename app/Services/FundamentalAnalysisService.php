<?php

namespace App\Services;

use App\Models\Stock;
use App\Models\Sector;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class FundamentalAnalysisService
{
    /**
     * Fetch fundamental data from Yahoo Finance for a specific stock
     * and update the stock_indicators table.
     */
    public function syncFundamentals(Stock $stock): void
    {
        $symbol = $stock->ticker . '.JK';
        $url = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/{$symbol}?modules=defaultKeyStatistics,financialData,summaryDetail";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        
        $response = curl_exec($ch);
        curl_close($ch);

        if (!$response) return;

        $data = json_decode($response, true);
        if (!isset($data['quoteSummary']['result'][0])) {
            return;
        }

        $result = $data['quoteSummary']['result'][0];
        $financialData = $result['financialData'] ?? [];
        $keyStatistics = $result['defaultKeyStatistics'] ?? [];
        $summaryDetail = $result['summaryDetail'] ?? [];

        $per = $summaryDetail['trailingPE']['raw'] ?? null;
        $pbv = $keyStatistics['priceToBook']['raw'] ?? null;
        $roe = $financialData['returnOnEquity']['raw'] ?? null;
        $roa = $financialData['returnOnAssets']['raw'] ?? null;
        $der = $financialData['debtToEquity']['raw'] ?? null;
        $npm = $financialData['profitMargins']['raw'] ?? null;
        $currentRatio = $financialData['currentRatio']['raw'] ?? null;
        $dividendYield = $summaryDetail['dividendYield']['raw'] ?? null;
        $epsGrowth = $keyStatistics['earningsQuarterlyGrowth']['raw'] ?? null;
        $operatingCashFlow = $financialData['operatingCashflow']['raw'] ?? null;

        // Get the latest date we have for this stock
        $latestRecord = DB::table('stock_indicators')
            ->where('stock_id', $stock->id)
            ->orderBy('date', 'desc')
            ->first();

        if ($latestRecord) {
            DB::table('stock_indicators')
                ->where('id', $latestRecord->id)
                ->update([
                    'per' => $per,
                    'pbv' => $pbv,
                    'roe' => $roe ? $roe * 100 : null,
                    'roa' => $roa ? $roa * 100 : null,
                    'der' => $der,
                    'npm' => $npm ? $npm * 100 : null,
                    'current_ratio' => $currentRatio,
                    'dividend_yield' => $dividendYield ? $dividendYield * 100 : null,
                    'eps_growth_yoy' => $epsGrowth ? $epsGrowth * 100 : null,
                    'operating_cash_flow' => $operatingCashFlow,
                ]);
        }
    }

    /**
     * Get aggregate fundamental averages for a sector.
     * Cached until end of day.
     */
    public function getSectorAverages(int $sectorId): array
    {
        return Cache::remember("sector_averages_{$sectorId}", now()->endOfDay(), function () use ($sectorId) {
            $averages = DB::table('stock_indicators')
                ->join('stocks', 'stocks.id', '=', 'stock_indicators.stock_id')
                ->where('stocks.sector_id', $sectorId)
                ->whereIn('stock_indicators.date', function($query) {
                    $query->select(DB::raw('MAX(date)'))->from('stock_indicators')->groupBy('stock_id');
                })
                ->select(
                    DB::raw('AVG(per) as avg_per'),
                    DB::raw('AVG(pbv) as avg_pbv'),
                    DB::raw('AVG(roe) as avg_roe'),
                    DB::raw('AVG(roa) as avg_roa'),
                    DB::raw('AVG(der) as avg_der'),
                    DB::raw('AVG(npm) as avg_npm'),
                    DB::raw('AVG(dividend_yield) as avg_dividend_yield')
                )
                ->first();

            return (array) $averages;
        });
    }

    /**
     * Compare a stock's fundamentals to its sector averages.
     */
    public function compareToSector(Stock $stock): array
    {
        $latestRecord = DB::table('stock_indicators')
            ->where('stock_id', $stock->id)
            ->orderBy('date', 'desc')
            ->first();
            
        if (!$latestRecord || !$stock->sector_id) {
            return [];
        }

        $sectorAverages = $this->getSectorAverages($stock->sector_id);

        return [
            'per' => [
                'value' => $latestRecord->per,
                'sector_avg' => $sectorAverages['avg_per'],
                'status' => ($latestRecord->per < $sectorAverages['avg_per'] && $latestRecord->per > 0) ? 'Undervalued' : 'Overvalued'
            ],
            'pbv' => [
                'value' => $latestRecord->pbv,
                'sector_avg' => $sectorAverages['avg_pbv'],
                'status' => ($latestRecord->pbv < $sectorAverages['avg_pbv'] && $latestRecord->pbv > 0) ? 'Undervalued' : 'Overvalued'
            ],
            'roe' => [
                'value' => $latestRecord->roe,
                'sector_avg' => $sectorAverages['avg_roe'],
                'status' => ($latestRecord->roe > $sectorAverages['avg_roe']) ? 'Good' : 'Below Average'
            ],
            'der' => [
                'value' => $latestRecord->der,
                'sector_avg' => $sectorAverages['avg_der'],
                'status' => ($latestRecord->der < $sectorAverages['avg_der']) ? 'Safe' : 'High Debt'
            ]
        ];
    }
}
