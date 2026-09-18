<?php

namespace App\Services\Signals;

class Signal
{
    public string $name;
    public string $type; // 'bullish', 'bearish', 'neutral'
    public int $confidence; // 0-100
    public string $explanation;

    public function __construct(string $name, string $type, int $confidence, string $explanation)
    {
        $this->name = $name;
        $this->type = $type;
        $this->confidence = $confidence;
        $this->explanation = $explanation;
    }
}
