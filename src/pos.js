import "core-js/stable";
import "regenerator-runtime/runtime";
import {version} from '../package.json';

const axios = require('axios').default;

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

        this.socket.on("connect", () => {
            this.isConnected = true;
            this.checkAgentVersion();
            this.checkSDKVersion();
        });

        this.socket.on("disconnect", (reason) => {
            this.isConnected = false;
        });

        return true;
    }

    async checkAgentVersion() {

        const url = 'https://api.github.com/repos/TransbankDevelopers/transbank-pos-sdk-web-agent/releases/latest';
        let tagData;

        axios.get(url).then(response => {
            tagData = {
                name: response.data.name,
                tagVersion : response.data.tag_name
            }

            this.socket.once('getVersion.response', (data) => {
                let agentVersion = parseInt(data.replace('.', ''));
                let serverVersion = parseInt(tagData.tagVersion.replace('.', ''));
    
                if(agentVersion < serverVersion) {
                    console.warn(`The version of the Web Agent is not the latest, the latest version is: ${tagData.tagVersion}. Download the latest version from https://github.com/TransbankDevelopers/transbank-pos-sdk-web-agent`);
                }
    
            });
    
            this.socket.emit('getVersion');

        }).catch(error => {
            console.log(error);
            return;
        });
    }

    async checkSDKVersion() {

        const url = 'https://api.github.com/repos/TransbankDevelopers/transbank-pos-sdk-web-js/releases/latest';
        let tagData;

        axios.get(url).then(response => {
            tagData = {
                name: response.data.name,
                tagVersion : response.data.tag_name
            }

            let sdkVersion = parseInt(version.replace('.', ''));
            let serverVersion = parseInt(tagData.tagVersion.replace('.', ''));
    
            if(sdkVersion < serverVersion) {
                console.warn(`The version of the SDK web is not the latest, the latest version is: ${tagData.tagVersion}. Download the latest version from https://github.com/TransbankDevelopers/transbank-pos-sdk-web-js`);
            }

        }).catch(error => {
            console.log(error);
            return;
        });
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

    async autoconnect() {
        return await this.send("autoconnect")
    }
    
    async poll() {
        return await this.send("poll")
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
