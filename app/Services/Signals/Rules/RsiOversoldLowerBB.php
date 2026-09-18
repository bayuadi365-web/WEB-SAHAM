<?php

namespace App\Services\Signals\Rules;

use App\Services\Signals\Signal;

class RsiOversoldLowerBB implements SignalRuleInterface
{
    public function evaluate(array $indicators): ?Signal
    {
        if (
            !isset($indicators['rsi_14']) ||
            !isset($indicators['bb_lower']) ||
            !isset($indicators['close']) // Requires close price passed in indicators array
        ) {
            return null;
        }

        $isOversold = $indicators['rsi_14'] < 30;
        $isAtLowerBB = $indicators['close'] <= ($indicators['bb_lower'] * 1.02); // Within 2% of lower BB

        if ($isOversold && $isAtLowerBB) {
            return new Signal(
                'Oversold Rebound (RSI + BB)',
                'bullish',
                75,
                'Saham berada di kondisi oversold ekstrim (RSI < 30) dan menyentuh batas bawah Bollinger Bands. Potensi technical rebound.'
            );
        }

        return null;
    }
}
