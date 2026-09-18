import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Bookmark, Clock, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { IDX_STOCKS } from '../data/idxStocks';

export default function Navbar({
  ihsgData,
  onOpenSearch,
  watchlistCount,
  onSelectStock,
  onOpenWatchlistTab
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Jakarta',
        }) + ' WIB'
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const isPositiveIHSG = (ihsgData?.change || 0) >= 0;

  return (
    <header className="navbar">
      <div className="navbar-top">
        {/* Brand */}
        <div className="brand-section" onClick={() => onSelectStock('BBCA')}>
          <div className="brand-logo-icon">
            <TrendingUp size={22} color="#ffffff" />
          </div>
          <div>
            <div className="brand-title">IDX ProTrader</div>
            <div className="brand-subtitle">Bursa Efek Indonesia • Market Terminal</div>
          </div>
        </div>

        {/* Market Status & Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="market-status-pill">
            <span className="pulse-dot"></span>
            <span>BEI {ihsgData?.isLive ? 'LIVE' : 'ACTIVE'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Clock size={14} />
            <span className="num-mono">{timeStr}</span>
          </div>
        </div>

        {/* Search Trigger */}
        <button className="search-trigger-btn" onClick={onOpenSearch}>
          <Search size={16} />
          <span>Cari kode saham (misal: BBCA, TLKM)...</span>
          <span className="kbd-shortcut">Ctrl K</span>
        </button>

        {/* Watchlist Quick Button */}
        <button
          className="btn-watchlist-toggle"
          onClick={onOpenWatchlistTab}
          title="Buka Daftar Pantau / Watchlist"
        >
          <Bookmark size={16} />
          <span>Watchlist</span>
          <span
            style={{
              background: 'rgba(6, 182, 212, 0.2)',
              color: 'var(--color-accent)',
              padding: '1px 6px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {watchlistCount}
          </span>
        </button>
      </div>

      {/* Marquee Ticker Tape */}
      <div className="ticker-tape">
        <div className="ticker-track">
          {/* IHSG Ticker */}
          <div className="ticker-item" onClick={() => onSelectStock('BBCA')}>
            <span className="ticker-item-code" style={{ color: 'var(--color-accent)' }}>
              IHSG (COMPOSITE)
            </span>
            <span className="ticker-item-price num-mono">
              {ihsgData?.price?.toLocaleString('id-ID')}
            </span>
            <span
              className={`num-mono ${isPositiveIHSG ? 'bullish-text' : 'bearish-text'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}
            >
              {isPositiveIHSG ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {isPositiveIHSG ? '+' : ''}{ihsgData?.change} ({isPositiveIHSG ? '+' : ''}{ihsgData?.changePercent}%)
            </span>
          </div>

          {/* Emiten Stocks */}
          {IDX_STOCKS.concat(IDX_STOCKS).map((stock, idx) => {
            const isUp = stock.change >= 0;
            return (
              <div
                key={`${stock.ticker}-${idx}`}
                className="ticker-item"
                onClick={() => onSelectStock(stock.ticker)}
              >
                <span className="ticker-item-code">{stock.ticker}</span>
                <span className="ticker-item-price num-mono">
                  {stock.price.toLocaleString('id-ID')}
                </span>
                <span className={`num-mono ${isUp ? 'bullish-text' : 'bearish-text'}`}>
                  {isUp ? '+' : ''}{stock.changePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
