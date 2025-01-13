# Transbank SDK Web - Javascript
Este proyecto es parte del SDK Web para POS integrado.
Este SDK, junto con [Este agente ](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-agent) permiten conectar tu software web (punto de venta, etc) al POS.

Este README tiene las instrucciones para la versión 2.0 de este SDK. Para la versión 1.0 revisar los tags de este repositorio. 

## SDK Web POS Integrado
Este SDK Web consta de dos partes: 

[Agente](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-agent): Este agente es un programa que se debe instalar e inicializar en el computador que tendrá el equipo POS conectado físicamente. Al instalar e inicializar este servicio, se creará un servidor de websockets local en el puerto `8090` que permitirá, a través del [SDK de Javascript](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-js), poder enviar y recibir mensajes del equipo POS, de manera simple y transparente. 
[SDK Javascript](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-js) **(este repositorio)**: Este SDK se debe instalar en el software de caja (o cualquier software web que presente HTML, CSS y JS en un navegador web). Este SDK entrega una interfaz simple para conectarse con el cliente, de manera que se puedan mandar instrucciones al POS con un API fácil de usar. 


## Instalación
Para usar este SDK en tu aplicación web, debes instalarlo:
 
### Usando NPM
```
npm install transbank-pos-sdk-web
```

En tu script
```javascript
import POS from 'transbank-pos-sdk-web';

let port = 'COM2'; //Se puede usar POS.getPorts(); para obtener esta info.
POS.connect(ports).then(() => {
    alert('POS conectado');
    
    POS.doSale(1500); //Iniciar venta por $1.500. También devuelve promesa

})
```

### Inscrustando un tag script
Si no usas NPM
```html
<script src="https://unpkg.com/transbank-pos-sdk-web@2/dist/pos.js"></script>
<script>
  Transbank.POS.connect().then(function() {
      console.log('Conectado al cliente')
      // Puedes usar Transbank.POS.getPorts() para obtener lista de puertos activos en el computador
      var portName = 'COM1'; // ó /dev/cu.usbmodem0123456789ABCD1, etc
      Transbank.POS.openPort(portName).then(function(ports) {
          console.log('Puerto conectado correctamente')
          Transbank.POS.doSale(1500, 'ticket1234124').then(function(result) {
              console.log('resultado venta: ', result)
          });
      });
  })
</script>
```
Nota que la URL https://unpkg.com/transbank-pos-sdk-web@3/dist/pos.js cargará la ultima versión 3.x.x disponible. De esa forma te asegurarás de tener las últimas correcciones y nuevas funcionalidades (retrocompatibles) de manera automática.
En caso de que quieras definir manualmente la versión instalada, puedes cambiar el `@3` por algo como `@3.1.0`
En caso de querer la última versión usar la URL https://unpkg.com/transbank-pos-sdk-web/dist/pos.js



## Documentación 

Puedes encontrar toda la documentación de cómo usar este SDK en el sitio https://www.transbankdevelopers.cl.

La documentación relevante para usar este SDK es:

- Documentación general sobre los productos y sus diferencias:
  [POSIntegrado](https://www.transbankdevelopers.cl/producto/posintegrado)
- Primeros pasos con [POSIntegrado](https://www.transbankdevelopers.cl/documentacion/posintegrado).
- Referencia detallada sobre [POSIntegrado](https://www.transbankdevelopers.cl/referencia/posintegrado).


## Información para contribuir y desarrollar este SDK

### Estándares

- Para los commits respetamos las siguientes normas: https://chris.beams.io/posts/git-commit/
- Usamos ingles, para los mensajes de commit.
- Se pueden usar tokens como WIP, en el subject de un commit, separando el token con `:`, por ejemplo:
`WIP: This is a useful commit message`
- Para los nombres de ramas también usamos ingles.
- Se asume, que una rama de feature no mezclada, es un feature no terminado.
- El nombre de las ramas va en minúsculas.
- Las palabras se separan con `-`.
- Las ramas comienzan con alguno de los short lead tokens definidos, por ejemplo: `feat/tokens-configuration`

#### Short lead tokens
##### Commits
- WIP = Trabajo en progreso.
##### Ramas
- feat = Nuevos features
- chore = Tareas, que no son visibles al usuario.
- bug = Resolución de bugs.

### Todas las mezclas a master se hacen mediante Pull Request.

## Generar una nueva versión (con deploy automático a NPM)

Para generar una nueva versión, se debe crear un PR (con un título "Prepare release X.Y.Z" con los valores que correspondan para `X`, `Y` y `Z`). Se debe seguir el estándar semver para determinar si se incrementa el valor de `X` (si hay cambios no retrocompatibles), `Y` (para mejoras retrocompatibles) o `Z` (si sólo hubo correcciones a bugs).

En ese PR deben incluirse los siguientes cambios:

1. Modificar el archivo `CHANGELOG.md` para incluir una nueva entrada (al comienzo) para `X.Y.Z` que explique en español los cambios **de cara al usuario del SDK**.
2. Modificar el archivo package.json y modificar la versión.

Luego de obtener aprobación del pull request, debe mezclarse a master e inmediatamente generar un release en GitHub con el tag `vX.Y.Z`. En la descripción del release debes poner lo mismo que agregaste al changelog.
