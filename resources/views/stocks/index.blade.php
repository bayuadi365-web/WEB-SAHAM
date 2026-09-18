@extends('layouts.app')

@section('content')
<div style="padding: 20px;">
    <h2 style="color: var(--text-main); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
        <i data-lucide="list" style="color: var(--color-accent);"></i>
        Daftar Semua Saham ({{ $allStocks->total() }} Emiten)
    </h2>
    
    <div class="card-terminal" style="overflow-x: auto;">
        <table class="premium-table">
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Nama Emiten</th>
                    <th>Sektor</th>
                    <th>Sub Sektor</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                @foreach($allStocks as $stock)
                    <tr class="premium-row">
                        <td>
                            <div class="ticker-highlight">{{ $stock->ticker }}</div>
                        </td>
                        <td style="color: var(--text-main); font-weight: 500;">
                            {{ $stock->name }}
                        </td>
                        <td style="color: var(--text-dim);">
                            {{ $stock->sector ? $stock->sector->name : '-' }}
                        </td>
                        <td style="color: var(--text-dim);">
                            {{ $stock->sub_sector ?? '-' }}
                        </td>
                        <td>
                            <a href="/stocks/{{ $stock->ticker }}" class="btn-ghost">
                                Detail <i data-lucide="arrow-right" size="16"></i>
                            </a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    
    <div style="margin-top: 20px;">
        {{ $allStocks->links() }}
    </div>
</div>
@endsection
