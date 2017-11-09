/**
 * Created by Emonice on 2017/11/9.
 */
const http = require('http')
const app = require('./express')
const express = require('express');
const webSocket = require('./websocket')
const getSession = require('./getSession');

const server = {
    router,
    listen,
    getSession,
    use: app.use.bind(app)
};

