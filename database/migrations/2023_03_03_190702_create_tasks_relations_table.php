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
        Schema::create('tasks_relations', function (Blueprint $table) {
            $table->id();
            $table->integer('parent_task_id')->nullable(false)->comment('親のタスクid');
            $table->integer('child_task_id')->nullable(false)->comment('子のタスクid');
            $table->integer('depth')->nullable(false)->comment('階層');
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
        Schema::dropIfExists('tasks_relations');
    }
};
