<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class OBV implements IndicatorInterface
{
    public function calculate(Collection $ohlcv): array
    {
        $result = [];
        $data = $ohlcv->values()->toArray();
        $count = count($data);

        if ($count == 0) {
            return [];
        }

        $obv = 0;
        
        $date = is_object($data[0]) ? $data[0]->date : ($data[0]['date'] ?? $data[0]['time']);
        if (is_numeric($date)) $date = date('Y-m-d', $date);
        
        $result[$date] = $obv;

        for ($i = 1; $i < $count; $i++) {
            $currentClose = (float) (is_object($data[$i]) ? $data[$i]->close : $data[$i]['close']);
            $prevClose = (float) (is_object($data[$i - 1]) ? $data[$i - 1]->close : $data[$i - 1]['close']);
            $volume = (float) (is_object($data[$i]) ? $data[$i]->volume : $data[$i]['volume']);

            if ($currentClose > $prevClose) {
                $obv += $volume;
            } elseif ($currentClose < $prevClose) {
                $obv -= $volume;
            }
            
            $date = is_object($data[$i]) ? $data[$i]->date : ($data[$i]['date'] ?? $data[$i]['time']);
            if (is_numeric($date)) $date = date('Y-m-d', $date);
            
            $result[$date] = $obv;
        }

        return $result;
    }
}
