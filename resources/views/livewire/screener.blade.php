<div>
    <div style="padding: 20px;">
        <h2 style="color: var(--text-main); margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
            <i data-lucide="zap" style="color: var(--color-accent);"></i>
            Screener Saham Lanjutan
        </h2>

        <!-- AI Top Picks Section -->
        @if(isset($topPicks) && count($topPicks) > 0)
        <div class="card-terminal" style="padding: 24px; margin-bottom: 24px; border: 1px solid rgba(225, 29, 72, 0.3); box-shadow: 0 4px 15px rgba(225, 29, 72, 0.1);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                <i data-lucide="cpu" style="color: var(--color-accent);"></i>
                <h3 style="color: var(--text-main); font-weight: 700; margin: 0; font-size: 1.1rem;">Top Rekomendasi Mesin Hari Ini</h3>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                @foreach($topPicks as $pick)
                <a href="/stocks/{{ $pick['stock']->ticker }}" style="display: block; text-decoration: none; background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border-left: 3px solid var(--color-accent); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(225, 29, 72, 0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div>
                            <span class="ticker-highlight" style="font-size: 1.2rem; color: var(--text-main);">{{ $pick['stock']->ticker }}</span>
                            <div class="ticker-name-sub" style="color: var(--text-muted);">{{ Str::limit($pick['stock']->name, 20) }}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Skor AI</div>
                            <div style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 800; color: {{ $pick['score'] >= 75 ? '#10b981' : 'var(--color-accent)' }}; text-shadow: 0 2px 10px {{ $pick['score'] >= 75 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(225, 29, 72, 0.2)' }};">
                                {{ $pick['score'] }}
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        @foreach($pick['reasons'] as $reason)
                            <span style="font-size: 0.7rem; padding: 3px 8px; background: rgba(0,0,0,0.05); border-radius: 4px; color: var(--text-muted); border: 1px solid rgba(0,0,0,0.1);">{{ $reason }}</span>
                        @endforeach
                    </div>
                </a>
                @endforeach
            </div>
        </div>
        @endif

        <!-- Filters Section -->
        <div class="card-terminal" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
                
                <div>
                    <span class="filter-label">Cari Saham</span>
                    <div class="input-group">
                        <i data-lucide="search" class="input-icon" size="18"></i>
                        <input wire:model.live.debounce.300ms="search" type="text" placeholder="Ticker / Nama">
                    </div>
                </div>

                <div>
                    <span class="filter-label">Sektor</span>
                    <div class="input-group">
                        <i data-lucide="briefcase" class="input-icon" size="18"></i>
                        <select wire:model.live="sector_id">
                            <option value="">Semua Sektor</option>
                            @foreach($sectors as $sector)
                                <option value="{{ $sector->id }}">{{ $sector->name }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <div>
                    <span class="filter-label">Tren Teknikal</span>
                    <div class="input-group">
                        <i data-lucide="trending-up" class="input-icon" size="18"></i>
                        <select wire:model.live="trend">
                            <option value="">Semua Tren</option>
                            <option value="golden_cross">Golden Cross (SMA 50 > 200)</option>
                            <option value="bullish_macd">MACD Bullish</option>
                        </select>
                    </div>
                </div>

                <div>
                    <span class="filter-label">RSI (Min / Max)</span>
                    <div style="display: flex; gap: 10px;">
                        <div class="input-group" style="flex: 1;">
                            <i data-lucide="bar-chart-2" class="input-icon" size="18"></i>
                            <input wire:model.live.debounce.500ms="min_rsi" type="number" placeholder="Min">
                        </div>
                        <div class="input-group" style="flex: 1;">
                            <i data-lucide="bar-chart-2" class="input-icon" size="18"></i>
                            <input wire:model.live.debounce.500ms="max_rsi" type="number" placeholder="Max">
                        </div>
                    </div>
                </div>

                <div>
                    <span class="filter-label">Maks PER / PBV</span>
                    <div style="display: flex; gap: 10px;">
                        <div class="input-group" style="flex: 1;">
                            <i data-lucide="pie-chart" class="input-icon" size="18"></i>
                            <input wire:model.live.debounce.500ms="max_per" type="number" step="0.1" placeholder="PER">
                        </div>
                        <div class="input-group" style="flex: 1;">
                            <i data-lucide="pie-chart" class="input-icon" size="18"></i>
                            <input wire:model.live.debounce.500ms="max_pbv" type="number" step="0.1" placeholder="PBV">
                        </div>
                    </div>
                </div>

                <div style="display: flex; align-items: flex-end;">
                    <button wire:click="clearFilters" class="btn-ghost" style="width: 100%; height: 42px;">
                        <i data-lucide="rotate-ccw" size="16"></i> Reset Filter
                    </button>
                </div>
            </div>
        </div>

        <!-- Results Table -->
        <div class="card-terminal" style="overflow-x: auto;">
            <table class="premium-table">
                <thead>
                    <tr>
                        <th>Emiten</th>
                        <th>Sektor</th>
                        <th>RSI (14)</th>
                        <th>MACD Hist</th>
                        <th>PER</th>
                        <th>PBV</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($stocks as $stock)
                        <tr class="premium-row">
                            <td>
                                <div class="ticker-highlight">{{ $stock->ticker }}</div>
                                <div class="ticker-name-sub">{{ Str::limit($stock->name, 25) }}</div>
                            </td>
                            <td style="color: var(--text-dim);">
                                {{ $stock->sector ? $stock->sector->name : '-' }}
                            </td>
                            <td>
                                @php $rsi = optional($stock->latestIndicator)->rsi_14; @endphp
                                @if($rsi !== null)
                                    <span class="badge {{ $rsi < 30 ? 'badge-bullish' : ($rsi > 70 ? 'badge-bearish' : 'badge-neutral') }}">
                                        {{ number_format($rsi, 2) }}
                                    </span>
                                @else
                                    -
                                @endif
                            </td>
                            <td>
                                @php $macd = optional($stock->latestIndicator)->macd_histogram; @endphp
                                @if($macd !== null)
                                    <span class="badge {{ $macd > 0 ? 'badge-bullish' : 'badge-bearish' }}">
                                        {{ number_format($macd, 4) }}
                                    </span>
                                @else
                                    -
                                @endif
                            </td>
                            <td class="num-mono">{{ number_format(optional($stock->latestIndicator)->per, 2) }}</td>
                            <td class="num-mono">{{ number_format(optional($stock->latestIndicator)->pbv, 2) }}</td>
                            <td>
                                <a href="/stocks/{{ $stock->ticker }}" class="btn-ghost">
                                    Detail <i data-lucide="arrow-right" size="16"></i>
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" style="padding: 40px; text-align: center; color: var(--text-dim);">
                                <i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                                <br>
                                Tidak ada saham yang cocok dengan kriteria filter Anda.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div style="margin-top: 25px;">
            {{ $stocks->links() }}
        </div>
    </div>
</div>
