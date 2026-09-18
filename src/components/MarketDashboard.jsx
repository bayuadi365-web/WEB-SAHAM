import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Layers,
  BarChart,
  PieChart,
} from 'lucide-react';
import { IDX_SECTORS } from '../data/idxStocks';
import { getTopGainers, getTopLosers, getMostActive, formatLargeNumber } from '../services/stockService';

export default function MarketDashboard({ ihsgData, onSelectStock }) {
  const topGainers = getTopGainers(5);
  const topLosers = getTopLosers(5);
  const mostActive = getMostActive(5);

  const isIHSGUp = (ihsgData?.change || 0) >= 0;
  const totalStocks = (ihsgData?.advancers || 284) + (ihsgData?.decliners || 210) + (ihsgData?.unchanged || 196);
  const advPct = (((ihsgData?.advancers || 284) / totalStocks) * 100).toFixed(1);
  const decPct = (((ihsgData?.decliners || 210) / totalStocks) * 100).toFixed(1);
  const uncPct = (((ihsgData?.unchanged || 196) / totalStocks) * 100).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. IHSG Big Highlight & Market Breadth */}
      <div className="ihsg-highlight-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                background: 'rgba(6, 182, 212, 0.2)',
                color: 'var(--color-accent)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              BEI COMPOSITE INDEX
            </span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
              Ticker: ^JKSE
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Indeks Harga Saham Gabungan (IHSG)
          </h2>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
            <div className="ihsg-val-huge">
              {ihsgData?.price?.toLocaleString('id-ID')}
            </div>
            <div
              className={`num-mono ${isIHSGUp ? 'bullish-text' : 'bearish-text'}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '1.25rem',
                fontWeight: 800,
              }}
            >
              {isIHSGUp ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
              {isIHSGUp ? '+' : ''}{ihsgData?.change} ({isIHSGUp ? '+' : ''}{ihsgData?.changePercent}%)
            </div>
          </div>
        </div>

        {/* IHSG Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px 24px',
            background: 'rgba(10, 14, 23, 0.5)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div className="quick-stat-label">Tertinggi (Day High)</div>
            <div className="quick-stat-val" style={{ color: 'var(--color-bullish)' }}>
              {ihsgData?.dayHigh?.toLocaleString('id-ID')}
            </div>
          </div>
          <div>
            <div className="quick-stat-label">Terendah (Day Low)</div>
            <div className="quick-stat-val" style={{ color: 'var(--color-bearish)' }}>
              {ihsgData?.dayLow?.toLocaleString('id-ID')}
            </div>
          </div>
          <div>
            <div className="quick-stat-label">Nilai Transaksi (Turnover)</div>
            <div className="quick-stat-val" style={{ color: 'var(--color-accent)' }}>
              {formatLargeNumber(ihsgData?.turnover)}
            </div>
          </div>
          <div>
            <div className="quick-stat-label">Volume Pasar</div>
            <div className="quick-stat-val">
              {(ihsgData?.volume / 1e9).toFixed(1)} Miliar Saham
            </div>
          </div>
        </div>

        {/* Market Breadth Bar (Advancers / Decliners) */}
        <div style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--color-bullish)', fontWeight: 700 }}>
              Naik: {ihsgData?.advancers} Saham ({advPct}%)
            </span>
            <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>
              Stagnan: {ihsgData?.unchanged} Saham ({uncPct}%)
            </span>
            <span style={{ color: 'var(--color-bearish)', fontWeight: 700 }}>
              Turun: {ihsgData?.decliners} Saham ({decPct}%)
            </span>
          </div>
          <div className="breadth-bar-wrap">
            <div className="breadth-seg-adv" style={{ width: `${advPct}%` }} title={`Naik: ${advPct}%`} />
            <div className="breadth-seg-unc" style={{ width: `${uncPct}%` }} title={`Stagnan: ${uncPct}%`} />
            <div className="breadth-seg-dec" style={{ width: `${decPct}%` }} title={`Turun: ${decPct}%`} />
          </div>
        </div>
      </div>

      {/* 2. Top Movers Grid: Top Gainers, Top Losers, Most Active */}
      <div className="market-dash-grid">
        {/* Top Gainers */}
        <div className="col-span-4 card-terminal">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={16} color="var(--color-bullish)" />
              <span>Top Gainers Hari Ini</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-bullish)', fontWeight: 700 }}>+GAIN</span>
          </div>
          <div style={{ padding: '8px' }}>
            {topGainers.map((s, idx) => (
              <div
                key={s.ticker}
                className="search-result-item"
                onClick={() => onSelectStock(s.ticker)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', width: '16px', fontWeight: 700 }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{s.ticker}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{s.sector}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="num-mono" style={{ fontWeight: 700 }}>
                    Rp {s.price.toLocaleString('id-ID')}
                  </div>
                  <div className="num-mono bullish-text" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                    +{s.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="col-span-4 card-terminal">
          <div className="card-header">
            <div className="card-title">
              <TrendingDown size={16} color="var(--color-bearish)" />
              <span>Top Losers Hari Ini</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-bearish)', fontWeight: 700 }}>-LOSS</span>
          </div>
          <div style={{ padding: '8px' }}>
            {topLosers.map((s, idx) => (
              <div
                key={s.ticker}
                className="search-result-item"
                onClick={() => onSelectStock(s.ticker)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', width: '16px', fontWeight: 700 }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{s.ticker}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{s.sector}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="num-mono" style={{ fontWeight: 700 }}>
                    Rp {s.price.toLocaleString('id-ID')}
                  </div>
                  <div className="num-mono bearish-text" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                    {s.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active by Value/Turnover */}
        <div className="col-span-4 card-terminal">
          <div className="card-header">
            <div className="card-title">
              <Flame size={16} color="var(--color-amber)" />
              <span>Teraktif (By Turnover)</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-amber)', fontWeight: 700 }}>ACTIVE</span>
          </div>
          <div style={{ padding: '8px' }}>
            {mostActive.map((s, idx) => (
              <div
                key={s.ticker}
                className="search-result-item"
                onClick={() => onSelectStock(s.ticker)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', width: '16px', fontWeight: 700 }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{s.ticker}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Vol: {(s.volume / 1e6).toFixed(1)}Jt
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="num-mono" style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                    {formatLargeNumber(s.turnover)}
                  </div>
                  <div className={`num-mono ${s.change >= 0 ? 'bullish-text' : 'bearish-text'}`} style={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    {s.change >= 0 ? '+' : ''}{s.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Kinerja 11 Sektoral IDX (Sector Performance) */}
      <div className="card-terminal">
        <div className="card-header">
          <div className="card-title">
            <Layers size={16} color="var(--color-accent)" />
            <span>Kinerja 11 Indeks Sektoral Bursa Efek Indonesia</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Pergerakan rata-rata harian sektor
          </span>
        </div>

        <div style={{ padding: '16px' }}>
          <div className="sectors-grid">
            {IDX_SECTORS.map((sec) => {
              const isSecUp = sec.change >= 0;
              return (
                <div key={sec.id} className="sector-card">
                  <div className="sector-card-name">{sec.name}</div>
                  <div
                    className={`sector-card-val ${isSecUp ? 'bullish-text' : 'bearish-text'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {isSecUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    <span>{isSecUp ? '+' : ''}{sec.change}%</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Indeks: {sec.indexValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
