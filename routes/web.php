<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TasksController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// BASIC認証
Route::group(['middleware' => 'basicauth'], function() {
    // ログインしている場合のルーティング
    Route::group(['middleware' => ['auth']], function() {
        Route::get('/', function () {
            return redirect('/calendar');
        });

        Route::get('/dashboard', function () {
            return redirect('/calendar');
        })->middleware(['auth', 'verified'])->name('dashboard');

        Route::middleware('auth')->group(function () {
            Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
            Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
            Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        });

        Route::get('/calendar', function () {
            return view('calendar');
        });

        Route::resource('/tasks', TasksController::class, ['only' => ['index', 'store', 'update', 'destroy']]);
        Route::get('/tasks/search', [TasksController::class, 'searchTasks'])->name('search-tasks');

        Route::post('/tasks-get', [TasksController::class, 'getTasks'])->name('tasks-get');
    });

    require __DIR__.'/auth.php';
});
