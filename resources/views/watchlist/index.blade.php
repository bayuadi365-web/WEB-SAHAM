@extends('layouts.app')

@section('content')
<div style="padding: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 10px;">
            <i data-lucide="bookmark" style="color: var(--color-accent);"></i>
            Watchlist Saya
        </h2>
        <span style="background: var(--color-accent-bg); color: var(--color-accent); padding: 4px 12px; border-radius: 12px; font-weight: bold;">
            {{ count($watchlist) }} Emiten Dipantau
        </span>
    </div>
    
    <div class="card-terminal" style="overflow-x: auto;">
        <table class="premium-table">
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Sektor</th>
                    <th>PER</th>
                    <th>PBV</th>
                    <th style="text-align: right;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($watchedStockObjects as $stock)
                    <tr class="premium-row">
                        <td>
                            <div class="ticker-highlight">{{ $stock->ticker }}</div>
                            <div class="ticker-name-sub">{{ Str::limit($stock->name, 25) }}</div>
                        </td>
                        <td style="color: var(--text-main);">
                            {{ $stock->sector ? $stock->sector->name : '-' }}
                        </td>
                        <td class="num-mono" style="color: var(--text-main);">
                            {{ number_format(optional($stock->fundamentals)->per, 2) }}
                        </td>
                        <td class="num-mono" style="color: var(--text-main);">
                            {{ number_format(optional($stock->fundamentals)->pbv, 2) }}
                        </td>
                        <td style="text-align: right;">
                            <a href="/stocks/{{ $stock->ticker }}" class="btn-ghost" style="margin-right: 8px;">
                                Analisis
                            </a>
                            <button @click="toggleWatchlist('{{ $stock->ticker }}')" style="background: rgba(244, 63, 94, 0.1); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3); padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600;">
                                Hapus
                            </button>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="padding: 40px 20px; text-align: center; color: var(--text-dim);">
                            <i data-lucide="bookmark-minus" style="width: 48px; height: 48px; opacity: 0.5; margin-bottom: 15px;"></i>
                            <p style="font-size: 1.1rem; margin: 0; color: var(--text-main);">Belum ada saham dalam watchlist Anda.</p>
                            <p style="font-size: 0.9rem; margin-top: 5px;">Gunakan kolom pencarian untuk menemukan dan menambahkan saham.</p>
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
