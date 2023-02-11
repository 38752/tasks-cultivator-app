@extends('adminlte::page')

@section('css')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="{{ asset('asset/task_style.css') }}" rel="stylesheet">
@stop

@section('title', 'プロジェクト')

@section('content_header')
    <h1>{{ $user->name }}さんのプロジェクト</h1>
@stop

@section('content')
    {{-- 完了メッセージ --}}
    @if (session('message'))
        <div class="alert alert-info alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
                ×
            </button>
            {{ session('message') }}
        </div>
    @endif

    {{-- 一覧表示 --}}
    <div class="container">
        {{-- ▼一列 --}}
        <div class="col-4 tasks-column" data-depth="{{ $depth }}">
            {{-- ▼タスク一列 --}}
            <div class="column-only-tasks" data-depth="{{ $depth }}">
                @foreach ($tasks as $task)
                    <div class="col-md task-unit" data-depth="{{ $depth }}" data-task-id="{{ $task->id }}">
                        <div class="card card-outline card-success collapsed-card" data-depth="{{ $depth }}" data-task-id="{{ $task->id }}">
                            <div class="card-header">
                                <h3 class="card-title">
                                    <span class="task-title-container" data-task-id="{{ $task->id }}">{{ $task->title }}</span>
                                </h3>
                                <div class="card-tools">
                                    <button type="button" class="btn btn-tool task-btn-tool" data-card-widget="collapse" data-task-id="{{ $task->id }}"><i class="fas fa-plus" data-task-id="{{ $task->id }}"></i>
                                    </button>
                                </div>
                            </div>
                            {{-- ▼隠れてるタスク --}}
                            <div class="card-body existing-task-body" style="display: none;" data-task-id="{{ $task->id }}">
                                <div class="item-group">
                                    <span class="item-name">詳細</span>
                                    <span class="task-detail-container" data-task-id="{{ $task->id }}">{{ $task->detail }}</span>
                                </div>
                                <div class="item-group">
                                    <span class="item-name">期限</span>
                                    <span class="task-start_date-container" data-task-id="{{ $task->id }}">
                                        @if (!($task->start_date === null))
                                            {{ date('Y年m月d日', strtotime($task->start_date)) }}
                                        @else
                                            {{ "なし" }}
                                            {{-- $task->start_date = '' --}}
                                        @endif
                                    </span>
                                </div>
                                <div class="row">
                                    <div class="ml-auto">
                                        <button type="button" class="btn btn-secondary btn-sm btn-task btn-edit" data-task-id="{{ $task->id }}"
                                            >編集</button>
                                        <form action="/tasks/{{ $task->id }}" method="post" class="delete-form">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-info btn-sm btn-task btn-delete" data-task-id="{{ $task->id }}"
                                                >完了・削除</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {{-- ▲隠れてるタスク --}}
                            {{-- ▼編集フォーム --}}
                            <div class="card-body" style="display: none;" data-task-id="{{ $task->id }}">
                                <form action="/tasks/{{ $task->id }}" method="post" class="edit-form" data-task-id="{{ $task->id }}">
                                @csrf
                                @method('PATCH')
                                    {{-- タイトル入力 --}}
                                    <div class="form-group">
                                        <label for="title">タイトル</label>
                                        <input type="text" class="form-control" id="title" name="title" value="{{ old('title', $task->title) }}"
                                            placeholder="タスク名" />
                                    </div>
                                    {{-- 詳細入力(テキスト) --}}
                                    <div class="form-group">
                                        <label for="detail">詳細</label>
                                        <textarea name="detail" id="detail" cols="30" rows="1.5"
                                            placeholder="詳細" class="form-control form-text-area">{{ $task->detail }}</textarea>
                                    </div>
                                    {{-- 期限入力 --}}
                                    <div class="form-group">
                                        <label for="start_date">期限</label>
                                        <input type="date" class="form-control" id="start_date" name="start_date"
                                            value="{{ (isset($task->start_date)) ? date('Y-m-d', strtotime($task->start_date)) : ''; }}"
                                             />
                                    </div>
                                    <div class="row">
                                        <div class="ml-auto">
                                            <button type="submit" class="btn btn-primary btn-task btn-update" data-task-id="{{ $task->id }}">更新</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            {{-- ▲編集フォーム --}}
                        </div>
                    </div>
                @endforeach
            </div>

            {{-- ▲タスク一列 --}}

            {{-- ▼新規作成 --}}
            <div class="col-md new-form-area" data-depth="{{ $depth }}">
                <div class="card card-outline card-primary collapsed-card" data-depth="{{ $depth }}">
                    <div class="card-header">
                        <h3 class="card-title">新規登録</h3>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    {{-- ▼隠れてるフォーム --}}
                    <div class="card-body" style="display: none;">
                        <form action="{{ route('tasks.store') }}" method="post">
                            @csrf
                                {{-- タイトル入力 --}}
                                <div class="form-group">
                                    <label for="title">タイトル</label>
                                    <input type="text" class="form-control" id="title" name="title"
                                        placeholder="タスク名" />
                                </div>
                                {{-- 詳細入力(テキスト) --}}
                                <div class="form-group">
                                    <label for="detail">詳細</label>
                                    <textarea name="detail" id="detail" cols="30" rows="1.5"
                                        placeholder="詳細" class="form-control form-text-area"></textarea>
                                </div>
                                {{-- 期限入力 --}}
                                <div class="form-group">
                                    <label for="start_date">期限</label>
                                    <input type="date" class="form-control" id="start_date" name="start_date"
                                     />
                                </div>
                                <div class="row">
                                    <div class="ml-auto">
                                        <button type="submit" class="btn btn-primary btn-task btn-store">登録</button>
                                    </div>
                                </div>
                        </form>
                    </div>
                    {{-- ▲隠れてるフォーム --}}
                </div>
            </div>
            {{-- ▲新規作成 --}}
        </div>
        {{-- ▲一列 --}}
    </div>
@stop
