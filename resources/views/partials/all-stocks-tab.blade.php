<div class="card-terminal">
    <div class="card-header">
        <div class="card-title">
            <i data-lucide="list" color="var(--color-accent)"></i>
            <span>Daftar Seluruh Emiten Terdaftar (Total: {{ $allStocks->total() }} Saham)</span>
        </div>
        <div class="header-actions">
            <!-- Paginator summary -->
            <span style="font-size: 0.85rem; color: var(--text-muted); margin-right: 12px;">
                Menampilkan {{ $allStocks->firstItem() }} - {{ $allStocks->lastItem() }}
            </span>
        </div>
    </div>

    @if($allStocks->isEmpty())
        <div style="text-align: center; padding: 60px 20px; color: var(--text-dim);">
            <i data-lucide="database" size="48" style="opacity: 0.3; margin-bottom: 12px;"></i>
            <h3>Belum ada data saham</h3>
        </div>
    @else
        <div class="table-responsive">
            <table class="terminal-table">
                <thead>
                    <tr>
                        <th width="40">No</th>
                        <th>Ticker</th>
                        <th>Nama Perusahaan</th>
                        <th>Sektor</th>
                        <th style="text-align: right;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($allStocks as $index => $stock)
                        <tr style="cursor: pointer;" onclick="window.location.href='/?ticker={{ $stock->ticker }}&tab=chart'">
                            <td class="num-mono" style="color: var(--text-dim);">
                                {{ $allStocks->firstItem() + $index }}
                            </td>
                            <td>
                                <strong style="font-family: var(--font-mono); color: #fff; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">{{ $stock->ticker }}</strong>
                            </td>
                            <td style="color: var(--text-muted);">
                                {{ $stock->name === $stock->ticker ? 'Perusahaan ' . $stock->ticker : $stock->name }}
                            </td>
                            <td>
                                @if($stock->sector)
                                    <span style="background: rgba(14, 165, 233, 0.1); color: var(--color-accent); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">
                                        {{ $stock->sector->name }}
                                    </span>
                                @elseif($stock->sub_sector)
                                    <span style="background: rgba(14, 165, 233, 0.1); color: var(--color-accent); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">
                                        {{ $stock->sub_sector }}
                                    </span>
                                @else
                                    <span style="color: var(--text-dim);">-</span>
                                @endif
                            </td>
                            <td style="text-align: right;">
                                <a href="/?ticker={{ $stock->ticker }}&tab=chart" style="color: var(--color-accent); text-decoration: none; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border: 1px solid rgba(14,165,233,0.3); border-radius: 4px; transition: all 0.2s;" onmouseover="this.style.background='rgba(14,165,233,0.1)'" onmouseout="this.style.background='transparent'">
                                    <span>Lihat Chart</span>
                                    <i data-lucide="chevron-right" size="14"></i>
                                </a>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        
        <!-- Custom Simple Pagination -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.2);">
            <div>
                @if ($allStocks->onFirstPage())
                    <button disabled style="padding: 6px 12px; background: rgba(255,255,255,0.05); color: var(--text-dim); border: 1px solid var(--border-color); border-radius: 4px; cursor: not-allowed; display: inline-flex; align-items: center; gap: 4px;">
                        <i data-lucide="chevron-left" size="14"></i> Prev
                    </button>
                @else
                    <a href="{{ $allStocks->appends(['ticker' => request('ticker'), 'tab' => 'all-stocks'])->previousPageUrl() }}" style="padding: 6px 12px; background: var(--bg-card); color: #fff; border: 1px solid var(--border-color); border-radius: 4px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'" onmouseout="this.style.borderColor='var(--border-color)'">
                        <i data-lucide="chevron-left" size="14"></i> Prev
                    </a>
                @endif
            </div>
            
            <div class="pagination-pages" style="display: flex; gap: 4px;">
                <!-- Just show current / last page to keep it simple -->
                <span style="font-family: var(--font-mono); font-size: 0.9rem; padding: 6px 12px; background: rgba(14,165,233,0.1); color: var(--color-accent); border: 1px solid var(--color-accent); border-radius: 4px;">
                    Halaman {{ $allStocks->currentPage() }} dari {{ $allStocks->lastPage() }}
                </span>
            </div>
            
            <div>
                @if ($allStocks->hasMorePages())
                    <a href="{{ $allStocks->appends(['ticker' => request('ticker'), 'tab' => 'all-stocks'])->nextPageUrl() }}" style="padding: 6px 12px; background: var(--bg-card); color: #fff; border: 1px solid var(--border-color); border-radius: 4px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'" onmouseout="this.style.borderColor='var(--border-color)'">
                        Next <i data-lucide="chevron-right" size="14"></i>
                    </a>
                @else
                    <button disabled style="padding: 6px 12px; background: rgba(255,255,255,0.05); color: var(--text-dim); border: 1px solid var(--border-color); border-radius: 4px; cursor: not-allowed; display: inline-flex; align-items: center; gap: 4px;">
                        Next <i data-lucide="chevron-right" size="14"></i>
                    </button>
                @endif
            </div>
        </div>
    @endif
</div>
