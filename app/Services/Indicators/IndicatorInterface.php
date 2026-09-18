<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

interface IndicatorInterface
{
    /**
     * Calculate the technical indicator based on OHLCV data.
     * 
     * @param Collection $ohlcv A collection of OHLCV arrays or objects (date, open, high, low, close, volume)
     * @return array An associative array keyed by date (e.g. ['2023-10-01' => 1500, ...])
     */
    public function calculate(Collection $ohlcv): array;
}
