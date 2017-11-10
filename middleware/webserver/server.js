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

function listen(port) {
    let server = http.Server(app)
    webSocket.init(server)
    return new Promise((resolve, reject) => {
        server.listen(port, err => {
            if (err) reject(err)
            else resolve(port)
        })
    })
}

function getSockets() {
    return webSocket.getSockets()
}

function router() {
    return express.Router()
}

module.exports = server;
