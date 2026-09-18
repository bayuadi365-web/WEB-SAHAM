<div>
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Daily Scalping</h1>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Temukan setup saham terbaik untuk scalping harian dengan metode teknikal teruji.
            </p>
        </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div class="flex flex-wrap gap-2">
                <button wire:click="setStrategy('volume_breakout')" 
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors 
                        {{ $strategy === 'volume_breakout' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600' }}">
                    🔥 Volume Breakout + MACD
                </button>
                <button wire:click="setStrategy('oversold_bounce')" 
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors 
                        {{ $strategy === 'oversold_bounce' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600' }}">
                    📉 Oversold Bounce (RSI + Stoch)
                </button>
            </div>
            
            <div class="flex items-center space-x-3">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" wire:model.live="useFundamentalFilter" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                    <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        🛡️ Fundamental Safety (Anti-Gorengan)
                    </span>
                </label>
            </div>
        </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Saham</th>
                        <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                        <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Volume</th>
                        <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">RSI 14</th>
                        <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">MACD</th>
                        <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700 relative" wire:loading.class="opacity-50 pointer-events-none">
                    @forelse ($stocks as $stock)
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div>
                                        <div class="text-sm font-bold text-gray-900 dark:text-white">{{ $stock->ticker }}</div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ Str::limit($stock->name, 20) }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">
                                    Rp {{ number_format($stock->price, 0, ',', '.') }}
                                </div>
                                <div class="text-xs font-medium {{ $stock->change_percent >= 0 ? 'text-green-500' : 'text-red-500' }}">
                                    {{ $stock->change_percent > 0 ? '+' : '' }}{{ number_format($stock->change_percent, 2) }}%
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right">
                                <div class="text-sm text-gray-900 dark:text-white">{{ number_format($stock->volume / 10000, 0, ',', '.') }}K</div>
                                @if($stock->latestIndicator && $stock->volume > $stock->latestIndicator->volume_ma_20)
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-1">
                                        Vol Spike
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right">
                                @if($stock->latestIndicator)
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                        {{ $stock->latestIndicator->rsi_14 < 30 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                          ($stock->latestIndicator->rsi_14 > 70 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300') }}">
                                        {{ number_format($stock->latestIndicator->rsi_14, 1) }}
                                    </span>
                                @else
                                    <span class="text-gray-400">-</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right">
                                @if($stock->latestIndicator)
                                    <span class="text-sm font-medium {{ $stock->latestIndicator->macd_line > 0 ? 'text-green-500' : 'text-red-500' }}">
                                        {{ number_format($stock->latestIndicator->macd_line, 2) }}
                                    </span>
                                @else
                                    <span class="text-gray-400">-</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <a href="{{ route('stocks.show', $stock->ticker) }}" class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">Tidak ada saham yang memenuhi kriteria setup ini.</p>
                                    <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Coba sesuaikan filter atau pilih strategi lain.</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        @if($stocks->hasPages())
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {{ $stocks->links() }}
        </div>
        @endif
    </div>
    
    <!-- Loading overlay -->
    <div wire:loading class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl flex items-center space-x-3">
            <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm font-medium text-gray-900 dark:text-white">Mencari setup terbaik...</span>
        </div>
    </div>
</div>
