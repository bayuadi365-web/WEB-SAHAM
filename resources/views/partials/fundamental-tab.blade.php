<div style="display: flex; flex-direction: column; gap: 20px;">
    <!-- Top Banner: Health Score & Executive Summary -->
    <div style="background: linear-gradient(135deg, rgba(19, 29, 49, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <i data-lucide="award" size="20" color="var(--color-accent)"></i>
                <span style="font-size: 1.1rem; font-weight: 800; color: #fff;">
                    Analisis Fundamental Komprehensif — {{ $currentStock->name }} ({{ $currentStock->ticker }})
                </span>
            </div>
            <div style="font-size: 0.84rem; color: var(--text-muted); max-width: 800px;">
                {{ $currentStock->description }}
            </div>
        </div>

        <!-- Health Score Pill (Simplified for Laravel) -->
        <div style="display: flex; align-items: center; gap: 12px; background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.3); padding: 10px 18px; border-radius: var(--radius-lg);">
            <div style="text-align: right;">
                <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">
                    SKOR FUNDAMENTAL
                </div>
                <div style="font-size: 1.4rem; font-weight: 900; color: var(--color-accent);" class="num-mono">
                    75 / 100
                </div>
            </div>
            <div style="height: 36px; width: 1px; background: var(--border-subtle);"></div>
            <div style="font-size: 0.78rem; color: var(--color-bullish); font-weight: 700; display: flex; align-items: center; gap: 4px;">
                <i data-lucide="check-circle-2" size="16"></i>
                <span>Sangat Solid</span>
            </div>
        </div>
    </div>

    <!-- 5 Kategori Rasio Utama -->
    <div class="fundamental-grid">
        <!-- 1. Valuasi -->
        <div class="metric-category-card">
            <div class="metric-category-header">
                <i data-lucide="dollar-sign" size="18"></i>
                <span>Valuasi Pasar</span>
            </div>
            <div class="metric-rows-list">
                <div class="metric-row">
                    <span class="metric-name">PER (Price to Earnings TTM)</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->pe_ratio ?? '-' }}x</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">PBV (Price to Book Value)</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->pbv_ratio ?? '-' }}x</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">EV / EBITDA</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->ev_ebitda ?? '-' }}x</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">Price to Sales (P/S)</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->ps_ratio ?? '-' }}x</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">Kapitalisasi Pasar (Market Cap)</span>
                    <span class="metric-value" style="color: var(--color-accent);">
                        Rp {{ number_format($currentStock->market_cap / 1e12, 2, ',', '.') }} T
                    </span>
                </div>
            </div>
        </div>

        <!-- 2. Profitabilitas -->
        <div class="metric-category-card">
            <div class="metric-category-header">
                <i data-lucide="trending-up" size="18"></i>
                <span>Profitabilitas</span>
            </div>
            <div class="metric-rows-list">
                <div class="metric-row">
                    <span class="metric-name">ROE (Return on Equity)</span>
                    <span class="metric-value" style="color: var(--color-bullish);">
                        {{ $currentStock->fundamentals->roe ?? '-' }}%
                    </span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">ROA (Return on Assets)</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->roa ?? '-' }}%</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">NPM (Net Profit Margin)</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->npm ?? '-' }}%</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">GPM (Gross Profit Margin)</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->gpm ?? '-' }}%</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">Operating Margin</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->operating_margin ?? '-' }}%</span>
                </div>
            </div>
        </div>

        <!-- 3. Solvabilitas & Likuiditas -->
        <div class="metric-category-card">
            <div class="metric-category-header">
                <i data-lucide="shield-check" size="18"></i>
                <span>Solvabilitas & Likuiditas</span>
            </div>
            <div class="metric-rows-list">
                <div class="metric-row">
                    <span class="metric-name">DER (Debt to Equity Ratio)</span>
                    <span class="metric-value">
                        {{ $currentStock->fundamentals->der ?? '-' }}x
                    </span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">Current Ratio</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->current_ratio ?? '-' }}x</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">Quick Ratio</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->quick_ratio ?? '-' }}x</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">CAR (Capital Adequacy Ratio)</span>
                    <span class="metric-value" style="color: var(--color-bullish);">{{ $currentStock->fundamentals->car ?? '-' }}%</span>
                </div>
            </div>
        </div>

        <!-- 4. Pertumbuhan -->
        <div class="metric-category-card">
            <div class="metric-category-header">
                <i data-lucide="percent" size="18"></i>
                <span>Pertumbuhan (YoY)</span>
            </div>
            <div class="metric-rows-list">
                <div class="metric-row">
                    <span class="metric-name">Pertumbuhan Pendapatan (YoY)</span>
                    <span class="metric-value">
                        {{ $currentStock->fundamentals->revenue_growth_yoy ?? '-' }}%
                    </span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">Pertumbuhan Laba Bersih (YoY)</span>
                    <span class="metric-value">
                        {{ $currentStock->fundamentals->net_income_growth_yoy ?? '-' }}%
                    </span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">Pertumbuhan EPS (YoY)</span>
                    <span class="metric-value">
                        {{ $currentStock->fundamentals->eps_growth ?? '-' }}%
                    </span>
                </div>
            </div>
        </div>

        <!-- 5. Dividen -->
        <div class="metric-category-card">
            <div class="metric-category-header">
                <i data-lucide="award" size="18"></i>
                <span>Dividen Pemegang Saham</span>
            </div>
            <div class="metric-rows-list">
                <div class="metric-row">
                    <span class="metric-name">Dividend Yield (Tahunan)</span>
                    <span class="metric-value">
                        {{ $currentStock->fundamentals->dividend_yield ?? '-' }}%
                    </span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">Dividend Payout Ratio (DPR)</span>
                    <span class="metric-value">{{ $currentStock->fundamentals->dividend_payout_ratio ?? '-' }}%</span>
                </div>
                <div class="metric-row">
                    <span class="metric-name">Dividen per Saham (DPS) Terakhir</span>
                    <span class="metric-value">Rp {{ $currentStock->fundamentals->dps ?? '-' }} / lbr</span>
                </div>
            </div>
        </div>
    </div>
</div>
