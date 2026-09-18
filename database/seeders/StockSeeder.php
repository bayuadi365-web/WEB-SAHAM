<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = file_get_contents(database_path('seeders/stocks_data.json'));
        $data = json_decode($json, true);
        
        $stocks = $data['idxStocks'] ?? [];
        
        foreach ($stocks as $stock) {
            // Upsert sector
            $sectorSlug = \Illuminate\Support\Str::slug($stock['sector'] ?? 'Unknown');
            $sector = \App\Models\Sector::firstOrCreate(
                ['slug' => $sectorSlug],
                [
                    'name' => $stock['sector'] ?? 'Unknown',
                    'icon' => null,
                    'change' => 0,
                    'index_value' => 0
                ]
            );
            
            // Create stock
            $dbStock = \App\Models\Stock::create([
                'ticker' => $stock['ticker'],
                'symbol' => $stock['symbol'] ?? ($stock['ticker'] . '.JK'),
                'name' => $stock['name'],
                'sector_id' => $sector->id,
                'sub_sector' => $stock['subSector'] ?? null,
                'price' => $stock['price'] ?? 0,
                'change' => $stock['change'] ?? 0,
                'change_percent' => $stock['changePercent'] ?? 0,
                'previous_close' => $stock['previousClose'] ?? 0,
                'open' => $stock['open'] ?? 0,
                'day_high' => $stock['dayHigh'] ?? 0,
                'day_low' => $stock['dayLow'] ?? 0,
                'volume' => $stock['volume'] ?? 0,
                'turnover' => $stock['turnover'] ?? 0,
                'market_cap' => $stock['marketCap'] ?? 0,
                'shares_outstanding' => $stock['sharesOutstanding'] ?? 0,
                'fifty_two_week_high' => $stock['fiftyTwoWeekHigh'] ?? null,
                'fifty_two_week_low' => $stock['fiftyTwoWeekLow'] ?? null,
                'description' => $stock['description'] ?? null,
            ]);
            
            // Fundamentals
            if (isset($stock['valuation']) || isset($stock['profitability'])) {
                $val = $stock['valuation'] ?? [];
                $prof = $stock['profitability'] ?? [];
                $div = $stock['dividend'] ?? [];
                $bs = $stock['balanceSheet'] ?? [];
                $gr = $stock['growth'] ?? [];
                
                \App\Models\StockFundamental::create([
                    'stock_id' => $dbStock->id,
                    'pe_ratio' => $val['peRatio'] ?? null,
                    'pbv_ratio' => $val['pbvRatio'] ?? null,
                    'ev_ebitda' => $val['evEbitda'] ?? null,
                    'ps_ratio' => $val['psRatio'] ?? null,
                    'roe' => $prof['roe'] ?? null,
                    'roa' => $prof['roa'] ?? null,
                    'npm' => $prof['npm'] ?? null,
                    'gpm' => $prof['gpm'] ?? null,
                    'operating_margin' => $prof['operatingMargin'] ?? null,
                    'der' => $bs['der'] ?? null,
                    'current_ratio' => $bs['currentRatio'] ?? null,
                    'quick_ratio' => $bs['quickRatio'] ?? null,
                    'car' => $bs['car'] ?? null,
                    'revenue_growth_yoy' => $gr['revenueGrowthYoY'] ?? null,
                    'net_income_growth_yoy' => $gr['netIncomeGrowthYoY'] ?? null,
                    'eps_growth' => $gr['epsGrowth'] ?? null,
                    'dividend_yield' => $div['dividendYield'] ?? null,
                    'dividend_payout_ratio' => $div['dividendPayoutRatio'] ?? null,
                    'dps' => $div['dps'] ?? null,
                ]);
            }
        }
    }
}
