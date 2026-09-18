<div class="trading-workspace-grid">
    <div class="chart-panel" style="flex: 1; min-height: 500px; display: flex; flex-direction: column;">
        <div class="chart-header">
            <div class="chart-title">
                <i data-lucide="bar-chart-2"></i>
                <span>Interactive Chart - {{ $currentStock->ticker }}</span>
            </div>
            <div class="timeframe-selector">
                @foreach(['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'] as $tf)
                    <button class="tf-btn {{ $tf === '6M' ? 'active' : '' }}">{{ $tf }}</button>
                @endforeach
            </div>
        </div>
        <div id="tvchart" style="flex: 1; width: 100%; background: #131722; position: relative;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--text-dim);">
                <em>(Interactive chart is loading... JavaScript migration in progress)</em>
            </div>
        </div>
    </div>
    
    <div class="indicators-panel" style="width: 300px;">
        <div class="panel-header">
            <div class="panel-title">
                <i data-lucide="layers"></i>
                <span>Indikator Teknikal</span>
            </div>
        </div>
        <div style="padding: 16px; color: var(--text-dim); font-size: 0.85rem; max-height: 400px; overflow-y: auto;">
            
            <div style="margin-bottom: 16px;">
                <p style="margin-bottom: 8px; font-weight: bold; color: #fff;">Volume</p>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="toggle-volume" style="accent-color: #26a69a; width: 16px; height: 16px;" checked>
                    <span>Volume Transaksi</span>
                </label>
            </div>

            <div style="margin-bottom: 16px;">
                <p style="margin-bottom: 8px; font-weight: bold; color: #fff;">Simple Moving Average (SMA)</p>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="toggle-sma20" style="accent-color: #2962FF; width: 16px; height: 16px;">
                    <span style="color: #2962FF;">SMA 20 (Biru)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="toggle-sma50" style="accent-color: #FF9800; width: 16px; height: 16px;">
                    <span style="color: #FF9800;">SMA 50 (Oranye)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="toggle-sma200" style="accent-color: #E91E63; width: 16px; height: 16px;">
                    <span style="color: #E91E63;">SMA 200 (Pink)</span>
                </label>
            </div>
            
            <div style="margin-bottom: 16px;">
                <p style="margin-bottom: 8px; font-weight: bold; color: #fff;">Exponential Moving Average (EMA)</p>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="toggle-ema20" style="accent-color: #00E676; width: 16px; height: 16px;">
                    <span style="color: #00E676;">EMA 20 (Hijau)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="toggle-ema50" style="accent-color: #FFEA00; width: 16px; height: 16px;">
                    <span style="color: #FFEA00;">EMA 50 (Kuning)</span>
                </label>
            </div>
            
            <div style="margin-bottom: 16px;">
                <p style="margin-bottom: 8px; font-weight: bold; color: #fff;">Bollinger Bands</p>
                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="toggle-bb" style="accent-color: #9C27B0; width: 16px; height: 16px;">
                    <span style="color: #9C27B0;">Bollinger Bands (20, 2)</span>
                </label>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('tvchart');
        
        try {
            // Remove placeholder text if chart loads
            container.innerHTML = '';
            
            if (typeof LightweightCharts === 'undefined') {
                throw new Error('LightweightCharts library is not loaded from CDN.');
            }
            
            // Simple initialization of lightweight charts as a placeholder
            const chart = LightweightCharts.createChart(container, {
                width: container.clientWidth || 800,
                height: container.clientHeight || 450,
                layout: {
                    background: { type: 'solid', color: '#131722' },
                    textColor: '#d1d4dc',
                },
                grid: {
                    vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
                    horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
                },
                crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
                rightPriceScale: { borderColor: 'rgba(197, 203, 206, 0.8)' },
                timeScale: { borderColor: 'rgba(197, 203, 206, 0.8)' },
            });
            
            const candlestickSeries = chart.addSeries(LightweightCharts.CandlestickSeries, {
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });
            
            
            // Helpers for Indicators
            function calculateSMA(data, period) {
                const result = [];
                for (let i = period - 1; i < data.length; i++) {
                    let sum = 0;
                    for (let j = 0; j < period; j++) {
                        sum += data[i - j].close;
                    }
                    result.push({ time: data[i].time, value: sum / period });
                }
                return result;
            }
            
            function calculateEMA(data, period) {
                const result = [];
                const k = 2 / (period + 1);
                let ema = 0;
                // Calculate first SMA
                if (data.length >= period) {
                    for (let i = 0; i < period; i++) {
                        ema += data[i].close;
                    }
                    ema = ema / period;
                    result.push({ time: data[period - 1].time, value: ema });
                    
                    for (let i = period; i < data.length; i++) {
                        ema = (data[i].close - ema) * k + ema;
                        result.push({ time: data[i].time, value: ema });
                    }
                }
                return result;
            }
            
            function calculateBB(data, period, stdDevMult) {
                const upper = [];
                const lower = [];
                for (let i = period - 1; i < data.length; i++) {
                    let sum = 0;
                    for (let j = 0; j < period; j++) {
                        sum += data[i - j].close;
                    }
                    const sma = sum / period;
                    
                    let varianceSum = 0;
                    for (let j = 0; j < period; j++) {
                        varianceSum += Math.pow(data[i - j].close - sma, 2);
                    }
                    const stdDev = Math.sqrt(varianceSum / period);
                    
                    upper.push({ time: data[i].time, value: sma + (stdDevMult * stdDev) });
                    lower.push({ time: data[i].time, value: sma - (stdDevMult * stdDev) });
                }
                return { upper, lower };
            }
            
            let chartData = [];
            let volumeData = [];
            
            // Series definitions
            let volumeSeries = chart.addSeries(LightweightCharts.HistogramSeries, {
                color: '#26a69a',
                priceFormat: { type: 'volume' },
                priceScaleId: '', // set as an overlay by setting a blank priceScaleId
            });
            volumeSeries.priceScale().applyOptions({
                scaleMargins: { top: 0.8, bottom: 0 },
            });
            
            let sma20Series = null;
            let sma50Series = null;
            let sma200Series = null;
            let ema20Series = null;
            let ema50Series = null;
            let bbUpperSeries = null;
            let bbLowerSeries = null;
            
            // Fetch real data from our backend API
            fetch(`/api/chart/{{ $currentStock->ticker }}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        chartData = data;
                        volumeData = data.map(d => ({
                            time: d.time, 
                            value: d.value, 
                            color: d.close >= d.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)' 
                        }));
                        
                        candlestickSeries.setData(chartData);
                        volumeSeries.setData(volumeData);
                        chart.timeScale().fitContent();
                        
                        setupIndicators();
                    } else {
                        container.innerHTML = '<div style="color:var(--text-dim); padding: 20px;">No chart data available for this ticker.</div>';
                    }
                })
                .catch(err => {
                    console.error('Error fetching chart data:', err);
                    container.innerHTML = '<div style="color:red; padding: 20px;">Error fetching chart data: ' + err.message + '</div>';
                });
                
            function setupIndicators() {
                // Volume
                document.getElementById('toggle-volume').addEventListener('change', (e) => {
                    volumeSeries.applyOptions({ visible: e.target.checked });
                });
                
                // SMA
                const setupLine = (id, color, calcFunc) => {
                    let series = null;
                    document.getElementById(id).addEventListener('change', (e) => {
                        if (e.target.checked) {
                            if (!series) series = chart.addSeries(LightweightCharts.LineSeries, { color: color, lineWidth: 2, crosshairMarkerVisible: false });
                            series.setData(calcFunc());
                        } else if (series) {
                            chart.removeSeries(series);
                            series = null;
                        }
                    });
                };
                
                setupLine('toggle-sma20', '#2962FF', () => calculateSMA(chartData, 20));
                setupLine('toggle-sma50', '#FF9800', () => calculateSMA(chartData, 50));
                setupLine('toggle-sma200', '#E91E63', () => calculateSMA(chartData, 200));
                setupLine('toggle-ema20', '#00E676', () => calculateEMA(chartData, 20));
                setupLine('toggle-ema50', '#FFEA00', () => calculateEMA(chartData, 50));
                
                // Bollinger Bands
                document.getElementById('toggle-bb').addEventListener('change', (e) => {
                    if (e.target.checked) {
                        const bands = calculateBB(chartData, 20, 2);
                        if (!bbUpperSeries) bbUpperSeries = chart.addSeries(LightweightCharts.LineSeries, { color: 'rgba(156, 39, 176, 0.5)', lineWidth: 1, crosshairMarkerVisible: false });
                        if (!bbLowerSeries) bbLowerSeries = chart.addSeries(LightweightCharts.LineSeries, { color: 'rgba(156, 39, 176, 0.5)', lineWidth: 1, crosshairMarkerVisible: false });
                        bbUpperSeries.setData(bands.upper);
                        bbLowerSeries.setData(bands.lower);
                    } else {
                        if (bbUpperSeries) chart.removeSeries(bbUpperSeries);
                        if (bbLowerSeries) chart.removeSeries(bbLowerSeries);
                        bbUpperSeries = null;
                        bbLowerSeries = null;
                    }
                });
            }
        } catch (e) {
            console.error('Error setting chart data:', e);
            container.innerHTML = '<div style="color:red; padding: 20px;">Error rendering chart: ' + e.message + '</div>';
        }
    });
</script>
