<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->nullable(false)->comment('ユーザーid');
            $table->string('title')->nullable(false)->comment('タスク名');
            $table->string('detail')->comment('タスク内容')->nullable(false)->default('');
            $table->date('start_date')->comment('期限')->nullable();
            $table->date('end_date')->comment('FullCalendar用')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
};
