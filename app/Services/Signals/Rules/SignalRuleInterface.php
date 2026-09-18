<?php

namespace App\Services\Signals\Rules;

use App\Services\Signals\Signal;

interface SignalRuleInterface
{
    /**
     * Evaluate the indicators for a specific date and return a Signal if matched.
     *
     * @param array $indicators The associative array of all technical indicators for a specific date
     * @return Signal|null Returns a Signal object if the rule is met, otherwise null.
     */
    public function evaluate(array $indicators): ?Signal;
}
