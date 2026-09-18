<div class="stock-hero-bar">
    <!-- Emiten Info -->
    <div class="stock-hero-info">
        <div class="stock-hero-badge">
            <span>{{ $currentStock->ticker }}</span>
        </div>
        <div>
            <div style="font-weight: 700; font-size: 1.05rem; color: #fff;">
                {{ $currentStock->name }}
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="stock-hero-sector-tag">{{ $currentStock->sector->name ?? $currentStock->sector }}</span>
                <span style="font-size: 0.75rem; color: var(--text-dim);">
                    {{ $currentStock->sub_sector }}
                </span>
            </div>
        </div>
    </div>

    <!-- Price & Change -->
    <div class="stock-hero-price-section">
        <span class="stock-hero-price">
            Rp {{ number_format($currentStock->price, 0, ',', '.') }}
        </span>
        @php $isUp = $currentStock->change >= 0; @endphp
        <span class="stock-hero-change-badge {{ $isUp ? 'bullish' : 'bearish' }}">
            <i data-lucide="{{ $isUp ? 'arrow-up-right' : 'arrow-down-right' }}" style="width: 18px; height: 18px;"></i>
            {{ $isUp ? '+' : '' }}{{ $currentStock->change }} ({{ $isUp ? '+' : '' }}{{ $currentStock->change_percent }}%)
        </span>
    </div>

    <!-- Quick Metrics -->
    <div class="stock-hero-quick-stats">
        <div class="quick-stat-item">
            <span class="quick-stat-label">Tertinggi Hari Ini</span>
            <span class="quick-stat-val" style="color: var(--color-bullish);">
                Rp {{ number_format($currentStock->day_high, 0, ',', '.') }}
            </span>
        </div>
        <div class="quick-stat-item">
            <span class="quick-stat-label">Terendah Hari Ini</span>
            <span class="quick-stat-val" style="color: var(--color-bearish);">
                Rp {{ number_format($currentStock->day_low, 0, ',', '.') }}
            </span>
        </div>
        <div class="quick-stat-item">
            <span class="quick-stat-label">PER (TTM)</span>
            <span class="quick-stat-val">
                {{ $currentStock->fundamentals->pe_ratio ?? '-' }}x
            </span>
        </div>
        <div class="quick-stat-item">
            <span class="quick-stat-label">PBV</span>
            <span class="quick-stat-val">
                {{ $currentStock->fundamentals->pbv_ratio ?? '-' }}x
            </span>
        </div>
        <div class="quick-stat-item">
            <span class="quick-stat-label">Kapitalisasi Pasar</span>
            <span class="quick-stat-val" style="color: var(--color-accent);">
                Rp {{ number_format($currentStock->market_cap / 1e12, 2, ',', '.') }} T
            </span>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="stock-hero-actions">
        <button
            class="btn-watchlist-toggle {{ in_array($currentStock->ticker, $watchlist) ? 'active' : '' }}"
            onclick="toggleWatchlist('{{ $currentStock->ticker }}')"
        >
            <i data-lucide="star" style="width: 16px; height: 16px;" {{ in_array($currentStock->ticker, $watchlist) ? 'fill="var(--color-amber)"' : '' }}></i>
            <span x-text="watchlist.includes('{{ $currentStock->ticker }}') ? 'Tersimpan di Watchlist' : 'Tambah ke Watchlist'">
                {{ in_array($currentStock->ticker, $watchlist) ? 'Tersimpan di Watchlist' : 'Tambah ke Watchlist' }}
            </span>
        </button>
    </div>
</div>
