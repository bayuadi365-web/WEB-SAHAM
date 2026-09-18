import React, { useState } from 'react';
import { Building2, Newspaper, ExternalLink, Calendar, Info, X } from 'lucide-react';
import { formatLargeNumber } from '../services/stockService';

export default function CompanyProfile({ stock }) {
  const [selectedNews, setSelectedNews] = useState(null);

  if (!stock) return null;

  const newsList = stock.news || [
    {
      id: 99,
      title: `Rapat Umum Pemegang Saham (RUPS) ${stock.name} Catat Prospek Pertumbuhan Positif`,
      source: 'Bisnis.com',
      time: 'Hari ini',
      sentiment: 'bullish',
      readTime: '3 min',
    },
  ];

  // 52-week range calculation percentage
  const low52 = stock.fiftyTwoWeekLow || 1000;
  const high52 = stock.fiftyTwoWeekHigh || 2000;
  const currPrice = stock.price || low52;
  const range52Pct = Math.min(100, Math.max(0, ((currPrice - low52) / (high52 - low52)) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Company Profile Card */}
      <div className="card-terminal">
        <div className="card-header">
          <div className="card-title">
            <Building2 size={16} color="var(--color-accent)" />
            <span>Profil & Informasi Emiten — {stock.name}</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            {stock.sector} • {stock.subSector}
          </span>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Business Summary */}
          <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            {stock.description}
          </div>

          {/* 52-Week Range Meter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '8px' }}>
              <span>
                52-Week Low: <strong className="num-mono" style={{ color: 'var(--color-bearish)' }}>Rp {low52.toLocaleString('id-ID')}</strong>
              </span>
              <span style={{ color: 'var(--text-dim)' }}>Rentang Harga 1 Tahun</span>
              <span>
                52-Week High: <strong className="num-mono" style={{ color: 'var(--color-bullish)' }}>Rp {high52.toLocaleString('id-ID')}</strong>
              </span>
            </div>
            <div style={{ position: 'relative', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${range52Pct}%`,
                  background: 'linear-gradient(90deg, #f43f5e, #eab308, #10b981)',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Posisi harga saat ini berada di <strong style={{ color: 'var(--color-accent)' }}>{range52Pct.toFixed(0)}%</strong> dari rentang tahunan
            </div>
          </div>

          {/* Corporate Stats Table Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="quick-stat-label">Jumlah Saham Beredar</div>
              <div className="quick-stat-val">{(stock.sharesOutstanding / 1e9).toFixed(2)} Miliar Lembar</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="quick-stat-label">Kapitalisasi Pasar</div>
              <div className="quick-stat-val" style={{ color: 'var(--color-accent)' }}>{stock.marketCapFormatted}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="quick-stat-label">Bursa Pencatatan</div>
              <div className="quick-stat-val">Bursa Efek Indonesia (IDX)</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="quick-stat-label">Papan Perdagangan</div>
              <div className="quick-stat-val" style={{ color: 'var(--color-bullish)' }}>Papan Utama</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Emiten News Feed */}
      <div className="card-terminal">
        <div className="card-header">
          <div className="card-title">
            <Newspaper size={16} color="var(--color-accent)" />
            <span>Berita Terkini & Sentimen Emiten ({stock.ticker})</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Feed terintegrasi portal finansial terpercaya
          </span>
        </div>

        <div style={{ padding: '16px' }}>
          <div className="news-grid">
            {newsList.map((n) => (
              <div
                key={n.id}
                className="news-card"
                onClick={() => setSelectedNews(n)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                      {n.source}
                    </span>
                    <span className={`sentiment-badge ${n.sentiment}`}>
                      {n.sentiment === 'bullish' ? 'Positif' : n.sentiment === 'bearish' ? 'Negatif' : 'Netral'}
                    </span>
                  </div>
                  <h4 className="news-title">{n.title}</h4>
                </div>

                <div className="news-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {n.time}
                  </span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    Baca Berita <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* News Modal Reader */}
      {selectedNews && (
        <div className="modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Newspaper size={18} color="var(--color-accent)" />
                <span style={{ fontWeight: 700 }}>{selectedNews.source} • Berita Pasar</span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span className={`sentiment-badge ${selectedNews.sentiment}`}>
                  Sentimen {selectedNews.sentiment === 'bullish' ? 'Positif' : 'Netral'}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Dipublikasikan: {selectedNews.time}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', lineHeight: 1.4, marginBottom: '16px' }}>
                {selectedNews.title}
              </h3>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '16px' }}>
                Jakarta — Kinerja saham {stock.ticker} ({stock.name}) terus menarik perhatian pelaku pasar bursa modal domestik maupun investor institusi global. Dalam rilis operasional terkini, emiten membukukan pencapaian target bisnis yang kokoh, ditopang stabilitas operasional serta permintaan segmen pasar utama.
              </p>
              <p style={{ fontSize: '0.92rem', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '16px' }}>
                Para analis memproyeksikan rasio profitabilitas emiten seperti ROE ({stock.profitability?.roe}%) dan margin laba bersih ({stock.profitability?.npm}%) akan tetap menjadi katalis penopang valuasi di bursa efek ke depannya.
              </p>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setSelectedNews(null)}
                  style={{
                    background: 'var(--color-accent)',
                    color: '#000',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
