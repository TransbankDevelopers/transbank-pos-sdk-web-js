import Stomp from "stompjs";
import SockJS from "sockjs-client";

class TransbankPOSWebSocket {
  constructor() {
    this.timeToRetry = 250;
    this.timeout = 45000;
    this.channels = [
      "listPorts",
      "getPortStatus",
      "openPort",
      "closePort",
      "doSale",
      "getKeys",
      "getLastSale",
    ];
    this.isConnected = false;
  }

  connect(socketJsUrl = "http://localhost:8080/tbk-sdk-java-websocket") {
    this.socket = new SockJS(socketJsUrl);
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.debug = () => {};
    return this.subscribe();
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.stompClient.disconnect(() => {
        resolve();
      })
    });
  }

  subscribe() {
    return new Promise((resolve, reject) => {
      this.stompClient.connect({}, (frame) => {
        // Connection callback
        this.isConnected = true;
        this.channels.forEach((channel) => {
          this.stompClient.unsubscribe("/topic/" + channel);
          this.stompClient.subscribe(
                  "/topic/" + channel,
                  (result) => {
                    let response = JSON.parse(result.body);
                    this.response = {
                      status: response.success,
                      response,
                      body: result.body,
                    };
                    result.ack();
                  },
                  { ack: "client" }
          );

          resolve();
        });
      }, (error) => {
        // Error callback
        reject(error)
      });
    });
  }

  validChannel(channel) {
    if (this.channels.indexOf(channel) === -1) {
      return false;
    }
    return true;
  }

  validParamsInChannel(channel, params = "") {
    let errorMSG = null;
    if (!this.validChannel(channel)) {
      errorMSG = "Canal Inválido";
    }
    if (channel === "doSale") {
      if (params["amount"] == undefined || params["ticket"] == undefined) {
        errorMSG = "Debe indicar el monto y el ticket";
      }
    }

    if (errorMSG !== null) {
      throw new Error(errorMSG);
    }
    return true;
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.stompClient = null;
    }
    this.isConnected = false;
  }

  wait(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  async waitingResponse(channel, params = "", dict = {}) {
    this.response = null;
    let runtime = 0;
    let timeToRetry = this.timeToRetry;
    let timeout = this.timeout;
    let tx = this.stompClient.begin();
    try {
      this.stompClient.send("/app/" + channel, { transaction: tx.id }, params);
      while (this.response === null) {
        await this.wait(timeToRetry);
        runtime += timeToRetry;
        if (runtime > timeout) {
          throw new Error("Error: Timeout en respuesta de websocket.");
        }
      }
      tx.commit();
      return this.response;
    } catch (error) {
      tx.abort();
      throw new Error("Error: " + error.message);
    } finally {
    }
  }

  send(channel, params = "", dict = {}) {
    if (!this.isConnected) {
      throw new Error(
        "Debe conectarse para poder enviar mensajes: Puede conectarse con POS.connect()"
      );
    }
    if (!this.validParamsInChannel(channel, params)) {
      throw new Error(
        "Error: Los parametros no son validos para este canal." + channel
      );
    }
    params = JSON.stringify(params);
    return this.waitingResponse(channel, (params = params), (dict = dict));
  }

  async getPorts() {
    await this.send("listPorts");
    return this.response.response.ports;
  }

  async openPort(portName) {
    if (portName === undefined) {
      throw new Error("Debe indicar el puerto del POS.");
    }
    await this.send("openPort", portName);
    return this.response.status;
  }

  async closePort() {
    await this.send("closePort");
    return this.response.status;
  }

  async getKeys() {
    await this.send("getKeys");
    return JSON.parse(this.response.body);
  }

  async getLastSale() {
    await this.send("getLastSale");
    return JSON.parse(this.response.body);
  }

  async getPortStatus() {
    await this.send("getPortStatus");
    return JSON.parse(this.response.body);
  }

  async doSale(amount, ticket) {
    let params = { amount: amount, ticket: ticket };
    await this.send("doSale", params);
    return JSON.parse(this.response.body);
  }
}

export const POS = new TransbankPOSWebSocket();

// import POS from 'transbank-pos-websocket';
