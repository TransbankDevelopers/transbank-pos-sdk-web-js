"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stompjs = require("stompjs");

var _stompjs2 = _interopRequireDefault(_stompjs);

var _sockjsClient = require("sockjs-client");

var _sockjsClient2 = _interopRequireDefault(_sockjsClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransbankPOSWebSocket = function () {
  function TransbankPOSWebSocket() {
    _classCallCheck(this, TransbankPOSWebSocket);

    this.timeToRetry = 250;
    this.timeout = 45000;
    this.channels = ["listPorts", "openPort", "closePort", "doSale", "getKeys", "getLastSale"];
    this.connected = false;
  }

  _createClass(TransbankPOSWebSocket, [{
    key: "connect",
    value: function connect() {
      var socketJsUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "http://localhost:8080/tbk-sdk-java-websocket";

      this.socket = new _sockjsClient2.default(socketJsUrl);
      this.stompClient = _stompjs2.default.over(this.socket);
      this.subscribe();
      this.connected = true;
      this.stompClient.debug = function () {};
    }
  }, {
    key: "subscribe",
    value: function subscribe() {
      var _this = this;

      this.stompClient.connect({}, function (frame) {
        _this.channels.forEach(function (channel) {
          _this.stompClient.subscribe("/topic/" + channel, function (result) {
            var response = JSON.parse(result.body);
            console.log(response);
            _this.response = {
              status: response.success,
              response: response,
              body: result.body
            };
            result.ack();
          }, { ack: "client" });
        });
      });

      return this;
    }
  }, {
    key: "validChannel",
    value: function validChannel(channel) {
      if (this.channels.indexOf(channel) === -1) {
        return false;
      }
      return true;
    }
  }, {
    key: "validParamsInChannel",
    value: function validParamsInChannel(channel) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      var errorMSG = null;
      if (!this.validChannel(channel)) {
        errorMSG = "Canal Invalido";
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
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this.stompClient !== null) {
        this.stompClient.disconnect();
        this.stompClient = null;
      }
      this.isConnected = false;
    }
  }, {
    key: "wait",
    value: function wait(time) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, time);
      });
    }
  }, {
    key: "waitingResponse",
    value: async function waitingResponse(channel) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var dict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.response = null;
      var runtime = 0;
      var timeToRetry = this.timeToRetry;
      var timeout = this.timeout;
      var tx = this.stompClient.begin();
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
      } finally {}
    }
  }, {
    key: "send",
    value: function send(channel) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var dict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!this.connected) {
        throw new Error("Debe conectarse para poder enviar mensajes: Puede conectarse con POS.connect()");
      }
      if (!this.validParamsInChannel(channel, params)) {
        throw new Error("Error: Los parametros no son validos para este canal." + channel);
      }
      params = JSON.stringify(params);
      console.log("JSON PARAMS", params);
      return this.waitingResponse(channel, params = params, dict = dict);
    }
  }, {
    key: "getPorts",
    value: async function getPorts() {
      await this.send("listPorts");
      return this.response.response.ports;
    }
  }, {
    key: "openPort",
    value: async function openPort(portName) {
      if (portName === undefined) {
        throw new Error("Debe indicar el puerto del POS.");
      }
      await this.send("openPort", portName);
      return this.response.status;
    }
  }, {
    key: "closePort",
    value: async function closePort() {
      await this.send("closePort");
      return this.response.status;
    }
  }, {
    key: "getKeys",
    value: async function getKeys() {
      await this.send("getKeys");
      return this.response.body;
    }
  }, {
    key: "getLastSale",
    value: async function getLastSale() {
      await this.send("getLastSale");
      return this.response.body;
    }
  }, {
    key: "doSale",
    value: async function doSale(amount, ticket) {
      var params = { amount: amount, ticket: ticket };
      await this.send("doSale", params);
      return this.response.body;
    }
  }]);

  return TransbankPOSWebSocket;
}();

var POS = exports.POS = new TransbankPOSWebSocket();

// import POS from 'transbank-pos-websocket';