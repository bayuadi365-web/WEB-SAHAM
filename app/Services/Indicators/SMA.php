<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class SMA implements IndicatorInterface
{
    protected int $period;

    public function __construct(int $period = 20)
    {
        $this->period = $period;
    }

    public function calculate(Collection $ohlcv): array
    {
        $result = [];
        $data = $ohlcv->values()->toArray(); // Ensure sequential indexing
        $count = count($data);

        for ($i = $this->period - 1; $i < $count; $i++) {
            $sum = 0;
            for ($j = 0; $j < $this->period; $j++) {
                // Determine structure: array vs object
                $close = is_object($data[$i - $j]) ? $data[$i - $j]->close : $data[$i - $j]['close'];
                $sum += (float) $close;
            }
            $date = is_object($data[$i]) ? $data[$i]->date : ($data[$i]['date'] ?? $data[$i]['time']);
            
            // Format timestamp into date if it's numeric/unix
            if (is_numeric($date)) {
                $date = date('Y-m-d', $date);
            }
            
            $result[$date] = $sum / $this->period;
        }

        return $result;
    }
}
