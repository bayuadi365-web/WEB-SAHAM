<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MASBAY ANALYSIS - {{ $title ?? 'Screener' }}</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Vite CSS equivalent -->
    <link rel="stylesheet" href="/css/terminal.css">
    <link rel="stylesheet" href="/css/App.css">
    
    <!-- Alpine.js is automatically injected by Livewire 3 -->
    
    <!-- Lightweight Charts -->
    <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        /* Fix for huge SVG icons when loaded via CDN */
        .lucide {
            width: 18px;
            height: 18px;
            stroke-width: 2;
        }
    </style>
    @livewireStyles
</head>
<body>
    <div class="app-container" x-data="proTraderData()">
        <!-- Navbar Terminal -->
        @include('partials.navbar')
        
        <!-- Top Tabs Navigation -->
        <nav class="app-tabs-nav">
            <button class="tab-btn {{ request()->routeIs('home') ? 'active' : '' }}" onclick="window.location.href='{{ route('home') }}'">
                <i data-lucide="zap"></i>
                <span>Screener Utama</span>
            </button>
            <button class="tab-btn {{ request()->routeIs('scalping') ? 'active' : '' }}" onclick="window.location.href='{{ route('scalping') }}'">
                <i data-lucide="flame"></i>
                <span>Scalping Harian</span>
            </button>
            <button class="tab-btn {{ request()->routeIs('stocks.index') ? 'active' : '' }}" onclick="window.location.href='{{ route('stocks.index') }}'">
                <i data-lucide="list"></i>
                <span>Daftar Semua Saham</span>
            </button>
            <button class="tab-btn {{ request()->routeIs('watchlist') ? 'active' : '' }}" onclick="window.location.href='{{ route('watchlist') }}'">
                <i data-lucide="bookmark"></i>
                <span>Watchlist Saya</span>
            </button>
            <button class="tab-btn {{ request()->routeIs('news.index') ? 'active' : '' }}" onclick="window.location.href='{{ route('news.index') }}'">
                <i data-lucide="newspaper"></i>
                <span>Berita Terupdate</span>
            </button>
        </nav>
        
        <main class="main-layout">
            {{ $slot ?? '' }}
            @yield('content')
        </main>
        
        <!-- Footer -->
        <footer class="app-footer">
            <div class="disclaimer-badge">
                <i data-lucide="alert-triangle"></i>
                <span>DISCLAIMER HUKUM & PASAR FINANSIAL</span>
            </div>
            <p style="max-width: 900px; margin: 0 auto; lineHeight: 1.6;">
                Platform ini dirancang semata-mata sebagai alat bantu riset, pemantauan statistik, dan edukasi analisis saham di Bursa Efek Indonesia (IDX/BEI).
            </p>
        </footer>
    </div>
    
    @livewireScripts
    <script>
        lucide.createIcons();
        
        document.addEventListener('livewire:initialized', () => {
            Livewire.hook('morph.updated', ({ el, component }) => {
                lucide.createIcons();
            });
        });
        
        function proTraderData() {
            return {
                isSearchOpen: false,
                toggleWatchlist(ticker) {
                    fetch('/api/watchlist/toggle', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        },
                        body: JSON.stringify({ ticker: ticker })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            window.location.reload();
                        }
                    });
                }
            }
        }
    </script>
</body>
</html>
