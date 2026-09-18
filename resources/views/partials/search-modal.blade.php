<div x-show="isSearchOpen" style="display: none;" class="modal-overlay" @click.self="isSearchOpen = false" x-effect="if(isSearchOpen) setTimeout(() => $refs.searchInput.focus(), 50)">
    <div class="search-modal-box" x-data="{ searchQuery: '', results: [] }" x-init="$watch('results', () => setTimeout(() => lucide.createIcons(), 50))" @click.stop>
        <!-- Search Input Header -->
        <div class="search-modal-header">
            <i data-lucide="search" style="color: var(--color-accent); width: 20px; height: 20px;"></i>
            <input 
                type="text" 
                class="search-modal-input"
                x-model="searchQuery" 
                x-ref="searchInput"
                @input.debounce.300ms="
                    if(searchQuery.length > 1) {
                        fetch('/api/search?q=' + searchQuery)
                        .then(res => res.json())
                        .then(data => results = data);
                    } else {
                        results = [];
                    }
                "
                placeholder="Cari kode saham atau nama emiten (contoh: BBCA, Astra)..."
            >
            <button @click="isSearchOpen = false" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;">
                <i data-lucide="x" style="width: 20px; height: 20px;"></i>
            </button>
        </div>

        <!-- Results List -->
        <div class="search-results-list">
            <template x-if="results.length === 0 && searchQuery.length > 1">
                <div style="text-align: center; padding: 30px 16px; color: var(--text-dim);">
                    Tidak ada saham yang cocok dengan pencarian "<span x-text="searchQuery"></span>"
                </div>
            </template>
            
            <template x-for="stock in results" :key="stock.ticker">
                <div class="search-result-item" @click="window.location.href='/?ticker=' + stock.ticker">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button 
                            @click.stop="toggleWatchlist(stock.ticker)" 
                            style="background: none; border: none; cursor: pointer; padding: 4px; transition: transform 0.15s ease;"
                            :style="watchlist.includes(stock.ticker) ? 'color: var(--color-amber)' : 'color: var(--text-dim)'"
                        >
                            <i data-lucide="star" style="width: 18px; height: 18px;" :fill="watchlist.includes(stock.ticker) ? 'var(--color-amber)' : 'none'"></i>
                        </button>
                        
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-weight: 800; font-family: var(--font-mono); color: var(--text-main); font-size: 0.95rem;" x-text="stock.ticker"></span>
                                <span style="font-size: 0.7rem; padding: 1px 6px; border-radius: 4px; background: rgba(255,255,255,0.06); color: var(--text-dim);" x-text="stock.sector ? stock.sector.name : ''"></span>
                            </div>
                            <div style="font-size: 0.78rem; color: var(--text-muted);" x-text="stock.name"></div>
                        </div>
                    </div>
                    
                    <div style="text-align: right;">
                        <div class="num-mono" style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">
                            Rp <span x-text="new Intl.NumberFormat('id-ID').format(stock.price)"></span>
                        </div>
                        <div class="num-mono" :class="stock.change >= 0 ? 'bullish-text' : 'bearish-text'" style="display: flex; align-items: center; justify-content: flex-end; gap: 2px; font-size: 0.8rem; font-weight: 600;">
                            <i :data-lucide="stock.change >= 0 ? 'arrow-up-right' : 'arrow-down-right'" style="width: 14px; height: 14px;"></i>
                            <span x-text="(stock.change >= 0 ? '+' : '') + stock.change_percent + '%'"></span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</div>


