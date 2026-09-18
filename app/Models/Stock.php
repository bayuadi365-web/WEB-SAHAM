<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stock extends Model
{
    protected $guarded = [];

    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    public function fundamentals(): HasOne
    {
        return $this->hasOne(StockFundamental::class);
    }

    public function indicators(): HasMany
    {
        return $this->hasMany(StockIndicator::class);
    }

    public function latestIndicator(): HasOne
    {
        return $this->hasOne(StockIndicator::class)->latestOfMany('date');
    }

    public function news(): HasMany
    {
        return $this->hasMany(StockNews::class);
    }
}
