# Changelog
Todos los cambios notables a este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
y este proyecto adhiere a [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [5.0.1] - 21-01-2025

Esta versión es compatible con la versión 1.0.0 del [Agente Web](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-agent2/releases/tag/1.0.0).

### Agrega

- Se agrega compatibilidad para poder usar el SDK con un tag script.

## [5.0.0] - 13-01-2025

### Agrega

- Se agrega compatibilidad con lenguaje Typescript.
- Se agrega un parámetro opcional que permite pasar opciones de configuración al momento de conectar con el agente.
- Se agrega el evento socket_connection_error, este evento se emite cuando se produce  un error al realizar la conexión por sockets con el agente web.
- Se agrega el evento socket_connection_failed, este evento se emite cuando fallan todos los intentos de conexión por sockets con el agente web.

### Actualiza

- Se actualiza la versión mínima de Node necesaria para construir el SDK a mayor o igual a 20.
- Se actualizan las librerías necesarias para construir el SDK.
- Se actualiza el flujo de conexión.

## [4.0.0] - 23-04-2024

Funciona con la versión 4.0.0 del [Agente Web](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-agent/releases)

### Fixed

- Se corrige el método para conectar con el agente, ahora se utiliza correctamente la URL pasada como parámetro al método `connect("socketUrl")`. Anteriormente solo conectaba a la URL por defecto.

### Changed

- La URL a la que se conecta por defecto el método `connect("socketUrl")` ahora es _https://localhost:8090_

## [3.1.1] - 15-09-2021

### Added

- Se añade parámetro para configurar _baudrate_ para el método `autoconnect()` y `openPort()`.

### Changed

- Se elimina la comprobación de versiones.

### Fixed

- Se elimina warning.

## [3.1.0] - 27-05-2021

### Added

- Se puede suscribir los eventos port_opened y port_closed, para detectar cuando se cierra y abre el puerto.
- Se puede suscribir los eventos socket_connected y socket_disconnected, para detectar cuando se conecta y desconecta la conexión al agente.

## [3.0.0] - 25-05-2021

### Added

- Se añade eventos para detectar cuando se conecta y desconecta del agente.
- Se añade comprobación de versión del agente y SDK al conectar.

### Changed

- Se cambia la respuesta para el comando Poll y changeToNormalMode, en caso de ocurrir un problema retorna false.
- Se modifica las peticiones al agente. Ahora se le pasa por parámetro el nombre de la petición donde debe responder.

## [2.2.1] - 2020-12-28
### Fixed
- La carga de llaves se llamaba `getKeys()`. Ahora se creó una nueva función con el nombre que corresponde: `loadKeys()`.


## [2.2.0] - 2020-12-28
### Added
- Se añade funcionalidad de venta multicódigo `doMulticodeSale` [PR #6](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-js/pull/6)

## [2.1.0] - 2020-09-29
### Added
- Add callback to doSale function that is executed when status messages are received

## [2.0.0] - 2020-09-26
### Updated
- Este SDK fue reescrito casi en su totalidad, ya que ahora usa un agente construido en Electron y Node.js, que es más 
simple de instalar y entrega un API de Websockets utilizando socket.io.  

## [1.2.0] - 2020-07-22
### Added
- Add ability to use the library usins a script tag on the html and via unpkg.com


## [1.1.0] - 2020-07-15
### Added
- Add missing functionalities: setNormalMode, closeDay, getDetails, getTotals, refund

## [1.0.0] - 2020-07-13
### Added
- Release inicial
