<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class EMA implements IndicatorInterface
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

        if ($count < $this->period) {
            return [];
        }

        $k = 2 / ($this->period + 1);
        $ema = 0;

        // Calculate initial SMA
        for ($i = 0; $i < $this->period; $i++) {
            $close = is_object($data[$i]) ? $data[$i]->close : $data[$i]['close'];
            $ema += (float) $close;
        }
        $ema = $ema / $this->period;
        
        $date = is_object($data[$this->period - 1]) ? $data[$this->period - 1]->date : ($data[$this->period - 1]['date'] ?? $data[$this->period - 1]['time']);
        if (is_numeric($date)) $date = date('Y-m-d', $date);
        $result[$date] = $ema;

        // Calculate EMA for the rest
        for ($i = $this->period; $i < $count; $i++) {
            $close = is_object($data[$i]) ? $data[$i]->close : $data[$i]['close'];
            $ema = (($close - $ema) * $k) + $ema;
            
            $date = is_object($data[$i]) ? $data[$i]->date : ($data[$i]['date'] ?? $data[$i]['time']);
            if (is_numeric($date)) $date = date('Y-m-d', $date);
            
            $result[$date] = $ema;
        }

        return $result;
    }
}
