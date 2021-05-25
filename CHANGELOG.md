# Changelog
Todos los cambios notables a este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
y este proyecto adhiere a [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.0.0] - 25-05-2021

### Added

- Se añade eventos para detectar cuando se conecta y desconecta del agente.
- Se añade comprobación de version del agente y SDK al conectar.

### Changed

- Se cambia la respuesta para el comando Poll y changeToNormalMode, en caso de ocurrir un problema retorna false.
- Se modifica las peticiones al agente, ahora se le pasa por parámetro el nombre de la petición donde debe responder.

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
