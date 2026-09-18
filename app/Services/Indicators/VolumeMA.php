<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class VolumeMA implements IndicatorInterface
{
    protected int $period;

    public function __construct(int $period = 20)
    {
        $this->period = $period;
    }

    public function calculate(Collection $ohlcv): array
    {
        $result = [];
        $data = $ohlcv->values()->toArray();
        $count = count($data);

        for ($i = $this->period - 1; $i < $count; $i++) {
            $sum = 0;
            for ($j = 0; $j < $this->period; $j++) {
                $volume = is_object($data[$i - $j]) ? $data[$i - $j]->volume : $data[$i - $j]['volume'];
                $sum += (float) $volume;
            }
            
            $date = is_object($data[$i]) ? $data[$i]->date : ($data[$i]['date'] ?? $data[$i]['time']);
            if (is_numeric($date)) $date = date('Y-m-d', $date);
            
            $result[$date] = $sum / $this->period;
        }

        return $result;
    }
}
