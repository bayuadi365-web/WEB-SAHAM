// Layanan Data Saham IDX (Live Yahoo Finance + Intelligent Offline Fallback)
import { IDX_STOCKS, IHSG_DATA, generateCandlestickHistory } from '../data/idxStocks';

const MEMORY_CACHE = new Map();
const WATCHLIST_STORAGE_KEY = 'idx_protrader_watchlist';
const DEFAULT_WATCHLIST = ['BBCA', 'BBRI', 'TLKM', 'ASII', 'GOTO'];

/**
 * Mendapatkan daftar kode watchlist dari LocalStorage
 */
export function getStoredWatchlist() {
  try {
    const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Gagal membaca watchlist dari localStorage:', err);
  }
  return DEFAULT_WATCHLIST;
}

/**
 * Menyimpan watchlist ke LocalStorage
 */
export function saveWatchlist(list) {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Gagal menyimpan watchlist ke localStorage:', err);
  }
}

/**
 * Format angka ke Rupiah ringkas atau mata uang IDR
 */
export function formatIDR(value) {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format angka besar (Triliun / Miliar)
 */
export function formatLargeNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '-';
  if (value >= 1e12) {
    return `Rp ${(value / 1e12).toFixed(2)} T`;
  }
  if (value >= 1e9) {
    return `Rp ${(value / 1e9).toFixed(2)} M`;
  }
  if (value >= 1e6) {
    return `Rp ${(value / 1e6).toFixed(2)} Jt`;
  }
  return value.toLocaleString('id-ID');
}

/**
 * Mapping timeframe ke parameter Yahoo Finance (range & interval) dan hari fallback
 */
function mapTimeframeToParams(timeframe) {
  switch (timeframe) {
    case '1D':
      return { range: '1d', interval: '5m', days: 2 };
    case '1W':
      return { range: '5d', interval: '15m', days: 7 };
    case '1M':
      return { range: '1mo', interval: '1d', days: 30 };
    case '3M':
      return { range: '3mo', interval: '1d', days: 90 };
    case '6M':
      return { range: '6mo', interval: '1d', days: 180 };
    case '1Y':
      return { range: '1y', interval: '1d', days: 365 };
    case '5Y':
      return { range: '5y', interval: '1wk', days: 1825 };
    default:
      return { range: '6mo', interval: '1d', days: 180 };
  }
}

/**
 * Fetch data candlestick & meta harga dari Yahoo Finance via proxy dengan fallback
 */
export async function fetchStockHistory(ticker, timeframe = '6M') {
  const cacheKey = `${ticker}_${timeframe}`;
  if (MEMORY_CACHE.has(cacheKey)) {
    const cached = MEMORY_CACHE.get(cacheKey);
    // Cache valid selama 30 detik
    if (Date.now() - cached.timestamp < 30000) {
      return cached.data;
    }
  }

  const emiten = IDX_STOCKS.find(s => s.ticker.toUpperCase() === ticker.toUpperCase()) || {
    ticker: ticker.toUpperCase(),
    symbol: `${ticker.toUpperCase()}.JK`,
    name: `PT ${ticker.toUpperCase()} Tbk`,
    price: 3000,
    change: 0,
    changePercent: 0,
  };

  const { range, interval, days } = mapTimeframeToParams(timeframe);
  const symbol = ticker === '^JKSE' || ticker === 'COMPOSITE' ? '^JKSE' : `${ticker.toUpperCase()}.JK`;

  try {
    const response = await fetch(`/api/yahoo/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from Yahoo Finance`);
    }

    const json = await response.json();
    const result = json?.chart?.result?.[0];

    if (!result || !result.timestamp || !result.indicators?.quote?.[0]) {
      throw new Error('Format data Yahoo Finance tidak lengkap');
    }

    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];
    const opens = quote.open || [];
    const highs = quote.high || [];
    const lows = quote.low || [];
    const closes = quote.close || [];
    const volumes = quote.volume || [];

    const candles = [];
    for (let i = 0; i < timestamps.length; i++) {
      const o = opens[i];
      const h = highs[i];
      const l = lows[i];
      const c = closes[i];
      const v = volumes[i] || 0;

      // Filter data null / NaN
      if (o === null || h === null || l === null || c === null || isNaN(c)) {
        continue;
      }

      const d = new Date(timestamps[i] * 1000);
      let timeStr;
      if (timeframe === '1D' || timeframe === '1W') {
        // Untuk intraday gunakan epoch timestamp (detik) sesuai standar lightweight-charts
        timeStr = timestamps[i];
      } else {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        timeStr = `${yyyy}-${mm}-${dd}`;
      }

      candles.push({
        time: timeStr,
        open: Math.round(o),
        high: Math.round(h),
        low: Math.round(l),
        close: Math.round(c),
        volume: Math.round(v),
      });
    }

    if (candles.length > 0) {
      const meta = result.meta || {};
      const payload = {
        candles,
        isLive: true,
        meta: {
          currentPrice: meta.regularMarketPrice || candles[candles.length - 1].close,
          previousClose: meta.chartPreviousClose || candles[candles.length - 1].open,
          dayHigh: meta.regularMarketDayHigh || candles[candles.length - 1].high,
          dayLow: meta.regularMarketDayLow || candles[candles.length - 1].low,
          fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || emiten.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: meta.fiftyTwoWeekLow || emiten.fiftyTwoWeekLow,
          volume: meta.regularMarketVolume || candles[candles.length - 1].volume,
        }
      };

      MEMORY_CACHE.set(cacheKey, { timestamp: Date.now(), data: payload });
      return payload;
    }
  } catch (error) {
    console.info(`Menggunakan dataset simulasi offline untuk ${ticker} (${error.message})`);
  }

  // Fallback ke generator data lokal
  const fallbackCandles = generateCandlestickHistory(emiten.price, days);
  const payload = {
    candles: fallbackCandles,
    isLive: false,
    meta: {
      currentPrice: emiten.price,
      previousClose: emiten.previousClose,
      dayHigh: emiten.dayHigh,
      dayLow: emiten.dayLow,
      fiftyTwoWeekHigh: emiten.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: emiten.fiftyTwoWeekLow,
      volume: emiten.volume,
    }
  };

  MEMORY_CACHE.set(cacheKey, { timestamp: Date.now(), data: payload });
  return payload;
}

/**
 * Mengambil ringkasan data IHSG
 */
export async function fetchIHSGSummary() {
  try {
    const res = await fetch(`/api/yahoo/v8/finance/chart/^JKSE?interval=1d&range=5d`);
    if (res.ok) {
      const json = await res.json();
      const meta = json?.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice) {
        const price = meta.regularMarketPrice;
        const prev = meta.chartPreviousClose || price;
        const change = price - prev;
        const changePercent = (change / prev) * 100;
        return {
          ...IHSG_DATA,
          price: +price.toFixed(2),
          change: +change.toFixed(2),
          changePercent: +changePercent.toFixed(2),
          dayHigh: meta.regularMarketDayHigh || price,
          dayLow: meta.regularMarketDayLow || price,
          isLive: true,
        };
      }
    }
  } catch {
    // Ignore and fallback
  }
  return { ...IHSG_DATA, isLive: false };
}

/**
 * Filter dan sortir saham
 */
export function getTopGainers(limit = 5) {
  return [...IDX_STOCKS].sort((a, b) => b.changePercent - a.changePercent).slice(0, limit);
}

export function getTopLosers(limit = 5) {
  return [...IDX_STOCKS].sort((a, b) => a.changePercent - b.changePercent).slice(0, limit);
}

export function getMostActive(limit = 5) {
  return [...IDX_STOCKS].sort((a, b) => b.turnover - a.turnover).slice(0, limit);
}
