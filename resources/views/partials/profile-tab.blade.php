<div class="card-terminal">
    <div class="card-header">
        <div class="card-title">
            <i data-lucide="building-2" color="var(--color-accent)"></i>
            <span>Profil Emiten - {{ $currentStock->ticker }}</span>
        </div>
    </div>
    <div style="padding: 20px;">
        <h2 style="color: #fff; margin-bottom: 10px;">{{ $currentStock->name }}</h2>
        <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
            {{ $currentStock->description ?? 'Deskripsi perusahaan belum tersedia di database kami.' }}
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <strong style="color: var(--text-dim); display: block; margin-bottom: 5px;">Sektor</strong>
                <span style="color: #fff;">{{ $currentStock->sector->name ?? '-' }}</span>
            </div>
            <div>
                <strong style="color: var(--text-dim); display: block; margin-bottom: 5px;">Sub Sektor</strong>
                <span style="color: #fff;">{{ $currentStock->sub_sector ?? '-' }}</span>
            </div>
            <div>
                <strong style="color: var(--text-dim); display: block; margin-bottom: 5px;">Shares Outstanding</strong>
                <span style="color: #fff;" class="num-mono">{{ number_format($currentStock->shares_outstanding, 0, ',', '.') }}</span>
            </div>
        </div>
    </div>
</div>
