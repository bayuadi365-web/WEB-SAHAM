<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Stock;

class SeedIdxStocks extends Command
{
    protected $signature = 'app:seed-idx-stocks';
    protected $description = 'Seed IDX stocks from local Gist JSON';

    public function handle()
    {
        $filePath = 'C:\Users\Admin\.gemini\antigravity-ide\brain\341fe7b4-fc68-4f5a-a7ae-3916348151b0\.system_generated\steps\541\content.md';
        $content = file_get_contents($filePath);
        
        // Find the JSON part
        preg_match('/\{.*\}/s', $content, $matches);
        if (empty($matches)) {
            $this->error('No JSON found in file');
            return;
        }
        
        $jsonStr = $matches[0];
        // The Gist JSON has some trailing commas or issues? Let's just decode it.
        // Wait, the JSON in the gist is actually valid JSON.
        $data = json_decode($jsonStr, true);
        
        if (!$data) {
            $this->error('Failed to parse JSON: ' . json_last_error_msg());
            return;
        }
        
        $allTickers = [];
        foreach ($data as $category => $tickers) {
            foreach ($tickers as $ticker) {
                // Ignore warrants (e.g. BULL-W2)
                if (strpos($ticker, '-') === false && strlen($ticker) === 4) {
                    $allTickers[] = $ticker;
                }
            }
        }
        
        $uniqueTickers = array_unique($allTickers);
        $this->info("Found " . count($uniqueTickers) . " unique tickers.");
        
        $count = 0;
        foreach ($uniqueTickers as $ticker) {
            $stock = Stock::firstOrCreate(
                ['ticker' => $ticker],
                [
                    'symbol' => $ticker . '.JK',
                    'name' => $ticker, // Temporary name
                    'price' => 0
                ]
            );
            
            if ($stock->wasRecentlyCreated) {
                $count++;
            }
        }
        
        $this->info("Seeded $count new stocks.");
    }
}
