@extends('layouts.app')

@section('content')
<div style="margin-bottom: 20px;">
    <!-- Sub Tabs for Stock Detail -->
    <nav class="app-tabs-nav" style="background: rgba(0,0,0,0.2); border-radius: 8px; margin-bottom: 15px;">
        <button class="tab-btn {{ $tab === 'chart' ? 'active' : '' }}" onclick="window.location.href='/stocks/{{ $ticker }}?tab=chart'">
            <i data-lucide="bar-chart-2"></i>
            <span>Chart & Analisis Teknikal</span>
        </button>
        <button class="tab-btn {{ $tab === 'fundamental' ? 'active' : '' }}" onclick="window.location.href='/stocks/{{ $ticker }}?tab=fundamental'">
            <i data-lucide="file-text"></i>
            <span>Analisis Fundamental</span>
        </button>
        <button class="tab-btn {{ $tab === 'profile' ? 'active' : '' }}" onclick="window.location.href='/stocks/{{ $ticker }}?tab=profile'">
            <i data-lucide="building-2"></i>
            <span>Profil Emiten & Berita</span>
        </button>
    </nav>
    
    @include('partials.stock-hero')
    
    @if($tab === 'chart')
        @include('partials.chart-tab')
    @elseif($tab === 'fundamental')
        @include('partials.fundamental-tab')
    @elseif($tab === 'profile')
        @include('partials.profile-tab')
    @endif
</div>
@endsection
