<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Stock;
use App\Models\Sector;
use Illuminate\Database\Eloquent\Builder;

class Screener extends Component
{
    use WithPagination;

    // Filters
    public $search = '';
    public $sector_id = '';
    
    // Technical Filters
    public $min_rsi = '';
    public $max_rsi = '';
    public $trend = ''; // 'golden_cross', 'bullish_macd'
    
    // Fundamental Filters
    public $max_per = '';
    public $max_pbv = '';
    public $min_roe = '';

    protected $queryString = [
        'search' => ['except' => ''],
        'sector_id' => ['except' => ''],
        'min_rsi' => ['except' => ''],
        'max_rsi' => ['except' => ''],
        'trend' => ['except' => ''],
        'max_per' => ['except' => ''],
        'max_pbv' => ['except' => ''],
        'min_roe' => ['except' => ''],
    ];

    public function updating($name, $value)
    {
        $this->resetPage();
    }

    public function clearFilters()
    {
        $this->reset(['search', 'sector_id', 'min_rsi', 'max_rsi', 'trend', 'max_per', 'max_pbv', 'min_roe']);
        $this->resetPage();
    }

    public function render()
    {
        $sectors = Sector::orderBy('name')->get();

        $query = Stock::query()
            ->with(['sector', 'latestIndicator']);

        // Apply Search
        if ($this->search) {
            $query->where(function ($q) {
                $q->where('ticker', 'like', '%' . $this->search . '%')
                  ->orWhere('name', 'like', '%' . $this->search . '%');
            });
        }

        // Apply Sector
        if ($this->sector_id) {
            $query->where('sector_id', $this->sector_id);
        }

        // Apply Technical & Fundamental Filters (which rely on the latest_indicator relation)
        $hasIndicatorFilters = $this->min_rsi || $this->max_rsi || $this->trend || $this->max_per || $this->max_pbv || $this->min_roe;

        if ($hasIndicatorFilters) {
            $query->whereHas('latestIndicator', function (Builder $q) {
                // RSI
                if ($this->min_rsi) {
                    $q->where('rsi_14', '>=', $this->min_rsi);
                }
                if ($this->max_rsi) {
                    $q->where('rsi_14', '<=', $this->max_rsi);
                }
                
                // Trend / Golden Cross
                if ($this->trend === 'golden_cross') {
                    $q->whereColumn('sma_50', '>', 'sma_200');
                } elseif ($this->trend === 'bullish_macd') {
                    $q->where('macd_histogram', '>', 0);
                }

                // Fundamentals
                if ($this->max_per) {
                    $q->where('per', '<=', $this->max_per)->where('per', '>', 0);
                }
                if ($this->max_pbv) {
                    $q->where('pbv', '<=', $this->max_pbv)->where('pbv', '>', 0);
                }
                if ($this->min_roe) {
                    $q->where('roe', '>=', $this->min_roe);
                }
            });
        }

        $stocks = $query->paginate(20);

        // Get Top Picks from Signal Engine
        $signalEngine = new \App\Services\SignalEngine();
        $topPicks = $signalEngine->getTopPicks(5);

        return view('livewire.screener', [
            'stocks' => $stocks,
            'sectors' => $sectors,
            'topPicks' => $topPicks,
        ])->layout('layouts.app');
    }
}
