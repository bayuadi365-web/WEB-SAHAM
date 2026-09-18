<header class="navbar">
    <div class="navbar-top">
        <!-- Brand -->
        <div class="brand-section" onclick="window.location.href='/'">
            <div class="brand-logo-icon">
                <i data-lucide="trending-up" size="22" color="#ffffff"></i>
            </div>
            <div>
                <div class="brand-title">MASBAY ANALYSIS</div>
                <div class="brand-subtitle">Bursa Efek Indonesia • Market Terminal</div>
            </div>
        </div>

        <!-- Market Status & Clock -->
        <div style="display: flex; align-items: center; gap: 16px;">
            <div class="market-status-pill">
                <span class="pulse-dot"></span>
                <span>BEI ACTIVE</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--text-muted);">
                <i data-lucide="clock" size="14"></i>
                <span class="num-mono" x-data="{ timeStr: '' }" x-init="
                    setInterval(() => {
                        const now = new Date();
                        timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
                    }, 1000);
                " x-text="timeStr"></span>
            </div>
        </div>

        <!-- Integrated Search -->
        <div class="search-container" style="position: relative; flex: 1; max-width: 400px;" x-data="{ searchQuery: '', results: [], showDropdown: false }" @click.outside="showDropdown = false">
            <div class="search-input-wrapper" style="display: flex; align-items: center; background: var(--bg-primary); border: 1px solid var(--border-medium); border-radius: 6px; padding: 6px 12px; gap: 8px;">
                <i data-lucide="search" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
                <input 
                    type="text" 
                    x-model="searchQuery" 
                    @focus="showDropdown = true"
                    @input.debounce.300ms="
                        showDropdown = true;
                        if(searchQuery.length > 1) {
                            fetch('/api/search?q=' + searchQuery)
                            .then(res => res.json())
                            .then(data => {
                                results = data;
                                setTimeout(() => lucide.createIcons(), 50);
                            });
                        } else {
                            results = [];
                        }
                    "
                    placeholder="Cari kode saham (misal: BBCA, TLKM)..."
                    style="background: transparent; border: none; color: var(--text-main); width: 100%; outline: none; font-size: 0.85rem;"
                >
                <span class="kbd-shortcut">Ctrl K</span>
            </div>

            <!-- Dropdown Results -->
            <div x-show="showDropdown && searchQuery.length > 1" style="display: none; position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px; background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: 6px; z-index: 50; max-height: 400px; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <template x-if="results.length === 0">
                    <div style="text-align: center; padding: 20px 16px; color: var(--text-dim);">
                        Tidak ada saham cocok untuk "<span x-text="searchQuery"></span>"
                    </div>
                </template>
                
                <template x-for="stock in results" :key="stock.ticker">
                    <div class="search-result-item" @click="window.location.href='/stocks/' + stock.ticker" style="padding: 10px 16px; border-bottom: 1px solid var(--border-subtle); cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='var(--color-accent-bg)'" onmouseout="this.style.background='transparent'">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="font-weight: 800; font-family: var(--font-mono); color: var(--text-main); font-size: 0.95rem;" x-text="stock.ticker"></span>
                                    </div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);" x-text="stock.name"></div>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div class="num-mono" style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">
                                    Rp <span x-text="new Intl.NumberFormat('id-ID').format(stock.price)"></span>
                                </div>
                                <div class="num-mono" :class="stock.change >= 0 ? 'bullish-text' : 'bearish-text'" style="font-size: 0.75rem; font-weight: 600;">
                                    <span x-text="(stock.change >= 0 ? '+' : '') + stock.change_percent + '%'"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Watchlist Quick Button -->
        <button
            class="btn-watchlist-toggle"
            onclick="window.location.href='{{ route('watchlist') }}'"
            title="Buka Daftar Pantau / Watchlist"
        >
            <i data-lucide="bookmark" size="16"></i>
            <span>Watchlist</span>
            <span
                style="
                    background: var(--color-accent-bg);
                    color: var(--color-accent);
                    padding: 1px 6px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                "
            >
                {{ \App\Models\Watchlist::where('session_id', session()->getId())->count() }}
            </span>
        </button>
    </div>

    <!-- Marquee Ticker Tape -->
    <div class="ticker-tape">
        <div class="ticker-track">
            @if(!empty($ihsgData))
                @php $isPositiveIHSG = ($ihsgData['change'] ?? 0) >= 0; @endphp
                <div class="ticker-item" onclick="window.location.href='/'">
                    <span class="ticker-item-code" style="color: var(--color-accent);">
                        IHSG (COMPOSITE)
                    </span>
                    <span class="ticker-item-price num-mono">
                        {{ number_format($ihsgData['price'] ?? 0, 0, ',', '.') }}
                    </span>
                    <span
                        class="num-mono {{ $isPositiveIHSG ? 'bullish-text' : 'bearish-text' }}"
                        style="display: inline-flex; align-items: center; gap: 2px;"
                    >
                        <i data-lucide="{{ $isPositiveIHSG ? 'arrow-up-right' : 'arrow-down-right' }}" size="14"></i>
                        {{ $isPositiveIHSG ? '+' : '' }}{{ $ihsgData['change'] ?? 0 }} ({{ $isPositiveIHSG ? '+' : '' }}{{ $ihsgData['changePercent'] ?? 0 }}%)
                    </span>
                </div>
            @endif

            <!-- Emiten Stocks (Top 20 from DB as sample) -->
            @php $tickerStocks = \App\Models\Stock::limit(20)->get(); @endphp
            @foreach($tickerStocks as $ts)
                @php $isUp = $ts->change >= 0; @endphp
                <div class="ticker-item" onclick="window.location.href='/stocks/{{ $ts->ticker }}'">
                    <span class="ticker-item-code">{{ $ts->ticker }}</span>
                    <span class="ticker-item-price num-mono">
                        {{ number_format($ts->price, 0, ',', '.') }}
                    </span>
                    <span class="num-mono {{ $isUp ? 'bullish-text' : 'bearish-text' }}">
                        {{ $isUp ? '+' : '' }}{{ $ts->change_percent }}%
                    </span>
                </div>
            @endforeach
        </div>
    </div>
</header>
