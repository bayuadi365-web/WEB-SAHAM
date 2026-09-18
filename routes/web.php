<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StockController;
use App\Http\Controllers\WatchlistController;
use App\Livewire\Screener;

use App\Http\Controllers\NewsController;

Route::get('/', [StockController::class, 'dashboard'])->name('home');
Route::get('/stocks', [StockController::class, 'index'])->name('stocks.index');
Route::get('/stocks/{ticker}', [StockController::class, 'show'])->name('stocks.show');
Route::get('/screener', Screener::class)->name('screener');
Route::get('/watchlist', [WatchlistController::class, 'index'])->name('watchlist');
Route::get('/news', [NewsController::class, 'index'])->name('news.index');

// API Routes for frontend dynamic fetching
Route::get('/api/search', [StockController::class, 'apiSearch']);
Route::post('/api/watchlist/toggle', [WatchlistController::class, 'toggle']);
Route::get('/api/chart/{ticker}', [StockController::class, 'apiChart']);
