import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart2,
  FileText,
  Bookmark,
  Building2,
  Search,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Layers,
  Shield,
} from 'lucide-react';
import { IDX_STOCKS, IHSG_DATA } from './data/idxStocks';
import {
  fetchStockHistory,
  fetchIHSGSummary,
  getStoredWatchlist,
  saveWatchlist,
  formatIDR,
  formatLargeNumber,
} from './services/stockService';
import Navbar from './components/Navbar';
import StockChart from './components/StockChart';
import IndicatorControls from './components/IndicatorControls';
import FundamentalPanel from './components/FundamentalPanel';
import MarketDashboard from './components/MarketDashboard';
import CompanyProfile from './components/CompanyProfile';
import SearchWatchlistModal from './components/SearchWatchlistModal';

export default function App() {
  // State: Emiten Aktif
  const [activeTicker, setActiveTicker] = useState('BBCA');
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'fundamental' | 'market' | 'watchlist' | 'profile'
  const [timeframe, setTimeframe] = useState('6M');
  const [chartData, setChartData] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [ihsgData, setIhsgData] = useState(IHSG_DATA);

  // State: Watchlist Pribadi
  const [watchlist, setWatchlist] = useState(getStoredWatchlist);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // State: Indikator Teknikal Aktif
  const [indicators, setIndicators] = useState({
    sma20: true,
    sma50: true,
    sma200: false,
    ema9: false,
    vwap: false,
    bollingerBands: false,
    volume: true,
    rsi: true,
    macd: false,
    fibonacci: false,
    pivotPoints: false,
    autoSignals: true,
  });

  // Cari objek emiten aktif
  const currentStock =
    IDX_STOCKS.find((s) => s.ticker.toUpperCase() === activeTicker.toUpperCase()) || IDX_STOCKS[0];

  // Fetch IHSG Summary secara berkala
  useEffect(() => {
    fetchIHSGSummary().then((data) => {
      if (data) setIhsgData(data);
    });
  }, []);

  // Fetch Data Candlestick saat ticker atau timeframe berganti
  useEffect(() => {
    let isMounted = true;
    setLoadingChart(true);

    fetchStockHistory(activeTicker, timeframe)
      .then((data) => {
        if (isMounted && data) {
          setChartData(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching stock data:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingChart(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTicker, timeframe]);

  // Handler Watchlist
  const handleToggleWatchlist = (ticker) => {
    let nextWatchlist;
    if (watchlist.includes(ticker)) {
      nextWatchlist = watchlist.filter((t) => t !== ticker);
    } else {
      nextWatchlist = [...watchlist, ticker];
    }
    setWatchlist(nextWatchlist);
    saveWatchlist(nextWatchlist);
  };

  // Handler Indikator
  const handleToggleIndicator = (key) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetIndicators = () => {
    setIndicators({
      sma20: true,
      sma50: true,
      sma200: false,
      ema9: false,
      vwap: false,
      bollingerBands: false,
      volume: true,
      rsi: true,
      macd: false,
      fibonacci: false,
      pivotPoints: false,
      autoSignals: true,
    });
  };

  const handleApplyPreset = (preset) => {
    if (preset === 'swing') {
      setIndicators({
        sma20: true,
        sma50: true,
        sma200: true,
        ema9: false,
        vwap: false,
        bollingerBands: false,
        volume: true,
        rsi: true,
        macd: true,
        fibonacci: true,
        pivotPoints: false,
        autoSignals: true,
      });
    } else if (preset === 'breakout') {
      setIndicators({
        sma20: false,
        sma50: false,
        sma200: false,
        ema9: true,
        vwap: true,
        bollingerBands: true,
        volume: true,
        rsi: true,
        macd: false,
        fibonacci: false,
        pivotPoints: true,
        autoSignals: true,
      });
    } else if (preset === 'clean') {
      setIndicators({
        sma20: false,
        sma50: false,
        sma200: false,
        ema9: false,
        vwap: false,
        bollingerBands: false,
        volume: false,
        rsi: false,
        macd: false,
        fibonacci: false,
        pivotPoints: false,
        autoSignals: false,
      });
    }
  };

  const isCurrentWatched = watchlist.includes(currentStock.ticker);
  const isUp = currentStock.change >= 0;

  // Daftar saham di Watchlist
  const watchedStockObjects = IDX_STOCKS.filter((s) => watchlist.includes(s.ticker));

  return (
    <div className="app-container">
      {/* 1. Navbar Terminal */}
      <Navbar
        ihsgData={ihsgData}
        onOpenSearch={() => setIsSearchOpen(true)}
        watchlistCount={watchlist.length}
        onSelectStock={(ticker) => {
          setActiveTicker(ticker);
          setActiveTab('chart');
        }}
        onOpenWatchlistTab={() => setActiveTab('watchlist')}
      />

      {/* 2. Top Tabs Navigation */}
      <nav className="app-tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => setActiveTab('chart')}
        >
          <BarChart2 size={16} />
          <span>Chart & Analisis Teknikal</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'fundamental' ? 'active' : ''}`}
          onClick={() => setActiveTab('fundamental')}
        >
          <FileText size={16} />
          <span>Analisis Fundamental</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          <TrendingUp size={16} />
          <span>Ringkasan Pasar (IHSG)</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          <Bookmark size={16} />
          <span>Watchlist Saya ({watchlist.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <Building2 size={16} />
          <span>Profil Emiten & Berita</span>
        </button>
      </nav>

      {/* 3. Main Body */}
      <main className="main-layout">
        {/* Active Stock Hero Bar (Tampil di tab chart, fundamental, dan profile) */}
        {activeTab !== 'market' && activeTab !== 'watchlist' && (
          <div className="stock-hero-bar">
            {/* Emiten Info */}
            <div className="stock-hero-info">
              <div className="stock-hero-badge">
                <span>{currentStock.ticker}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                  {currentStock.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="stock-hero-sector-tag">{currentStock.sector}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {currentStock.subSector}
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Change */}
            <div className="stock-hero-price-section">
              <span className="stock-hero-price">
                Rp {currentStock.price.toLocaleString('id-ID')}
              </span>
              <span className={`stock-hero-change-badge ${isUp ? 'bullish' : 'bearish'}`}>
                {isUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                {isUp ? '+' : ''}{currentStock.change} ({isUp ? '+' : ''}{currentStock.changePercent}%)
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="stock-hero-quick-stats">
              <div className="quick-stat-item">
                <span className="quick-stat-label">Tertinggi Hari Ini</span>
                <span className="quick-stat-val" style={{ color: 'var(--color-bullish)' }}>
                  Rp {currentStock.dayHigh.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">Terendah Hari Ini</span>
                <span className="quick-stat-val" style={{ color: 'var(--color-bearish)' }}>
                  Rp {currentStock.dayLow.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">PER (TTM)</span>
                <span className="quick-stat-val">
                  {currentStock.valuation?.peRatio ? `${currentStock.valuation.peRatio}x` : '-'}
                </span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">PBV</span>
                <span className="quick-stat-val">
                  {currentStock.valuation?.pbvRatio ? `${currentStock.valuation.pbvRatio}x` : '-'}
                </span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">Dividend Yield</span>
                <span className="quick-stat-val" style={{ color: 'var(--color-bullish)' }}>
                  {currentStock.dividend?.dividendYield}%
                </span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-label">Kapitalisasi Pasar</span>
                <span className="quick-stat-val" style={{ color: 'var(--color-accent)' }}>
                  {currentStock.marketCapFormatted}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="stock-hero-actions">
              <button
                className={`btn-watchlist-toggle ${isCurrentWatched ? 'active' : ''}`}
                onClick={() => handleToggleWatchlist(currentStock.ticker)}
              >
                <Star size={16} fill={isCurrentWatched ? 'var(--color-amber)' : 'none'} />
                <span>{isCurrentWatched ? 'Tersimpan di Watchlist' : 'Tambah ke Watchlist'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Chart & Technical */}
        {activeTab === 'chart' && (
          <div className="trading-workspace-grid">
            <StockChart
              stock={currentStock}
              chartData={chartData}
              loading={loadingChart}
              timeframe={timeframe}
              onChangeTimeframe={setTimeframe}
              indicators={indicators}
            />

            <IndicatorControls
              indicators={indicators}
              onToggleIndicator={handleToggleIndicator}
              onResetIndicators={handleResetIndicators}
              onApplyPreset={handleApplyPreset}
            />
          </div>
        )}

        {/* Tab 2: Fundamental Panel */}
        {activeTab === 'fundamental' && (
          <FundamentalPanel
            stock={currentStock}
            onSelectStock={(ticker) => {
              setActiveTicker(ticker);
            }}
          />
        )}

        {/* Tab 3: Market Dashboard (IHSG & IDX) */}
        {activeTab === 'market' && (
          <MarketDashboard
            ihsgData={ihsgData}
            onSelectStock={(ticker) => {
              setActiveTicker(ticker);
              setActiveTab('chart');
            }}
          />
        )}

        {/* Tab 4: Watchlist Saya */}
        {activeTab === 'watchlist' && (
          <div className="card-terminal">
            <div className="card-header">
              <div className="card-title">
                <Bookmark size={16} color="var(--color-accent)" />
                <span>Daftar Pantau Saham Pribadi ({watchedStockObjects.length} Saham Tersimpan)</span>
              </div>
              <button
                className="btn-watchlist-toggle"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={14} />
                <span>Tambah Saham Baru</span>
              </button>
            </div>

            {watchedStockObjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
                <Bookmark size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <h3>Belum ada saham di Watchlist</h3>
                <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                  Gunakan tombol pencarian (Ctrl+K) atau klik bintang di emiten untuk menambahkannya ke sini.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="terminal-table">
                  <thead>
                    <tr>
                      <th>Aksi</th>
                      <th>Ticker</th>
                      <th>Nama Perusahaan</th>
                      <th>Sektor</th>
                      <th>Harga Terakhir</th>
                      <th>Perubahan (%)</th>
                      <th>PER (TTM)</th>
                      <th>PBV</th>
                      <th>ROE</th>
                      <th>Div. Yield</th>
                      <th>Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchedStockObjects.map((stock) => {
                      const isStockUp = stock.change >= 0;
                      return (
                        <tr
                          key={stock.ticker}
                          onClick={() => {
                            setActiveTicker(stock.ticker);
                            setActiveTab('chart');
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleToggleWatchlist(stock.ticker)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-amber)',
                                padding: '4px',
                              }}
                              title="Hapus dari watchlist"
                            >
                              <Star size={16} fill="var(--color-amber)" />
                            </button>
                          </td>
                          <td>
                            <strong style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>
                              {stock.ticker}
                            </strong>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{stock.name}</td>
                          <td>
                            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                              {stock.sector}
                            </span>
                          </td>
                          <td className="num-mono" style={{ fontWeight: 700 }}>
                            Rp {stock.price.toLocaleString('id-ID')}
                          </td>
                          <td>
                            <span
                              className={`num-mono ${isStockUp ? 'bullish-text' : 'bearish-text'}`}
                              style={{ fontWeight: 700 }}
                            >
                              {isStockUp ? '+' : ''}{stock.changePercent}%
                            </span>
                          </td>
                          <td className="num-mono">{stock.valuation?.peRatio ? `${stock.valuation.peRatio}x` : '-'}</td>
                          <td className="num-mono">{stock.valuation?.pbvRatio ? `${stock.valuation.pbvRatio}x` : '-'}</td>
                          <td className="num-mono">{stock.profitability?.roe ? `${stock.profitability.roe}%` : '-'}</td>
                          <td className="num-mono" style={{ color: stock.dividend?.dividendYield > 5 ? 'var(--color-bullish)' : undefined }}>
                            {stock.dividend?.dividendYield}%
                          </td>
                          <td className="num-mono" style={{ color: 'var(--color-accent)' }}>
                            {stock.marketCapFormatted}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Profile & News */}
        {activeTab === 'profile' && <CompanyProfile stock={currentStock} />}
      </main>

      {/* 4. Global Search Modal */}
      <SearchWatchlistModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
        onSelectStock={(ticker) => {
          setActiveTicker(ticker);
          setActiveTab('chart');
        }}
        activeStockTicker={activeTicker}
      />

      {/* 5. Legal Disclaimer Footer */}
      <footer className="app-footer">
        <div className="disclaimer-badge">
          <AlertTriangle size={14} />
          <span>DISCLAIMER HUKUM & PASAR FINANSIAL</span>
        </div>
        <p style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.6' }}>
          Platform ini dirancang semata-mata sebagai alat bantu riset, pemantauan statistik, dan edukasi analisis saham di Bursa Efek Indonesia (IDX/BEI).
          Segala kalkulasi teknikal, rasio fundamental, maupun sinyal indikator otomatis bukan merupakan rekomendasi, ajakan, atau nasihat investasi untuk membeli atau menjual efek tertentu.
          Investasi di pasar modal mengandung risiko fluktuasi modal. Pengambilan keputusan investasi sepenuhnya berada pada tanggung jawab individu masing-masing investor.
        </p>
        <div style={{ marginTop: '12px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
          IDX ProTrader Terminal © {new Date().getFullYear()} • Data Feed IDX & Yahoo Finance
        </div>
      </footer>
    </div>
  );
}
