<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class Stochastic implements IndicatorInterface
{
    protected int $kPeriod;
    protected int $dPeriod;

    public function __construct(int $kPeriod = 14, int $dPeriod = 3)
    {
        $this->kPeriod = $kPeriod;
        $this->dPeriod = $dPeriod;
    }

    public function calculate(Collection $ohlcv): array
    {
        $result = [];
        $data = $ohlcv->values()->toArray();
        $count = count($data);

        if ($count < $this->kPeriod) {
            return [];
        }

        $kValues = [];

        for ($i = $this->kPeriod - 1; $i < $count; $i++) {
            $highestHigh = -INF;
            $lowestLow = INF;
            
            for ($j = 0; $j < $this->kPeriod; $j++) {
                $high = (float) (is_object($data[$i - $j]) ? $data[$i - $j]->high : $data[$i - $j]['high']);
                $low = (float) (is_object($data[$i - $j]) ? $data[$i - $j]->low : $data[$i - $j]['low']);
                
                if ($high > $highestHigh) $highestHigh = $high;
                if ($low < $lowestLow) $lowestLow = $low;
            }
            
            $close = (float) (is_object($data[$i]) ? $data[$i]->close : $data[$i]['close']);
            
            $k = 0;
            if ($highestHigh - $lowestLow != 0) {
                $k = (($close - $lowestLow) / ($highestHigh - $lowestLow)) * 100;
            }
            
            $date = is_object($data[$i]) ? $data[$i]->date : ($data[$i]['date'] ?? $data[$i]['time']);
            if (is_numeric($date)) $date = date('Y-m-d', $date);
            
            $kValues[$date] = $k;
        }

        // Calculate %D (SMA of %K)
        $kDates = array_keys($kValues);
        $kVals = array_values($kValues);
        
        for ($i = $this->dPeriod - 1; $i < count($kVals); $i++) {
            $sum = 0;
            for ($j = 0; $j < $this->dPeriod; $j++) {
                $sum += $kVals[$i - $j];
            }
            $d = $sum / $this->dPeriod;
            
            $date = $kDates[$i];
            
            $result[$date] = [
                'k' => $kVals[$i],
                'd' => $d
            ];
        }

        return $result;
    }
}
