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
        Schema::create('stock_fundamentals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_id')->constrained('stocks')->onDelete('cascade');
            
            $table->decimal('pe_ratio', 10, 2)->nullable();
            $table->decimal('pbv_ratio', 10, 2)->nullable();
            $table->decimal('ev_ebitda', 10, 2)->nullable();
            $table->decimal('ps_ratio', 10, 2)->nullable();
            
            $table->decimal('roe', 10, 2)->nullable();
            $table->decimal('roa', 10, 2)->nullable();
            $table->decimal('npm', 10, 2)->nullable();
            $table->decimal('gpm', 10, 2)->nullable();
            $table->decimal('operating_margin', 10, 2)->nullable();
            
            $table->decimal('der', 10, 2)->nullable();
            $table->decimal('current_ratio', 10, 2)->nullable();
            $table->decimal('quick_ratio', 10, 2)->nullable();
            $table->decimal('car', 10, 2)->nullable();
            
            $table->decimal('revenue_growth_yoy', 10, 2)->nullable();
            $table->decimal('net_income_growth_yoy', 10, 2)->nullable();
            $table->decimal('eps_growth', 10, 2)->nullable();
            
            $table->decimal('dividend_yield', 10, 2)->nullable();
            $table->decimal('dividend_payout_ratio', 10, 2)->nullable();
            $table->decimal('dps', 10, 2)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_fundamentals');
    }
};
