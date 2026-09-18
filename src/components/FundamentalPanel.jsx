import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Percent,
  Award,
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { IDX_STOCKS } from '../data/idxStocks';

export default function FundamentalPanel({ stock, onSelectStock }) {
  if (!stock) return null;

  const {
    valuation = {},
    profitability = {},
    solvency = {},
    growth = {},
    dividend = {},
    financialStatements = [],
    peers = [],
  } = stock;

  // Filter emiten kompetitor dalam sektor yang sama
  const peerStocks = IDX_STOCKS.filter((s) => peers.includes(s.ticker) || s.ticker === stock.ticker);

  // Nilai maksimum untuk skala bar chart pendapatan
  const maxRev = Math.max(...financialStatements.map((f) => f.revenue), 100);

  // Hitung Skor Kesehatan Fundamental (0 - 100)
  let score = 50;
  if (profitability.roe > 15) score += 15;
  if (profitability.npm > 15) score += 10;
  if (solvency.der < 1.0) score += 10;
  if (growth.netIncomeGrowthYoY > 5) score += 10;
  if (dividend.dividendYield > 3) score += 5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner: Health Score & Executive Summary */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(19, 29, 49, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Award size={20} color="var(--color-accent)" />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              Analisis Fundamental Komprehensif — {stock.name} ({stock.ticker})
            </span>
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '800px' }}>
            {stock.description}
          </div>
        </div>

        {/* Health Score Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              SKOR FUNDAMENTAL
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-accent)' }} className="num-mono">
              {score} / 100
            </div>
          </div>
          <div style={{ height: '36px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ fontSize: '0.78rem', color: 'var(--color-bullish)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={16} />
            <span>{score >= 75 ? 'Sangat Solid' : score >= 60 ? 'Sehat & Stabil' : 'Moderat'}</span>
          </div>
        </div>
      </div>

      {/* 5 Kategori Rasio Utama (Valuasi, Profitabilitas, Solvabilitas, Pertumbuhan, Dividen) */}
      <div className="fundamental-grid">
        {/* 1. Valuasi */}
        <div className="metric-category-card">
          <div className="metric-category-header">
            <DollarSign size={18} />
            <span>Valuasi Pasar</span>
          </div>
          <div className="metric-rows-list">
            <div className="metric-row">
              <span className="metric-name">PER (Price to Earnings TTM)</span>
              <span className="metric-value">{valuation.peRatio ? `${valuation.peRatio}x` : '-'}</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">PBV (Price to Book Value)</span>
              <span className="metric-value">{valuation.pbvRatio ? `${valuation.pbvRatio}x` : '-'}</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">EV / EBITDA</span>
              <span className="metric-value">{valuation.evEbitda ? `${valuation.evEbitda}x` : '-'}</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Price to Sales (P/S)</span>
              <span className="metric-value">{valuation.psRatio ? `${valuation.psRatio}x` : '-'}</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Kapitalisasi Pasar (Market Cap)</span>
              <span className="metric-value" style={{ color: 'var(--color-accent)' }}>
                {stock.marketCapFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Profitabilitas */}
        <div className="metric-category-card">
          <div className="metric-category-header">
            <TrendingUp size={18} />
            <span>Profitabilitas</span>
          </div>
          <div className="metric-rows-list">
            <div className="metric-row">
              <span className="metric-name">ROE (Return on Equity)</span>
              <span className="metric-value" style={{ color: 'var(--color-bullish)' }}>
                {profitability.roe ? `${profitability.roe}%` : '-'}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-name">ROA (Return on Assets)</span>
              <span className="metric-value">{profitability.roa ? `${profitability.roa}%` : '-'}</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">NPM (Net Profit Margin)</span>
              <span className="metric-value">{profitability.npm ? `${profitability.npm}%` : '-'}</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">GPM (Gross Profit Margin)</span>
              <span className="metric-value">{profitability.gpm ? `${profitability.gpm}%` : '-'}</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Operating Margin</span>
              <span className="metric-value">{profitability.operatingMargin ? `${profitability.operatingMargin}%` : '-'}</span>
            </div>
          </div>
        </div>

        {/* 3. Solvabilitas & Likuiditas */}
        <div className="metric-category-card">
          <div className="metric-category-header">
            <ShieldCheck size={18} />
            <span>Solvabilitas & Likuiditas</span>
          </div>
          <div className="metric-rows-list">
            <div className="metric-row">
              <span className="metric-name">DER (Debt to Equity Ratio)</span>
              <span className="metric-value" style={{ color: solvency.der < 1.0 ? 'var(--color-bullish)' : 'var(--color-amber)' }}>
                {solvency.der !== null ? `${solvency.der}x` : '-'}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Current Ratio</span>
              <span className="metric-value">{solvency.currentRatio ? `${solvency.currentRatio}x` : '-'}</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Quick Ratio</span>
              <span className="metric-value">{solvency.quickRatio ? `${solvency.quickRatio}x` : '-'}</span>
            </div>
            {solvency.car && (
              <div className="metric-row">
                <span className="metric-name">CAR (Capital Adequacy Ratio)</span>
                <span className="metric-value" style={{ color: 'var(--color-bullish)' }}>{solvency.car}%</span>
              </div>
            )}
            <div className="metric-row">
              <span className="metric-name">Risiko Solvabilitas</span>
              <span className="metric-value" style={{ color: 'var(--color-bullish)' }}>Rendah</span>
            </div>
          </div>
        </div>

        {/* 4. Pertumbuhan */}
        <div className="metric-category-card">
          <div className="metric-category-header">
            <Percent size={18} />
            <span>Pertumbuhan (YoY)</span>
          </div>
          <div className="metric-rows-list">
            <div className="metric-row">
              <span className="metric-name">Pertumbuhan Pendapatan (YoY)</span>
              <span className={`metric-value ${growth.revenueGrowthYoY >= 0 ? 'bullish-text' : 'bearish-text'}`}>
                {growth.revenueGrowthYoY >= 0 ? '+' : ''}{growth.revenueGrowthYoY}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Pertumbuhan Laba Bersih (YoY)</span>
              <span className={`metric-value ${growth.netIncomeGrowthYoY >= 0 ? 'bullish-text' : 'bearish-text'}`}>
                {growth.netIncomeGrowthYoY >= 0 ? '+' : ''}{growth.netIncomeGrowthYoY}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Pertumbuhan EPS (YoY)</span>
              <span className={`metric-value ${growth.epsGrowth >= 0 ? 'bullish-text' : 'bearish-text'}`}>
                {growth.epsGrowth >= 0 ? '+' : ''}{growth.epsGrowth}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Tren 3 Tahun Terakhir</span>
              <span className="metric-value" style={{ color: 'var(--color-accent)' }}>Konsisten Naik</span>
            </div>
          </div>
        </div>

        {/* 5. Dividen */}
        <div className="metric-category-card">
          <div className="metric-category-header">
            <Award size={18} />
            <span>Dividen Pemegang Saham</span>
          </div>
          <div className="metric-rows-list">
            <div className="metric-row">
              <span className="metric-name">Dividend Yield (Tahunan)</span>
              <span className="metric-value" style={{ color: dividend.dividendYield > 5 ? 'var(--color-bullish)' : 'var(--text-main)' }}>
                {dividend.dividendYield}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Dividend Payout Ratio (DPR)</span>
              <span className="metric-value">{dividend.dividendPayoutRatio}%</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Dividen per Saham (DPS) Terakhir</span>
              <span className="metric-value">Rp {dividend.dps} / lbr</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Frekuensi Pembagian</span>
              <span className="metric-value">1 - 2x per tahun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Laporan Keuangan Historis (Bar Comparison: Pendapatan vs Laba Bersih) */}
      <div className="card-terminal">
        <div className="card-header">
          <div className="card-title">
            <BarChart3 size={16} color="var(--color-accent)" />
            <span>Histori Kinerja Finansial Tahunan (Miliar Rupiah)</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '8px', background: '#06b6d4', borderRadius: '2px' }}></span>
              Pendapatan (Revenue)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '8px', background: '#10b981', borderRadius: '2px' }}></span>
              Laba Bersih (Net Profit)
            </span>
          </div>
        </div>

        <div className="fin-bar-container">
          {financialStatements.map((fs) => {
            const revPct = Math.min(100, Math.max(10, (fs.revenue / maxRev) * 100));
            const netPct = Math.min(100, Math.max(5, (Math.abs(fs.netIncome) / maxRev) * 100));
            const isNegativeNet = fs.netIncome < 0;

            return (
              <div key={fs.year} className="fin-year-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="fin-year-label">Tahun {fs.year}</span>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem' }} className="num-mono">
                    <span>Rev: <strong>Rp {fs.revenue.toLocaleString('id-ID')} M</strong></span>
                    <span style={{ color: isNegativeNet ? 'var(--color-bearish)' : 'var(--color-bullish)' }}>
                      Laba: <strong>Rp {fs.netIncome.toLocaleString('id-ID')} M</strong>
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>EPS: Rp {fs.eps}</span>
                  </div>
                </div>

                <div className="fin-bars-group">
                  <div className="fin-bar-item" style={{ width: `${revPct}%` }}>
                    Revenue
                  </div>
                  <div
                    className="fin-bar-item net-income"
                    style={{
                      width: `${netPct}%`,
                      background: isNegativeNet ? 'linear-gradient(90deg, #f43f5e, #e11d48)' : undefined,
                    }}
                  >
                    Net Income
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Peer Comparison Table: Komparasi dalam Sektor yang Sama */}
      <div className="card-terminal">
        <div className="card-header">
          <div className="card-title">
            <Users size={16} color="var(--color-accent)" />
            <span>Perbandingan Emiten Sejenis dalam Sektor {stock.sector}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Klik emiten untuk langsung menganalisis
          </span>
        </div>

        <div className="table-responsive">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Nama Perusahaan</th>
                <th>Harga Terakhir</th>
                <th>PER (TTM)</th>
                <th>PBV</th>
                <th>ROE</th>
                <th>DER</th>
                <th>Dividend Yield</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {peerStocks.map((p) => {
                const isSelected = p.ticker === stock.ticker;
                return (
                  <tr
                    key={p.ticker}
                    className={isSelected ? 'selected-row' : ''}
                    onClick={() => onSelectStock(p.ticker)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          fontFamily: 'var(--font-mono)',
                          color: isSelected ? 'var(--color-accent)' : '#fff',
                        }}
                      >
                        {p.ticker} {isSelected && '★'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.name}</td>
                    <td className="num-mono" style={{ fontWeight: 700 }}>
                      Rp {p.price.toLocaleString('id-ID')}
                    </td>
                    <td className="num-mono">{p.valuation?.peRatio ? `${p.valuation.peRatio}x` : '-'}</td>
                    <td className="num-mono">{p.valuation?.pbvRatio ? `${p.valuation.pbvRatio}x` : '-'}</td>
                    <td className="num-mono" style={{ color: p.profitability?.roe > 15 ? 'var(--color-bullish)' : undefined }}>
                      {p.profitability?.roe ? `${p.profitability.roe}%` : '-'}
                    </td>
                    <td className="num-mono">{p.solvency?.der !== null ? `${p.solvency?.der}x` : '-'}</td>
                    <td className="num-mono" style={{ color: p.dividend?.dividendYield > 5 ? 'var(--color-bullish)' : undefined }}>
                      {p.dividend?.dividendYield}%
                    </td>
                    <td className="num-mono" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                      {p.marketCapFormatted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
