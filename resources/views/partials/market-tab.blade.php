<div class="card-terminal">
    <div class="card-header">
        <div class="card-title">
            <i data-lucide="trending-up" color="var(--color-accent)"></i>
            <span>Ringkasan Pasar (Market Dashboard)</span>
        </div>
    </div>
    <div style="padding: 20px; text-align: center; color: var(--text-dim);">
        <p>Dashboard pasar sedang dalam pengembangan untuk versi Laravel.</p>
        <p>IHSG saat ini: <strong>{{ number_format($ihsgData['price'] ?? 0, 0, ',', '.') }}</strong></p>
    </div>
</div>
