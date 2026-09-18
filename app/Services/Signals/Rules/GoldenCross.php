<?php

namespace App\Services\Signals\Rules;

use App\Services\Signals\Signal;

class GoldenCross implements SignalRuleInterface
{
    public function evaluate(array $indicators): ?Signal
    {
        if (!isset($indicators['sma_50']) || !isset($indicators['sma_200'])) {
            return null;
        }

        // Simplistic Golden Cross check (just current status for today).
        // A true golden cross is when 50 crosses 200 today.
        // For our screener, we just flag if 50 > 200 as "Bullish Trend" (Golden Cross active)
        // If we want exact crossing, we'd need yesterday's data too.
        
        if ($indicators['sma_50'] > $indicators['sma_200']) {
            // Check if it's a recent cross by checking if they are very close
            $diff = ($indicators['sma_50'] - $indicators['sma_200']) / $indicators['sma_200'];
            if ($diff < 0.05) { // within 5% means recent/imminent
                return new Signal(
                    'Golden Cross (Recent)',
                    'bullish',
                    80,
                    'SMA 50 baru saja atau sedang memotong SMA 200 ke atas, menandakan potensi tren naik jangka panjang.'
                );
            }
        }

        return null;
    }
}
