import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowUpRight, ArrowDownRight, Check } from 'lucide-react';
import { IDX_STOCKS } from '../data/idxStocks';

export default function SearchWatchlistModal({
  isOpen,
  onClose,
  watchlist,
  onToggleWatchlist,
  onSelectStock,
  activeStockTicker
}) {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from parent
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStocks = IDX_STOCKS.filter((stock) => {
    const matchesQuery =
      stock.ticker.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase()) ||
      stock.sector.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (selectedFilter === 'watchlist') {
      return watchlist.includes(stock.ticker);
    }
    if (selectedFilter !== 'all') {
      return stock.sectorId === selectedFilter;
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'watchlist', label: `Watchlist (${watchlist.length})` },
    { id: 'financials', label: 'Keuangan' },
    { id: 'energy', label: 'Energi' },
    { id: 'consumer_non_cyclical', label: 'Konsumer' },
    { id: 'technology', label: 'Teknologi' },
    { id: 'infrastructure', label: 'Infrastruktur' },
    { id: 'basic_materials', label: 'Barang Baku' },
    { id: 'healthcare', label: 'Kesehatan' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Header */}
        <div className="search-modal-header">
          <Search size={20} color="var(--color-accent)" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Cari kode saham atau nama emiten (contoh: BBCA, Astra, Adaro)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '10px 16px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              style={{
                background: selectedFilter === cat.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                color: selectedFilter === cat.id ? '#000' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="search-results-list">
          {filteredStocks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--text-dim)' }}>
              Tidak ada saham yang cocok dengan pencarian "{query}"
            </div>
          ) : (
            filteredStocks.map((stock) => {
              const isSelected = stock.ticker === activeStockTicker;
              const isWatched = watchlist.includes(stock.ticker);
              const isUp = stock.change >= 0;

              return (
                <div
                  key={stock.ticker}
                  className="search-result-item"
                  style={{
                    background: isSelected ? 'rgba(6, 182, 212, 0.08)' : undefined,
                  }}
                  onClick={() => {
                    onSelectStock(stock.ticker);
                    onClose();
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(stock.ticker);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: isWatched ? 'var(--color-amber)' : 'var(--text-dim)',
                        transition: 'transform 0.15s ease',
                      }}
                      title={isWatched ? 'Hapus dari Watchlist' : 'Tambah ke Watchlist'}
                    >
                      <Star size={18} fill={isWatched ? 'var(--color-amber)' : 'none'} />
                    </button>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-main)',
                            fontSize: '0.95rem',
                          }}
                        >
                          {stock.ticker}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.06)',
                            color: 'var(--text-dim)',
                          }}
                        >
                          {stock.sector}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {stock.name}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      className="num-mono"
                      style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}
                    >
                      Rp {stock.price.toLocaleString('id-ID')}
                    </div>
                    <div
                      className={`num-mono ${isUp ? 'bullish-text' : 'bearish-text'}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '2px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {isUp ? '+' : ''}{stock.changePercent}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
