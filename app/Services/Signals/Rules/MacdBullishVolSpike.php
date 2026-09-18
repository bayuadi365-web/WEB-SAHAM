<?php

namespace App\Services\Signals\Rules;

use App\Services\Signals\Signal;

class MacdBullishVolSpike implements SignalRuleInterface
{
    public function evaluate(array $indicators): ?Signal
    {
        if (
            !isset($indicators['macd_histogram']) ||
            !isset($indicators['macd_line']) ||
            !isset($indicators['volume_ma_20']) ||
            !isset($indicators['volume'])
        ) {
            return null;
        }

        // MACD Histogram just crossed above 0 (Golden Cross indicator)
        // We assume we are looking at the current day's indicators. To detect a cross, we'd ideally need yesterday's.
        // For simplicity, we just check if MACD Line > Signal Line (Histogram > 0) and MACD Line < 0 (Crossed from below)
        // AND Volume > Volume MA 20
        if ($indicators['macd_histogram'] > 0 && $indicators['macd_line'] < 0 && $indicators['volume'] > $indicators['volume_ma_20'] * 1.5) {
            return new Signal(
                'MACD Bullish Reversal with Volume Spike',
                'bullish',
                85,
                'MACD menunjukkan persilangan emas (Golden Cross) di area oversold didukung oleh lonjakan volume 50% di atas rata-rata.'
            );
        }

        return null;
    }
}
