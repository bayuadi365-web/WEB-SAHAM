<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class ADX implements IndicatorInterface
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

        $tr = [];
        $plusDm = [];
        $minusDm = [];

        // Calculate +DM, -DM, and TR for each day
        for ($i = 1; $i < $count; $i++) {
            $currentHigh = (float) (is_object($data[$i]) ? $data[$i]->high : $data[$i]['high']);
            $currentLow = (float) (is_object($data[$i]) ? $data[$i]->low : $data[$i]['low']);
            $prevHigh = (float) (is_object($data[$i - 1]) ? $data[$i - 1]->high : $data[$i - 1]['high']);
            $prevLow = (float) (is_object($data[$i - 1]) ? $data[$i - 1]->low : $data[$i - 1]['low']);
            $prevClose = (float) (is_object($data[$i - 1]) ? $data[$i - 1]->close : $data[$i - 1]['close']);

            $upMove = $currentHigh - $prevHigh;
            $downMove = $prevLow - $currentLow;

            $pdm = ($upMove > $downMove && $upMove > 0) ? $upMove : 0;
            $mdm = ($downMove > $upMove && $downMove > 0) ? $downMove : 0;

            $tr1 = $currentHigh - $currentLow;
            $tr2 = abs($currentHigh - $prevClose);
            $tr3 = abs($currentLow - $prevClose);
            $trueRange = max($tr1, $tr2, $tr3);

            $tr[] = $trueRange;
            $plusDm[] = $pdm;
            $minusDm[] = $mdm;
        }

        // Calculate initial smoothed +DM, -DM, TR
        $smoothedTr = 0;
        $smoothedPdm = 0;
        $smoothedMdm = 0;

        for ($i = 0; $i < $this->period; $i++) {
            $smoothedTr += $tr[$i];
            $smoothedPdm += $plusDm[$i];
            $smoothedMdm += $minusDm[$i];
        }

        $dx = [];

        $plusDi = $smoothedTr == 0 ? 0 : 100 * ($smoothedPdm / $smoothedTr);
        $minusDi = $smoothedTr == 0 ? 0 : 100 * ($smoothedMdm / $smoothedTr);
        $dxValue = ($plusDi + $minusDi) == 0 ? 0 : 100 * abs($plusDi - $minusDi) / ($plusDi + $minusDi);
        $dx[] = $dxValue;

        // Calculate smoothed values for the rest
        for ($i = $this->period; $i < count($tr); $i++) {
            $smoothedTr = $smoothedTr - ($smoothedTr / $this->period) + $tr[$i];
            $smoothedPdm = $smoothedPdm - ($smoothedPdm / $this->period) + $plusDm[$i];
            $smoothedMdm = $smoothedMdm - ($smoothedMdm / $this->period) + $minusDm[$i];

            $plusDi = $smoothedTr == 0 ? 0 : 100 * ($smoothedPdm / $smoothedTr);
            $minusDi = $smoothedTr == 0 ? 0 : 100 * ($smoothedMdm / $smoothedTr);
            $dxValue = ($plusDi + $minusDi) == 0 ? 0 : 100 * abs($plusDi - $minusDi) / ($plusDi + $minusDi);
            $dx[] = $dxValue;
        }

        // Calculate ADX (SMA of DX)
        $adx = 0;
        for ($i = 0; $i < $this->period; $i++) {
            $adx += $dx[$i];
        }
        $adx = $adx / $this->period;

        $dateIndex = $this->period * 2 - 1; // ADX starts later
        if ($dateIndex < $count) {
            $date = is_object($data[$dateIndex]) ? $data[$dateIndex]->date : ($data[$dateIndex]['date'] ?? $data[$dateIndex]['time']);
            if (is_numeric($date)) $date = date('Y-m-d', $date);
            $result[$date] = $adx;
        }

        for ($i = $this->period; $i < count($dx); $i++) {
            $adx = (($adx * ($this->period - 1)) + $dx[$i]) / $this->period;
            
            $dateIndex = $i + $this->period;
            if ($dateIndex < $count) {
                $date = is_object($data[$dateIndex]) ? $data[$dateIndex]->date : ($data[$dateIndex]['date'] ?? $data[$dateIndex]['time']);
                if (is_numeric($date)) $date = date('Y-m-d', $date);
                $result[$date] = $adx;
            }
        }

        return $result;
    }
}
