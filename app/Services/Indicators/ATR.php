<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class ATR implements IndicatorInterface
{
    protected int $period;

    public function __construct(int $period = 14)
    {
        $this->period = $period;
    }

    public function calculate(Collection $ohlcv): array
    {
        $result = [];
        $data = $ohlcv->values()->toArray();
        $count = count($data);

        if ($count <= $this->period) {
            return [];
        }

        $trueRanges = [];

        // Calculate True Range (TR) for each day
        for ($i = 1; $i < $count; $i++) {
            $currentHigh = (float) (is_object($data[$i]) ? $data[$i]->high : $data[$i]['high']);
            $currentLow = (float) (is_object($data[$i]) ? $data[$i]->low : $data[$i]['low']);
            $prevClose = (float) (is_object($data[$i - 1]) ? $data[$i - 1]->close : $data[$i - 1]['close']);

            $tr1 = $currentHigh - $currentLow;
            $tr2 = abs($currentHigh - $prevClose);
            $tr3 = abs($currentLow - $prevClose);
            
            $trueRanges[] = max($tr1, $tr2, $tr3);
        }

        // Calculate initial ATR (SMA of TR for the first period)
        $atr = 0;
        for ($i = 0; $i < $this->period; $i++) {
            $atr += $trueRanges[$i];
        }
        $atr = $atr / $this->period;

        $dateIndex = $this->period;
        $date = is_object($data[$dateIndex]) ? $data[$dateIndex]->date : ($data[$dateIndex]['date'] ?? $data[$dateIndex]['time']);
        if (is_numeric($date)) $date = date('Y-m-d', $date);
        $result[$date] = $atr;

        // Calculate smoothed ATR for the rest
        for ($i = $this->period; $i < count($trueRanges); $i++) {
            $atr = (($atr * ($this->period - 1)) + $trueRanges[$i]) / $this->period;
            
            $dateIndex = $i + 1;
            $date = is_object($data[$dateIndex]) ? $data[$dateIndex]->date : ($data[$dateIndex]['date'] ?? $data[$dateIndex]['time']);
            if (is_numeric($date)) $date = date('Y-m-d', $date);
            
            $result[$date] = $atr;
        }

        return $result;
    }
}
