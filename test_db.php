<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$count = \Illuminate\Support\Facades\DB::table('stock_indicators')->count();
echo "Count: " . $count . "\n";

$first = \Illuminate\Support\Facades\DB::table('stock_indicators')->first();
print_r($first);
