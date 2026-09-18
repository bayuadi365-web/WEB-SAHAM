<?php

namespace App\Services;

use App\Models\Stock;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class NewsService
{
    // RSS Feeds from public sources
    protected $feeds = [
        'CNBC Indonesia' => 'https://www.cnbcindonesia.com/market/rss',
        'Kontan' => 'https://rss.kontan.co.id/news/bursa',
    ];

    // Positive keywords in Indonesian
    protected $positiveWords = [
        'naik', 'laba', 'dividen', 'borong', 'rekor', 'untung', 'cuan', 'lonjakan', 'meroket', 'bullish', 'surplus', 'akumulasi', 'potensi'
    ];

    // Negative keywords in Indonesian
    protected $negativeWords = [
        'turun', 'rugi', 'jual', 'anjlok', 'suspensi', 'merah', 'bearish', 'defisit', 'distribusi', 'koreksi', 'ambruk', 'jeblok'
    ];

    /**
     * Get aggregated news from all feeds.
     * Caches the result for only 1 minute to ensure data is highly up-to-date for scalpers.
     */
    public function getAggregatedNews()
    {
        return Cache::remember('aggregated_news', 60, function () {
            $newsList = [];
            $allTickers = Stock::pluck('ticker')->toArray();

            foreach ($this->feeds as $source => $url) {
                try {
                    $xmlString = Http::timeout(5)->get($url)->body();
                    
                    if (empty($xmlString)) {
                        continue;
                    }

                    $xml = simplexml_load_string($xmlString, 'SimpleXMLElement', LIBXML_NOCDATA);
                    if (!$xml || !isset($xml->channel->item)) {
                        continue;
                    }

                    foreach ($xml->channel->item as $item) {
                        $title = (string) $item->title;
                        $description = (string) $item->description;
                        $link = (string) $item->link;
                        $pubDate = (string) $item->pubDate;
                        
                        // Parse date to timestamp for sorting
                        $timestamp = strtotime($pubDate);

                        $extractedTickers = $this->extractTickers($title . ' ' . $description, $allTickers);
                        $sentiment = $this->analyzeSentiment($title . ' ' . $description);

                        $newsList[] = [
                            'title' => $title,
                            'description' => strip_tags($description),
                            'link' => $link,
                            'source' => $source,
                            'pubDate' => date('d M Y, H:i', $timestamp) . ' WIB',
                            'timestamp' => $timestamp,
                            'tickers' => $extractedTickers,
                            'sentiment' => $sentiment,
                        ];
                    }
                } catch (\Exception $e) {
                    // Log error or silently continue if a feed is down
                    continue;
                }
            }

            // Sort by latest timestamp
            usort($newsList, function ($a, $b) {
                return $b['timestamp'] <=> $a['timestamp'];
            });

            return $newsList;
        });
    }

    /**
     * Extract stock tickers (e.g. BBCA, GOTO) from text.
     */
    protected function extractTickers(string $text, array $validTickers): array
    {
        $foundTickers = [];
        // Match 4-letter uppercase words
        preg_match_all('/\b[A-Z]{4}\b/', $text, $matches);
        
        if (!empty($matches[0])) {
            foreach ($matches[0] as $match) {
                if (in_array($match, $validTickers)) {
                    $foundTickers[] = $match;
                }
            }
        }
        
        return array_unique($foundTickers);
    }

    /**
     * Basic sentiment analysis based on keywords.
     * Returns: 'positive', 'negative', or 'neutral'
     */
    protected function analyzeSentiment(string $text): string
    {
        $textLower = strtolower($text);
        
        $positiveScore = 0;
        $negativeScore = 0;

        foreach ($this->positiveWords as $word) {
            if (Str::contains($textLower, $word)) {
                $positiveScore++;
            }
        }

        foreach ($this->negativeWords as $word) {
            if (Str::contains($textLower, $word)) {
                $negativeScore++;
            }
        }

        if ($positiveScore > $negativeScore) {
            return 'positive';
        } elseif ($negativeScore > $positiveScore) {
            return 'negative';
        }

        return 'neutral';
    }
}
