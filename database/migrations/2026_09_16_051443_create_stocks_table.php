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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->string('ticker')->unique();
            $table->string('symbol')->unique();
            $table->string('name');
            $table->foreignId('sector_id')->nullable()->constrained('sectors')->onDelete('set null');
            $table->string('sub_sector')->nullable();
            
            $table->decimal('price', 15, 2)->default(0);
            $table->decimal('change', 15, 2)->default(0);
            $table->decimal('change_percent', 8, 2)->default(0);
            
            $table->decimal('previous_close', 15, 2)->default(0);
            $table->decimal('open', 15, 2)->default(0);
            $table->decimal('day_high', 15, 2)->default(0);
            $table->decimal('day_low', 15, 2)->default(0);
            
            $table->bigInteger('volume')->default(0);
            $table->decimal('turnover', 20, 2)->default(0);
            
            $table->decimal('market_cap', 20, 2)->default(0);
            $table->bigInteger('shares_outstanding')->default(0);
            
            $table->decimal('fifty_two_week_high', 15, 2)->nullable();
            $table->decimal('fifty_two_week_low', 15, 2)->nullable();
            
            $table->text('description')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
