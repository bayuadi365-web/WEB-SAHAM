<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class RSI implements IndicatorInterface
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

        $gains = [];
        $losses = [];

        for ($i = 1; $i <= $this->period; $i++) {
            $currentClose = is_object($data[$i]) ? $data[$i]->close : $data[$i]['close'];
            $prevClose = is_object($data[$i - 1]) ? $data[$i - 1]->close : $data[$i - 1]['close'];
            $change = $currentClose - $prevClose;
            
            $gains[] = max(0, $change);
            $losses[] = max(0, -$change);
        }

        $avgGain = array_sum($gains) / $this->period;
        $avgLoss = array_sum($losses) / $this->period;

        if ($avgLoss == 0) {
            $rsi = 100;
        } else {
            $rs = $avgGain / $avgLoss;
            $rsi = 100 - (100 / (1 + $rs));
        }

        $date = is_object($data[$this->period]) ? $data[$this->period]->date : ($data[$this->period]['date'] ?? $data[$this->period]['time']);
        if (is_numeric($date)) $date = date('Y-m-d', $date);
        $result[$date] = $rsi;

        for ($i = $this->period + 1; $i < $count; $i++) {
            $currentClose = is_object($data[$i]) ? $data[$i]->close : $data[$i]['close'];
            $prevClose = is_object($data[$i - 1]) ? $data[$i - 1]->close : $data[$i - 1]['close'];
            $change = $currentClose - $prevClose;
            
            $gain = max(0, $change);
            $loss = max(0, -$change);

            $avgGain = (($avgGain * ($this->period - 1)) + $gain) / $this->period;
            $avgLoss = (($avgLoss * ($this->period - 1)) + $loss) / $this->period;

            if ($avgLoss == 0) {
                $rsi = 100;
            } else {
                $rs = $avgGain / $avgLoss;
                $rsi = 100 - (100 / (1 + $rs));
            }

            $date = is_object($data[$i]) ? $data[$i]->date : ($data[$i]['date'] ?? $data[$i]['time']);
            if (is_numeric($date)) $date = date('Y-m-d', $date);
            $result[$date] = $rsi;
        }

        return $result;
    }
}
