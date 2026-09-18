import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
} from 'lightweight-charts';
import {
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateRSI,
  calculateMACD,
  calculateVWAP,
  calculateFibonacciRetracement,
  calculatePivotPoints,
  detectTechnicalSignals,
} from '../utils/technicalIndicators';
import { Zap, AlertCircle, ArrowUpRight, ArrowDownRight, Layers, Compass } from 'lucide-react';

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];

export default function StockChart({
  stock,
  chartData,
  loading,
  timeframe,
  onChangeTimeframe,
  indicators,
}) {
  const chartContainerRef = useRef(null);
  const rsiContainerRef = useRef(null);
  const macdContainerRef = useRef(null);

  const mainChartRef = useRef(null);
  const rsiChartRef = useRef(null);
  const macdChartRef = useRef(null);

  const [hoveredData, setHoveredData] = useState(null);

  const candles = chartData?.candles || [];
  const signals = indicators.autoSignals ? detectTechnicalSignals(candles) : [];
  const fibo = indicators.fibonacci ? calculateFibonacciRetracement(candles) : null;
  const pivot = indicators.pivotPoints && candles.length > 0 ? calculatePivotPoints(candles[candles.length - 1]) : null;

  // Render Main Candlestick Chart
  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

    // Bersihkan chart sebelumnya jika ada
    if (mainChartRef.current) {
      mainChartRef.current.remove();
      mainChartRef.current = null;
    }

    const container = chartContainerRef.current;
    const width = container.clientWidth || 800;
    const height = 480;

    const chart = createChart(container, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: '#080c14' },
        textColor: '#94a3b8',
        fontFamily: "'JetBrains Mono', 'Inter', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: 'rgba(6, 182, 212, 0.5)',
          width: 1,
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: 'rgba(6, 182, 212, 0.5)',
          width: 1,
          style: LineStyle.Dashed,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        scaleMargins: {
          top: 0.1,
          bottom: indicators.volume ? 0.22 : 0.1,
        },
      },
    });

    mainChartRef.current = chart;

    // 1. Candlestick Series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#f43f5e',
      borderUpColor: '#10b981',
      borderDownColor: '#f43f5e',
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
    });

    // Format candle data (pastikan ascending)
    const sortedCandles = [...candles].sort((a, b) => (a.time > b.time ? 1 : -1));
    candleSeries.setData(sortedCandles);

    // 2. Volume Histogram Overlay
    if (indicators.volume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume_scale',
      });

      chart.priceScale('volume_scale').applyOptions({
        scaleMargins: {
          top: 0.78,
          bottom: 0,
        },
      });

      const volumeData = sortedCandles.map((c) => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
      }));

      volumeSeries.setData(volumeData);
    }

    // 3. Technical Indicator Overlays
    // SMA 20
    if (indicators.sma20) {
      const sma20 = calculateSMA(sortedCandles, 20).filter((d) => !isNaN(d.value));
      if (sma20.length > 0) {
        const line = chart.addSeries(LineSeries, {
          color: '#06b6d4',
          lineWidth: 2,
          title: 'SMA 20',
        });
        line.setData(sma20);
      }
    }

    // SMA 50
    if (indicators.sma50) {
      const sma50 = calculateSMA(sortedCandles, 50).filter((d) => !isNaN(d.value));
      if (sma50.length > 0) {
        const line = chart.addSeries(LineSeries, {
          color: '#eab308',
          lineWidth: 2,
          title: 'SMA 50',
        });
        line.setData(sma50);
      }
    }

    // SMA 200
    if (indicators.sma200) {
      const sma200 = calculateSMA(sortedCandles, 200).filter((d) => !isNaN(d.value));
      if (sma200.length > 0) {
        const line = chart.addSeries(LineSeries, {
          color: '#a855f7',
          lineWidth: 2,
          title: 'SMA 200',
        });
        line.setData(sma200);
      }
    }

    // EMA 9
    if (indicators.ema9) {
      const ema9 = calculateEMA(sortedCandles, 9).filter((d) => !isNaN(d.value));
      if (ema9.length > 0) {
        const line = chart.addSeries(LineSeries, {
          color: '#3b82f6',
          lineWidth: 1,
          title: 'EMA 9',
        });
        line.setData(ema9);
      }
    }

    // VWAP
    if (indicators.vwap) {
      const vwap = calculateVWAP(sortedCandles).filter((d) => !isNaN(d.value));
      if (vwap.length > 0) {
        const line = chart.addSeries(LineSeries, {
          color: '#ec4899',
          lineWidth: 2,
          title: 'VWAP',
        });
        line.setData(vwap);
      }
    }

    // Bollinger Bands
    if (indicators.bollingerBands) {
      const bb = calculateBollingerBands(sortedCandles, 20, 2);
      const upperData = bb.upper.filter((d) => !isNaN(d.value));
      const middleData = bb.middle.filter((d) => !isNaN(d.value));
      const lowerData = bb.lower.filter((d) => !isNaN(d.value));

      if (upperData.length > 0) {
        const uLine = chart.addSeries(LineSeries, {
          color: 'rgba(56, 189, 248, 0.8)',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          title: 'BB Upper',
        });
        uLine.setData(upperData);

        const mLine = chart.addSeries(LineSeries, {
          color: 'rgba(56, 189, 248, 0.5)',
          lineWidth: 1,
          title: 'BB Mid',
        });
        mLine.setData(middleData);

        const lLine = chart.addSeries(LineSeries, {
          color: 'rgba(56, 189, 248, 0.8)',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          title: 'BB Lower',
        });
        lLine.setData(lowerData);
      }
    }

    // Subscribe crosshair move for tooltip values
    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > width ||
        param.point.y < 0 ||
        param.point.y > height
      ) {
        setHoveredData(null);
      } else {
        const priceData = param.seriesData.get(candleSeries);
        if (priceData) {
          setHoveredData({
            time: param.time,
            open: priceData.open,
            high: priceData.high,
            low: priceData.low,
            close: priceData.close,
          });
        }
      }
    });

    chart.timeScale().fitContent();

    // Resize observer
    const handleResize = () => {
      if (chartContainerRef.current && mainChartRef.current) {
        mainChartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mainChartRef.current) {
        mainChartRef.current.remove();
        mainChartRef.current = null;
      }
    };
  }, [candles, indicators, timeframe]);

  // Sub-pane: RSI
  useEffect(() => {
    if (!indicators.rsi || !rsiContainerRef.current || candles.length === 0) return;

    if (rsiChartRef.current) {
      rsiChartRef.current.remove();
      rsiChartRef.current = null;
    }

    const container = rsiContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth || 800,
      height: 140,
      layout: {
        background: { type: ColorType.Solid, color: '#080c14' },
        textColor: '#94a3b8',
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        visible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
      },
    });

    rsiChartRef.current = chart;

    const rsiLine = chart.addSeries(LineSeries, {
      color: '#8b5cf6',
      lineWidth: 2,
    });

    const rsiData = calculateRSI(candles, 14).filter((d) => !isNaN(d.value));
    rsiLine.setData(rsiData);

    // Overbought (70) and Oversold (30) levels
    if (rsiData.length > 0) {
      const obLine = chart.addSeries(LineSeries, {
        color: 'rgba(244, 63, 94, 0.6)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
      });
      obLine.setData(rsiData.map((d) => ({ time: d.time, value: 70 })));

      const osLine = chart.addSeries(LineSeries, {
        color: 'rgba(16, 185, 129, 0.6)',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
      });
      osLine.setData(rsiData.map((d) => ({ time: d.time, value: 30 })));
    }

    chart.timeScale().fitContent();

    return () => {
      if (rsiChartRef.current) {
        rsiChartRef.current.remove();
        rsiChartRef.current = null;
      }
    };
  }, [candles, indicators.rsi]);

  // Sub-pane: MACD
  useEffect(() => {
    if (!indicators.macd || !macdContainerRef.current || candles.length === 0) return;

    if (macdChartRef.current) {
      macdChartRef.current.remove();
      macdChartRef.current = null;
    }

    const container = macdContainerRef.current;
    const chart = createChart(container, {
      width: container.clientWidth || 800,
      height: 140,
      layout: {
        background: { type: ColorType.Solid, color: '#080c14' },
        textColor: '#94a3b8',
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        visible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
      },
    });

    macdChartRef.current = chart;

    const macdCalc = calculateMACD(candles);
    const validHist = macdCalc.histogram.filter((d) => !isNaN(d.value));
    const validMacd = macdCalc.macdLine.filter((d) => !isNaN(d.value));
    const validSignal = macdCalc.signalLine.filter((d) => !isNaN(d.value));

    const histSeries = chart.addSeries(HistogramSeries, {
      color: '#10b981',
    });
    histSeries.setData(validHist);

    const macdSeries = chart.addSeries(LineSeries, {
      color: '#06b6d4',
      lineWidth: 2,
    });
    macdSeries.setData(validMacd);

    const signalSeries = chart.addSeries(LineSeries, {
      color: '#f59e0b',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
    });
    signalSeries.setData(validSignal);

    chart.timeScale().fitContent();

    return () => {
      if (macdChartRef.current) {
        macdChartRef.current.remove();
        macdChartRef.current = null;
      }
    };
  }, [candles, indicators.macd]);

  const lastCandle = candles[candles.length - 1];
  const displayData = hoveredData || lastCandle;

  return (
    <div className="card-terminal">
      {/* Chart Top Toolbar */}
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div className="card-title">
            <span>Grafik Candlestick {stock?.ticker}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>
              (BEI: {stock?.symbol})
            </span>
          </div>

          {/* OHLC Bar on hover */}
          {displayData && (
            <div
              className="num-mono"
              style={{
                display: 'flex',
                gap: '10px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>O: <strong style={{ color: '#fff' }}>{displayData.open}</strong></span>
              <span>H: <strong style={{ color: 'var(--color-bullish)' }}>{displayData.high}</strong></span>
              <span>L: <strong style={{ color: 'var(--color-bearish)' }}>{displayData.low}</strong></span>
              <span>C: <strong style={{ color: '#fff' }}>{displayData.close}</strong></span>
            </div>
          )}
        </div>

        {/* Timeframe Switcher */}
        <div className="timeframe-bar">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => onChangeTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Signals Banner */}
      {indicators.autoSignals && signals.length > 0 && (
        <div className="signals-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-amber)', fontWeight: 700 }}>
            <Zap size={14} />
            <span>SINYAL TEKNIKAL TERDETEKSI HARI INI:</span>
          </div>
          {signals.map((sig, idx) => (
            <div key={idx} className={`signal-pill ${sig.type}`}>
              {sig.type === 'bullish' ? (
                <ArrowUpRight size={16} color="var(--color-bullish)" />
              ) : (
                <ArrowDownRight size={16} color="var(--color-bearish)" />
              )}
              <div>
                <span className="signal-title">{sig.name}: </span>
                <span style={{ color: 'var(--text-muted)' }}>{sig.message}</span>
              </div>
              <span className={`signal-badge ${sig.type}`}>{sig.level}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Chart Canvas */}
      <div className="chart-viewport" ref={chartContainerRef}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(8, 12, 20, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <div style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Memuat Data Grafik...</div>
          </div>
        )}
      </div>

      {/* RSI Sub-Pane */}
      {indicators.rsi && (
        <div className="chart-sub-pane" ref={rsiContainerRef}>
          <div className="pane-label">
            <span style={{ color: '#8b5cf6' }}>RSI (14)</span>
            <span>Overbought: 70 | Oversold: 30</span>
          </div>
        </div>
      )}

      {/* MACD Sub-Pane */}
      {indicators.macd && (
        <div className="chart-sub-pane" ref={macdContainerRef}>
          <div className="pane-label">
            <span style={{ color: '#06b6d4' }}>MACD (12, 26)</span>
            <span style={{ color: '#f59e0b' }}>Signal (9)</span>
            <span>Histogram</span>
          </div>
        </div>
      )}

      {/* Fibonacci & Pivot Point Cards (jika diaktifkan) */}
      {(fibo || pivot) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: fibo && pivot ? '1fr 1fr' : '1fr',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(10, 14, 23, 0.9)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {/* Fibonacci Levels Box */}
          {fibo && (
            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '8px' }}>
                <Layers size={14} />
                <span>Auto Fibonacci Retracement (90 Hari)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px' }}>
                {fibo.levels.map((lvl) => (
                  <div key={lvl.label} className="fibo-item">
                    <span style={{ color: lvl.color, fontWeight: 700 }}>{lvl.label}</span>
                    <span className="num-mono" style={{ fontWeight: 600 }}>Rp {lvl.price.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pivot Points Box */}
          {pivot && (
            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#eab308', marginBottom: '8px' }}>
                <Compass size={14} />
                <span>Pivot Points Klasik (Support & Resistance)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '6px' }}>
                <div className="fibo-item">
                  <span style={{ color: 'var(--color-bearish)' }}>R2 (Kuat)</span>
                  <span className="num-mono">Rp {pivot.classic.R2.toLocaleString('id-ID')}</span>
                </div>
                <div className="fibo-item">
                  <span style={{ color: '#f97316' }}>R1 (Resist)</span>
                  <span className="num-mono">Rp {pivot.classic.R1.toLocaleString('id-ID')}</span>
                </div>
                <div className="fibo-item">
                  <span style={{ color: '#eab308', fontWeight: 800 }}>P (Pivot)</span>
                  <span className="num-mono" style={{ fontWeight: 700 }}>Rp {pivot.classic.P.toLocaleString('id-ID')}</span>
                </div>
                <div className="fibo-item">
                  <span style={{ color: '#38bdf8' }}>S1 (Supp)</span>
                  <span className="num-mono">Rp {pivot.classic.S1.toLocaleString('id-ID')}</span>
                </div>
                <div className="fibo-item">
                  <span style={{ color: 'var(--color-bullish)' }}>S2 (Kuat)</span>
                  <span className="num-mono">Rp {pivot.classic.S2.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
