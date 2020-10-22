import "@babel/polyfill"
import * as io from "socket.io-client"

export class TransbankPOSWebSocket {
    constructor() {
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

    async connect(socketIoUrl = "http://localhost:8090") {
        this.socket = io("http://localhost:8090")
        this.isConnected = true
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

    send(method, params = "") {
        return new Promise((resolve, reject) => {
            if (!this.isConnected && this.socket!==null) {
                reject("Debe conectarse para poder enviar mensajes: Puede conectarse con POS.connect()")
                return
            }


            let timeout = setTimeout(() => {
                reject("Timeout: We have not received anything from POS on " + (this.timeout / 1000) + " seconds")
            }, this.timeout)
            this.socket.once(method + ".response", (data) => {
                clearTimeout(timeout)
                if (data.success) {
                    resolve(data.response)
                } else {
                    reject(data.message)
                }
            })

            this.socket.emit(method, params)
        })

    }

    async autoconnect() {
        return await this.send("autoconnect")
    }

    async getPorts() {
        return await this.send("listPorts")
    }

    async openPort(portName) {
        if (portName===undefined) {
            throw new Error("Debe indicar el puerto del POS.")
        }
        return await this.send("openPort", {port: portName, baudrate: 115200})
    }

    async closePort() {
        return await this.send("closePort")
    }

    async getKeys() {
        return await this.send("loadKeys")
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

    async getDetails(printOrPos = false) {
        return this.send("salesDetail", {printOrPos})
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
