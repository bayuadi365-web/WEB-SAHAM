<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

class QuickSync {
    public function run() {
        $stocks = \App\Models\Stock::limit(30)->get();
        echo "Syncing 30 stocks...\n";
        
        $command = app(\App\Console\Commands\SyncDailyIndicators::class);
        $fundamentalService = app(\App\Services\FundamentalAnalysisService::class);
        
        $method = new ReflectionMethod($command, 'fetchOhlcv');
        $method->setAccessible(true);
        
        $calcMethod = new ReflectionMethod($command, 'calculateAndStoreIndicators');
        $calcMethod->setAccessible(true);

        foreach($stocks as $stock) {
            echo "Syncing {$stock->ticker}...\n";
            $ohlcv = $method->invoke($command, $stock->ticker);
            if (!$ohlcv->isEmpty()) {
                $calcMethod->invoke($command, $stock, $ohlcv);
                $fundamentalService->syncFundamentals($stock);
            }
        }
        echo "Done.\n";
    }
}

(new QuickSync())->run();
