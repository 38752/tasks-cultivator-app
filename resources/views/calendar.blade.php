@extends('adminlte::page')

@section('css')
    <link href="{{ asset('asset/calendar_style.css') }}" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
@stop

@section('title', 'スケジュール')

@section('content_header')
    <h1>スケジュール</h1>
@stop

@section('content')
    <div class="card card-primary">
        <div class="card-body p-0">
            <div id='calendar'></div>
        </div>
    </div>
@stop
