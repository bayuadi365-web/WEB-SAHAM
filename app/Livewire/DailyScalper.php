<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Stock;

class DailyScalper extends Component
{
    use WithPagination;

    public $strategy = 'volume_breakout';
    public $useFundamentalFilter = true;

    public function setStrategy($strategy)
    {
        $this->strategy = $strategy;
        $this->resetPage();
    }

    public function render()
    {
        // Join with indicators and fundamentals for efficient filtering
        $query = Stock::query()
            ->with(['latestIndicator', 'fundamentals'])
            ->whereHas('latestIndicator')
            ->where('price', '>', 50);

        if ($this->useFundamentalFilter) {
            $query->whereHas('fundamentals', function ($q) {
                $q->where('npm', '>', 0)
                  ->where('roe', '>', 0);
            })->where('market_cap', '>', 1000000000000); 
        }

        if ($this->strategy === 'volume_breakout') {
            $query->whereHas('latestIndicator', function ($q) {
                $q->whereColumn('stocks.volume', '>', 'stock_indicators.volume_ma_20')
                  ->whereColumn('stocks.price', '>', 'stock_indicators.ema_20')
                  ->where('macd_line', '>', 0);
            });
        } elseif ($this->strategy === 'oversold_bounce') {
            $query->whereHas('latestIndicator', function ($q) {
                $q->where('rsi_14', '<', 30)
                  ->whereColumn('stoch_k', '>', 'stoch_d');
            });
        }

        $query->orderBy('volume', 'desc');

        return view('livewire.daily-scalper', [
            'stocks' => $query->paginate(20)
        ])->layout('layouts.app');
    }
}
