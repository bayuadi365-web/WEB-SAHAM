<div class="card-terminal">
    <div class="card-header">
        <div class="card-title">
            <i data-lucide="bookmark" color="var(--color-accent)"></i>
            <span>Daftar Pantau Saham Pribadi ({{ count($watchedStockObjects) }} Saham Tersimpan)</span>
        </div>
        <button class="btn-watchlist-toggle" @click="isSearchOpen = true">
            <i data-lucide="search" size="14"></i>
            <span>Tambah Saham Baru</span>
        </button>
    </div>

    @if(count($watchedStockObjects) === 0)
        <div style="text-align: center; padding: 60px 20px; color: var(--text-dim);">
            <i data-lucide="bookmark" size="48" style="opacity: 0.3; margin-bottom: 12px;"></i>
            <h3>Belum ada saham di Watchlist</h3>
            <p style="font-size: 0.85rem; margin-top: 6px;">
                Gunakan tombol pencarian (Ctrl+K) atau klik bintang di emiten untuk menambahkannya ke sini.
            </p>
        </div>
    @else
        <div class="table-responsive">
            <table class="terminal-table">
                <thead>
                    <tr>
                        <th>Aksi</th>
                        <th>Ticker</th>
                        <th>Nama Perusahaan</th>
                        <th>Harga Terakhir</th>
                        <th>Perubahan (%)</th>
                        <th>PER (TTM)</th>
                        <th>PBV</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($watchedStockObjects as $stock)
                        @php $isStockUp = $stock->change >= 0; @endphp
                        <tr style="cursor: pointer;" onclick="window.location.href='/?ticker={{ $stock->ticker }}&tab=chart'">
                            <td onclick="event.stopPropagation()">
                                <button @click="toggleWatchlist('{{ $stock->ticker }}')" style="background: none; border: none; cursor: pointer; color: var(--color-amber); padding: 4px;" title="Hapus dari watchlist">
                                    <i data-lucide="star" fill="var(--color-amber)"></i>
                                </button>
                            </td>
                            <td>
                                <strong style="font-family: var(--font-mono); color: #fff;">{{ $stock->ticker }}</strong>
                            </td>
                            <td style="color: var(--text-muted);">{{ $stock->name }}</td>
                            <td class="num-mono" style="font-weight: 700;">Rp {{ number_format($stock->price, 0, ',', '.') }}</td>
                            <td>
                                <span class="num-mono {{ $isStockUp ? 'bullish-text' : 'bearish-text' }}" style="font-weight: 700;">
                                    {{ $isStockUp ? '+' : '' }}{{ $stock->change_percent }}%
                                </span>
                            </td>
                            <td class="num-mono">{{ $stock->fundamentals->pe_ratio ?? '-' }}x</td>
                            <td class="num-mono">{{ $stock->fundamentals->pbv_ratio ?? '-' }}x</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>
