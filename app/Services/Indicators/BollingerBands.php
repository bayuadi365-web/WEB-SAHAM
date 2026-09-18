<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class BollingerBands implements IndicatorInterface
{
    protected int $period;
    protected float $stdDevMultiplier;

    public function __construct(int $period = 20, float $stdDevMultiplier = 2.0)
    {
        $this->period = $period;
        $this->stdDevMultiplier = $stdDevMultiplier;
    }

    public function calculate(Collection $ohlcv): array
    {
        $result = [];
        $data = $ohlcv->values()->toArray();
        $count = count($data);

        for ($i = $this->period - 1; $i < $count; $i++) {
            $sum = 0;
            $prices = [];
            
            for ($j = 0; $j < $this->period; $j++) {
                $close = is_object($data[$i - $j]) ? $data[$i - $j]->close : $data[$i - $j]['close'];
                $val = (float) $close;
                $sum += $val;
                $prices[] = $val;
            }
            $sma = $sum / $this->period;
            
            $varianceSum = 0;
            foreach ($prices as $price) {
                $varianceSum += pow($price - $sma, 2);
            }
            $stdDev = sqrt($varianceSum / $this->period);
            
            $date = is_object($data[$i]) ? $data[$i]->date : ($data[$i]['date'] ?? $data[$i]['time']);
            if (is_numeric($date)) $date = date('Y-m-d', $date);
            
            $result[$date] = [
                'upper' => $sma + ($this->stdDevMultiplier * $stdDev),
                'middle' => $sma,
                'lower' => $sma - ($this->stdDevMultiplier * $stdDev),
            ];
        }

        return $result;
    }
}
