<div class="card-terminal">
    <div class="card-header">
        <div class="card-title">
            <i data-lucide="zap" color="#F59E0B"></i>
            <span>Screener Saham Scalping (Algoritma Volatilitas & Momentum)</span>
        </div>
    </div>

    <div style="padding: 20px; border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.2);">
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px; line-height: 1.5;">
            Screener ini secara khusus memindai puluhan saham paling likuid dan bergejolak di BEI secara <strong>real-time</strong>. 
            Algoritma akan mencari saham yang sedang mengalami <strong>lonjakan harga (Momentum)</strong> dan <strong>peningkatan volume</strong> hari ini, yang sangat cocok untuk metode *Scalping* (Trading kilat).
        </p>
        
        <button id="btn-run-screener" class="tab-btn active" style="background: var(--color-accent); color: #fff; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; border: none;">
            <i data-lucide="play" size="18"></i>
            <span>Jalankan Screener Sekarang</span>
        </button>

        <div id="screener-progress-container" style="display: none; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-dim); margin-bottom: 8px;">
                <span id="screener-status-text">Memindai data real-time...</span>
                <span id="screener-progress-text">0%</span>
            </div>
            <div style="width: 100%; background: rgba(255,255,255,0.1); border-radius: 4px; height: 8px; overflow: hidden;">
                <div id="screener-progress-bar" style="width: 0%; height: 100%; background: var(--color-accent); transition: width 0.3s ease;"></div>
            </div>
        </div>
    </div>

    <div id="screener-results-container" style="display: none;">
        <div class="table-responsive">
            <table class="terminal-table">
                <thead>
                    <tr>
                        <th width="40">Rank</th>
                        <th>Ticker</th>
                        <th>Kondisi Tren</th>
                        <th>Harga Terakhir</th>
                        <th>Perubahan (%)</th>
                        <th>Volume Relatif</th>
                        <th>Skor Scalping</th>
                        <th style="text-align: right;">Aksi</th>
                    </tr>
                </thead>
                <tbody id="screener-results-body">
                    <!-- Results will be injected here by JS -->
                </tbody>
            </table>
        </div>
        
        <div style="padding: 16px; text-align: center; color: var(--text-dim); font-size: 0.8rem;">
            * Peringatan Risiko: Saham scalping memiliki pergerakan yang sangat cepat. Selalu pasang Stop Loss ketat.
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const btnRun = document.getElementById('btn-run-screener');
    const progressContainer = document.getElementById('screener-progress-container');
    const progressBar = document.getElementById('screener-progress-bar');
    const progressText = document.getElementById('screener-progress-text');
    const statusText = document.getElementById('screener-status-text');
    const resultsContainer = document.getElementById('screener-results-container');
    const resultsBody = document.getElementById('screener-results-body');

    // Daftar saham berkapitalisasi besar/menengah & likuid yang sering dipakai scalping/day trade
    const TARGET_STOCKS = [
        'GOTO', 'BREN', 'CUAN', 'AMMN', 'PANI', 'TPIA', 'BRPT', 'MEDC', 
        'PGAS', 'ADRO', 'PTBA', 'ITMG', 'BUMI', 'BRMS', 'MDKA', 'ANTM',
        'INCO', 'BBRI', 'BBCA', 'BMRI', 'BBNI', 'ARTO', 'WIKA', 'PTPP', 'KLBF'
    ];

    btnRun.addEventListener('click', async () => {
        // Reset UI
        btnRun.disabled = true;
        btnRun.style.opacity = '0.5';
        resultsContainer.style.display = 'none';
        progressContainer.style.display = 'block';
        resultsBody.innerHTML = '';
        progressBar.style.width = '0%';
        progressText.innerText = '0%';
        
        let processed = 0;
        let results = [];

        // Function to analyze a single stock
        const analyzeStock = async (ticker) => {
            try {
                // Fetch daily chart data (last few days) to see today's momentum
                const res = await fetch(`/api/chart/${ticker}`);
                const data = await res.json();
                
                if (data && data.length > 1) {
                    const today = data[data.length - 1];
                    const yesterday = data[data.length - 2];
                    
                    if (yesterday && today) {
                        const changePercent = ((today.close - yesterday.close) / yesterday.close) * 100;
                        const isGreen = today.close > today.open;
                        const bodySize = Math.abs(today.close - today.open) / today.open * 100;
                        
                        // Relative volume approximation (just comparing to yesterday)
                        const volRatio = today.value > 0 && yesterday.value > 0 ? (today.value / yesterday.value) : 1;
                        
                        // Scalping Score Logic (0-100)
                        let score = 0;
                        if (changePercent > 0) score += 30; // Uptrend
                        if (changePercent > 2) score += 20; // Strong momentum
                        if (isGreen) score += 20; // Buying pressure
                        if (volRatio > 1.2) score += 30; // High volume spike
                        
                        if (score > 40) { // Only keep decent candidates
                            results.push({
                                ticker,
                                price: today.close,
                                change: changePercent,
                                isGreen,
                                volRatio,
                                score: Math.min(100, Math.round(score + (changePercent * 2))) // bonus for huge gains
                            });
                        }
                    }
                }
            } catch (e) {
                console.error(`Error analyzing ${ticker}:`, e);
            } finally {
                processed++;
                const percentage = Math.round((processed / TARGET_STOCKS.length) * 100);
                progressBar.style.width = percentage + '%';
                progressText.innerText = percentage + '%';
                statusText.innerText = `Menganalisis ${ticker}...`;
            }
        };

        // Run concurrent fetches with a slight delay to avoid overwhelming the server/browser
        const chunkSize = 5;
        for (let i = 0; i < TARGET_STOCKS.length; i += chunkSize) {
            const chunk = TARGET_STOCKS.slice(i, i + chunkSize);
            await Promise.all(chunk.map(ticker => analyzeStock(ticker)));
            await new Promise(r => setTimeout(r, 300)); // 300ms pause between chunks
        }
        
        statusText.innerText = "Analisis Selesai!";
        
        // Sort results by score (descending)
        results.sort((a, b) => b.score - a.score);
        
        // Render top 10
        const topResults = results.slice(0, 10);
        
        if (topResults.length === 0) {
            resultsBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-dim);">
                        Tidak ada saham dengan momentum kuat saat ini. Pasar mungkin sedang sideways atau koreksi.
                    </td>
                </tr>
            `;
        } else {
            topResults.forEach((item, index) => {
                const colorClass = item.change >= 0 ? 'bullish-text' : 'bearish-text';
                const sign = item.change > 0 ? '+' : '';
                
                // Determine Trend Label
                let trendHtml = '';
                if (item.score >= 90) trendHtml = '<span style="background: rgba(16, 185, 129, 0.2); color: #10B981; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">Strong Uptrend / Breakout</span>';
                else if (item.score >= 70) trendHtml = '<span style="background: rgba(14, 165, 233, 0.2); color: #0EA5E9; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">Momentum Naik</span>';
                else trendHtml = '<span style="background: rgba(245, 158, 11, 0.2); color: #F59E0B; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">Volatil / Spekulatif</span>';

                resultsBody.innerHTML += `
                    <tr style="cursor: pointer;" onclick="window.location.href='/?ticker=${item.ticker}&tab=chart'">
                        <td style="color: var(--text-dim); text-align: center;"><strong>${index + 1}</strong></td>
                        <td><strong style="font-family: var(--font-mono); color: #fff; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${item.ticker}</strong></td>
                        <td>${trendHtml}</td>
                        <td class="num-mono" style="font-weight: bold;">Rp ${item.price.toLocaleString('id-ID')}</td>
                        <td><span class="num-mono ${colorClass}" style="font-weight: bold;">${sign}${item.change.toFixed(2)}%</span></td>
                        <td class="num-mono">${item.volRatio.toFixed(1)}x Rata-rata</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 60px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                                    <div style="width: ${item.score}%; height: 100%; background: ${item.score > 80 ? '#10B981' : (item.score > 60 ? '#3B82F6' : '#F59E0B')};"></div>
                                </div>
                                <span style="font-family: var(--font-mono); font-size: 0.85rem; color: #fff;">${item.score}/100</span>
                            </div>
                        </td>
                        <td style="text-align: right;">
                            <a href="/?ticker=${item.ticker}&tab=chart" style="color: var(--color-accent); text-decoration: none; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border: 1px solid rgba(14,165,233,0.3); border-radius: 4px;">
                                Trade <i data-lucide="chevron-right" size="14"></i>
                            </a>
                        </td>
                    </tr>
                `;
            });
        }
        
        // Re-initialize lucide icons for new elements if lucide is available
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        setTimeout(() => {
            progressContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            btnRun.disabled = false;
            btnRun.style.opacity = '1';
        }, 500);
    });
});
</script>
