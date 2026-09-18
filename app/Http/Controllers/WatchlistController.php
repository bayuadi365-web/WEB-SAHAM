<?php

namespace App\Http\Controllers;

use App\Models\Watchlist;
use Illuminate\Http\Request;

class WatchlistController extends Controller
{
    public function index()
    {
        $session_id = session()->getId();
        $watchlist = Watchlist::where('session_id', $session_id)->pluck('ticker')->toArray();
        if (empty($watchlist)) {
            $watchlist = ['BBCA', 'BBRI', 'TLKM', 'ASII', 'GOTO'];
        }
        
        $watchedStockObjects = \App\Models\Stock::with(['fundamentals', 'sector'])->whereIn('ticker', $watchlist)->get();
        return view('watchlist.index', compact('watchedStockObjects', 'watchlist'));
    }

    public function toggle(Request $request)
    {
        $ticker = $request->input('ticker');
        $session_id = session()->getId();
        
        if (!$ticker) {
            return response()->json(['success' => false]);
        }
        
        $existing = Watchlist::where('session_id', $session_id)->where('ticker', $ticker)->first();
        
        if ($existing) {
            $existing->delete();
            $added = false;
        } else {
            Watchlist::create([
                'session_id' => $session_id,
                'ticker' => $ticker
            ]);
            $added = true;
        }
        
        return response()->json([
            'success' => true,
            'added' => $added,
            'watchlist' => Watchlist::where('session_id', $session_id)->pluck('ticker')
        ]);
    }
}
