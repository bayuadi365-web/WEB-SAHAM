<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_id')->constrained()->onDelete('cascade');
            $table->date('date');
            
            // Technical Indicators
            $table->float('sma_20')->nullable();
            $table->float('sma_50')->nullable();
            $table->float('sma_200')->nullable();
            $table->float('ema_20')->nullable();
            $table->float('ema_50')->nullable();
            $table->float('rsi_14')->nullable();
            $table->float('macd_line')->nullable();
            $table->float('macd_signal')->nullable();
            $table->float('macd_histogram')->nullable();
            $table->float('bb_upper')->nullable();
            $table->float('bb_lower')->nullable();
            $table->float('atr_14')->nullable();
            $table->bigInteger('volume_ma_20')->nullable();
            $table->float('stoch_k')->nullable();
            $table->float('stoch_d')->nullable();
            $table->float('obv')->nullable();
            $table->float('adx_14')->nullable();
            
            // Fundamental Metrics
            $table->float('per')->nullable();
            $table->float('pbv')->nullable();
            $table->float('roe')->nullable();
            $table->float('roa')->nullable();
            $table->float('der')->nullable();
            $table->float('npm')->nullable();
            $table->float('current_ratio')->nullable();
            $table->float('dividend_yield')->nullable();
            $table->float('eps_growth_yoy')->nullable();
            $table->bigInteger('operating_cash_flow')->nullable();
            
            $table->timestamps();
            
            // Composite unique index
            $table->unique(['stock_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_indicators');
    }
};
