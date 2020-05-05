<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1">
        <meta name="mobile-web-app-capable" content="yes">
        <title> Web RTC Demo</title>
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css?v='.$version) }}">
    </head>
    <body>
        
        @yield('main')
        
        <script type="text/javascript" src="{{ asset('js/app.js?v='.$version) }}"></script>
    </body>
</html>