/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
'use strict';

require('./bootstrap');

import adapter from 'webrtc-adapter';

import $ from 'jquery';
window.$ = window.jQuery = $;

/**
 * import socket io client
 */
const socket = require('socket.io-client')('http://localhost:9090');

/**
 * Events
 */
socket.on('connect', () => {
    console.log('connected');
});
socket.on('disconnect', () => {
    console.log('disconnected');
});