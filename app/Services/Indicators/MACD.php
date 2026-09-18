<?php

namespace App\Services\Indicators;

use Illuminate\Support\Collection;

class MACD implements IndicatorInterface
{
    protected int $fastPeriod;
    protected int $slowPeriod;
    protected int $signalPeriod;

    public function __construct(int $fastPeriod = 12, int $slowPeriod = 26, int $signalPeriod = 9)
    {
        $this->fastPeriod = $fastPeriod;
        $this->slowPeriod = $slowPeriod;
        $this->signalPeriod = $signalPeriod;
    }

    public function calculate(Collection $ohlcv): array
    {
        $result = [];
        
        $fastEmaCalculator = new EMA($this->fastPeriod);
        $slowEmaCalculator = new EMA($this->slowPeriod);
        
        $fastEma = $fastEmaCalculator->calculate($ohlcv);
        $slowEma = $slowEmaCalculator->calculate($ohlcv);

        $macdLineValues = [];
        $macdLineForSignal = collect();

        foreach ($slowEma as $date => $slowVal) {
            if (isset($fastEma[$date])) {
                $macdVal = $fastEma[$date] - $slowVal;
                $macdLineValues[$date] = $macdVal;
                
                // Construct fake OHLCV for EMA calculator to calculate signal line
                $macdLineForSignal->push(['date' => $date, 'close' => $macdVal]);
            }
        }

        $signalCalculator = new EMA($this->signalPeriod);
        $signalLine = $signalCalculator->calculate($macdLineForSignal);

        foreach ($macdLineValues as $date => $macdVal) {
            $signalVal = $signalLine[$date] ?? null;
            $histVal = $signalVal !== null ? ($macdVal - $signalVal) : null;
            
            $result[$date] = [
                'macd' => $macdVal,
                'signal' => $signalVal,
                'histogram' => $histVal
            ];
        }

        return $result;
    }
}
