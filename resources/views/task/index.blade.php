@extends('adminlte::page')

@section('css')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="{{ asset('asset/task_style.css') }}" rel="stylesheet">
@stop

@section('meta_tags')
    <meta name="page-category" content="individual-projects">
    {{-- ↑今後プロジェクト共有機能を追加する可能性も踏まえて --}}
    @foreach ($selected_task_relations as $selected_task_relation)
        <meta name="selected-task-route" content="{{ $selected_task_relation->parent_task_id }}">
    @endforeach
@stop

@section('title', 'プロジェクト')

@section('content_header')
    <h1>{{ $user->name }}さんのプロジェクト</h1>
@stop

@section('content')
    {{-- 一覧表示 --}}
    <div class="container tasks-all-container" id="tasks-all-container">
        {{-- JavaScript --}}
    </div>
    {{-- 一覧表示 --}}
@stop
