<?php

namespace App\Services;

use App\Models\Stock;

class SignalEngine
{
    /**
     * Get the top AI picks based on technical and fundamental scoring.
     */
    public function getTopPicks($limit = 5)
    {
        $stocks = Stock::with(['sector', 'latestIndicator'])->get();
        $scoredStocks = [];

        foreach ($stocks as $stock) {
            $indicator = $stock->latestIndicator;
            
            // Skip if no indicator data
            if (!$indicator) continue;

            $score = 0;
            $reasons = [];

            // 1. MACD Momentum (Max 35)
            $macdHist = $indicator->macd_histogram;
            if ($macdHist !== null) {
                if ($macdHist > 0) {
                    $score += 35;
                    $reasons[] = 'MACD Bullish';
                } elseif ($macdHist > -10 && $macdHist < 0) {
                    // Reversing from bearish
                    $score += 15;
                }
            }

            // 2. Trend & Strength (Max 35)
            $sma20 = $indicator->sma_20;
            $sma50 = $indicator->sma_50;
            if ($sma20 !== null && $sma50 !== null) {
                if ($sma20 > $sma50) {
                    $score += 20;
                    $reasons[] = 'Uptrend (SMA20 > 50)';
                }
            }

            $rsi = $indicator->rsi_14;
            if ($rsi !== null) {
                if ($rsi >= 40 && $rsi <= 65) {
                    $score += 15;
                    $reasons[] = 'RSI Sehat';
                } elseif ($rsi > 20 && $rsi < 40) {
                    // Oversold bounce potential
                    $score += 10;
                    $reasons[] = 'Potensi Rebound (Oversold)';
                }
            }

            // 3. Fundamentals / Valuation (Max 30)
            $per = $indicator->per;
            $pbv = $indicator->pbv;
            
            $isUndervalued = false;
            if ($per !== null && $per > 0 && $per < 15) {
                $score += 15;
                $isUndervalued = true;
            }
            if ($pbv !== null && $pbv > 0 && $pbv < 2) {
                $score += 15;
                $isUndervalued = true;
            }

            if ($isUndervalued) {
                $reasons[] = 'Valuasi Undervalued';
            }

            // Cap score at 100
            $score = min($score, 100);

            // Only consider stocks with score > 0 to save processing
            if ($score > 40) {
                $scoredStocks[] = [
                    'stock' => $stock,
                    'score' => $score,
                    'reasons' => array_slice($reasons, 0, 3) // Keep top 3 reasons
                ];
            }
        }

        // Sort by score descending
        usort($scoredStocks, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        // Return top N
        return array_slice($scoredStocks, 0, $limit);
    }
}
