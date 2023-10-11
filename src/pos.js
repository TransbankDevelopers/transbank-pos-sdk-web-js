const EventEmitter = require('events');

import "core-js/stable";
import "regenerator-runtime/runtime";

import * as io from "socket.io-client"

export class TransbankPOSWebSocket extends EventEmitter {
    constructor() {
        super()
        this.isConnected = false
        this.debugEnabled = true
        this.timeout = 120000
    }

    debug(...args) {
        if (this.debugEnabled) {
            console.log(...args)
        }
    }

    socket() {
        return this.socket;
    }

    async connect(socketIoUrl = "https://localhost:8090") {
        this.socket = io(socketIoUrl)
        this.isConnected = true

        this.socket.on("connect", () => {
            this.isConnected = true;
            this.emit('socket_connected');
        });

        this.socket.on("disconnect", (reason) => {
            this.isConnected = false;
            this.emit('socket_disconnected');
        });

        this.socket.on('event.port_opened', (port) => {
            this.emit('port_opened', port);
        })

        this.socket.on('event.port_closed', () => {
            this.emit('port_closed');
        }) 

        return true;
    }

    async disconnect() {
        if (this.socket!==null) {
            this.socket.close()
            this.socket = null
        }
        this.isConnected = false
        return true;
    }

    send(method, params = {}) {
        return new Promise((resolve, reject) => {
            let ts = Date.now();
            let eventName = method + ".response" + ts;

            if (!this.isConnected && this.socket!==null) {
                reject("Debe conectarse para poder enviar mensajes: Puede conectarse con POS.connect()")
                return
            }

            params.eventName = eventName;

            let timeout = setTimeout(() => {
                reject("Timeout: We have not received anything from POS on " + (this.timeout / 1000) + " seconds")
            }, this.timeout)

            this.socket.once(eventName, (data) => {
                clearTimeout(timeout)
                if (data.success) {
                    resolve(data.response)
                } else {
                    if(method === "poll" || method === "changeToNormalMode")
                        resolve(false)
                        
                    reject(data.message)
                }
            })

            this.socket.emit(method, params)
        })

    }

    async autoconnect(baudrate = 115200) {
        return await this.send("autoconnect", {baudrate})
    }
    
    async poll() {
        return await this.send("poll")
    }

    async getPorts() {
        return await this.send("listPorts")
    }

    async openPort(portName, baudrate = 115200) {
        if (portName===undefined) {
            throw new Error("Debe indicar el puerto del POS.")
        }
        return await this.send("openPort", {port: portName, baudrate})
    }

    async closePort() {
        return await this.send("closePort")
    }

    async loadKeys() {
        return await this.send("loadKeys")
    }

    async getKeys() { // Alias
        return this.loadKeys();
    }

    async getLastSale() {
        return await this.send("getLastSale")
    }

    async getTotals() {
        return await this.send("getTotals")
    }

    async refund(operationId) {
        if (operationId===undefined) {
            throw new Error("Debe indicar el ID de operación")
        }
        return await this.send("refund", {operationId})
    }

    async getDetails(printOnPos = false) {
        return this.send("salesDetail", {printOnPos})
    }

    async closeDay() {
        return await this.send("closeDay")
    }

    async setNormalMode() {
        return await this.send("changeToNormalMode")
    }

    async getPortStatus() {
        return await this.send("getPortStatus")
    }

    async doSale(amount, ticket, callback = null) {
        let params = { amount: amount, ticket: ticket }
        if (typeof callback === 'function') {
            this.socket.on('sale_status.response', callback)
        }
        let response = await this.send("sale", params)
        this.socket.off('sale_status.response', callback)
        return response;
    }
    async doMulticodeSale(amount, ticket, commerceCode = '0', callback = null) {
        let params = { amount: amount, ticket: ticket, commerceCode: commerceCode }
        if (typeof callback === 'function') {
            this.socket.on('multicode_sale_status.response', callback)
        }
        let response = await this.send("multicodeSale", params)
        this.socket.off('multicode_sale_status.response', callback)
        return response;
    }
}

export const POS = new TransbankPOSWebSocket()
export default POS
