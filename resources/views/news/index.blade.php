@extends('layouts.app')

@section('content')
<!-- Auto-refresh the page every 60 seconds to ensure fresh news -->
<meta http-equiv="refresh" content="60">

<div style="padding: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
        <h2 style="color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 10px;">
            <i data-lucide="radio" style="color: var(--color-accent);"></i>
            Radar Berita Pasar (Real-Time)
        </h2>
        <span style="background: var(--bg-secondary); color: var(--text-muted); padding: 6px 12px; border-radius: 6px; font-size: 0.9rem; border: 1px solid var(--border-subtle);">
            Menampilkan {{ count($news) }} Berita Terbaru
        </span>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">
        @forelse($news as $item)
            <div class="card-terminal" style="display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)';">
                
                <div style="padding: 15px 20px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; color: var(--text-main); border: 1px solid var(--border-medium);">
                            {{ $item['source'] }}
                        </span>
                        <span style="color: var(--text-muted); font-size: 0.8rem;">
                            {{ $item['pubDate'] }}
                        </span>
                    </div>
                    
                    @if($item['sentiment'] === 'positive')
                        <span class="badge-bullish">
                            <i data-lucide="trending-up" size="14"></i> Bullish
                        </span>
                    @elseif($item['sentiment'] === 'negative')
                        <span class="badge-bearish">
                            <i data-lucide="trending-down" size="14"></i> Bearish
                        </span>
                    @else
                        <span style="background: var(--bg-secondary); color: var(--text-muted); border: 1px solid var(--border-medium); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; display: flex; align-items: center; gap: 4px;">
                            <i data-lucide="minus" size="14"></i> Netral
                        </span>
                    @endif
                </div>
                
                <div style="padding: 20px; flex: 1;">
                    <a href="{{ $item['link'] }}" target="_blank" style="color: var(--text-main); text-decoration: none; font-size: 1.1rem; font-weight: 700; line-height: 1.5; display: block; margin-bottom: 12px; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)';" onmouseout="this.style.color='var(--text-main)';">
                        {{ $item['title'] }}
                    </a>
                    
                    <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        {{ $item['description'] }}
                    </p>
                    
                    @if(!empty($item['tickers']))
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            @foreach($item['tickers'] as $ticker)
                                <a href="/stocks/{{ $ticker }}" style="background: rgba(41, 98, 255, 0.1); border: 1px solid rgba(41, 98, 255, 0.2); color: #2962FF; padding: 4px 10px; border-radius: 12px; text-decoration: none; font-size: 0.8rem; font-weight: bold; transition: all 0.2s;" onmouseover="this.style.background='rgba(41, 98, 255, 0.2)';" onmouseout="this.style.background='rgba(41, 98, 255, 0.1)';">
                                    {{ $ticker }}
                                </a>
                            @endforeach
                        </div>
                    @endif
                </div>
                
                <div style="padding: 12px 20px; background: var(--bg-secondary); border-top: 1px solid var(--border-subtle);">
                    <a href="{{ $item['link'] }}" target="_blank" style="color: var(--color-accent); text-decoration: none; font-size: 0.85rem; font-weight: bold; display: flex; align-items: center; gap: 6px;">
                        Baca Selengkapnya <i data-lucide="external-link" size="14"></i>
                    </a>
                </div>
            </div>
        @empty
            <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px dashed var(--border-medium);">
                <i data-lucide="newspaper" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 15px;"></i>
                <h3 style="color: var(--text-main); margin-bottom: 10px;">Belum Ada Berita Terbaru</h3>
                <p style="color: var(--text-dim);">Silakan periksa kembali beberapa saat lagi. Kami sedang menarik berita terbaru dari sumber media.</p>
            </div>
        @endforelse
    </div>
</div>
@endsection
