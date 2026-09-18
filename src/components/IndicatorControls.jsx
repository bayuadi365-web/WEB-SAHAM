import React from 'react';
import { Sliders, RotateCcw, Zap, TrendingUp, BarChart2, Activity } from 'lucide-react';

export default function IndicatorControls({
  indicators,
  onToggleIndicator,
  onResetIndicators,
  onApplyPreset
}) {
  return (
    <div className="card-terminal" style={{ height: 'fit-content' }}>
      <div className="card-header">
        <div className="card-title">
          <Sliders size={16} color="var(--color-accent)" />
          <span>Indikator Teknikal</span>
        </div>
        <button
          onClick={onResetIndicators}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.72rem',
          }}
          title="Reset ke pengaturan awal"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Quick Presets */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 600 }}>
            STRATEGI CEPAT (PRESET):
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onApplyPreset('swing')}
              style={{
                background: 'rgba(6, 182, 212, 0.12)',
                color: 'var(--color-accent)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Swing Trader
            </button>
            <button
              onClick={() => onApplyPreset('breakout')}
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--color-bullish)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Breakout & Volatilitas
            </button>
            <button
              onClick={() => onApplyPreset('clean')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clean Price Action
            </button>
          </div>
        </div>

        {/* 1. Trend Indicators */}
        <div className="indicator-section-title">Indikator Trend (Overlay)</div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <span className="color-bullet" style={{ background: '#06b6d4' }}></span>
            <span>SMA 20 (Garis Cepat)</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.sma20}
              onChange={() => onToggleIndicator('sma20')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <span className="color-bullet" style={{ background: '#eab308' }}></span>
            <span>SMA 50 (Garis Menengah)</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.sma50}
              onChange={() => onToggleIndicator('sma50')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <span className="color-bullet" style={{ background: '#a855f7' }}></span>
            <span>SMA 200 (Tren Utama)</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.sma200}
              onChange={() => onToggleIndicator('sma200')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <span className="color-bullet" style={{ background: '#3b82f6' }}></span>
            <span>EMA 9 (Momentum)</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.ema9}
              onChange={() => onToggleIndicator('ema9')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <span className="color-bullet" style={{ background: '#ec4899' }}></span>
            <span>VWAP (Volume Weighted Avg)</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.vwap}
              onChange={() => onToggleIndicator('vwap')}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* 2. Volatility */}
        <div className="indicator-section-title">Volatilitas (Bands)</div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <span className="color-bullet" style={{ background: '#38bdf8' }}></span>
            <span>Bollinger Bands (20, 2)</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.bollingerBands}
              onChange={() => onToggleIndicator('bollingerBands')}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* 3. Momentum & Sub-Panes */}
        <div className="indicator-section-title">Momentum (Sub-Panel)</div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <Activity size={14} color="#8b5cf6" />
            <span>RSI (14) Relative Strength</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.rsi}
              onChange={() => onToggleIndicator('rsi')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <BarChart2 size={14} color="#10b981" />
            <span>MACD (12, 26, 9)</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.macd}
              onChange={() => onToggleIndicator('macd')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <TrendingUp size={14} color="#06b6d4" />
            <span>Volume Histogram</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.volume}
              onChange={() => onToggleIndicator('volume')}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* 4. Support, Resistance & Sinyal */}
        <div className="indicator-section-title">Support, Resistance & Tools</div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <span>Auto Fibonacci Retracement</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.fibonacci}
              onChange={() => onToggleIndicator('fibonacci')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label">
            <span>Pivot Points (Klasik)</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.pivotPoints}
              onChange={() => onToggleIndicator('pivotPoints')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="indicator-toggle-row">
          <div className="indicator-toggle-label" style={{ color: 'var(--color-amber)' }}>
            <Zap size={14} />
            <span>Deteksi Sinyal Otomatis</span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={indicators.autoSignals}
              onChange={() => onToggleIndicator('autoSignals')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
