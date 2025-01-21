# Transbank SDK Web - Javascript
Este proyecto es parte del SDK Web para POS integrado.
Este SDK, junto con [Este agente ](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-agent2) permiten conectar tu software web (punto de venta, etc) al POS.

## SDK Web POS Integrado
Este SDK Web consta de dos partes: 

[Agente](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-agent2): Este agente es un programa que se debe instalar e inicializar en el computador que tendrá el equipo POS conectado físicamente. Al instalar e inicializar este servicio, se creará un servidor de websockets local en el puerto `8090` que permitirá, a través del [SDK de Javascript](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-js), poder enviar y recibir mensajes del equipo POS, de manera simple y transparente. 
[SDK Javascript](https://github.com/TransbankDevelopers/transbank-pos-sdk-web-js) **(este repositorio)**: Este SDK se debe instalar en el software de caja (o cualquier software web que presente HTML, CSS y JS en un navegador web). Este SDK entrega una interfaz simple para conectarse con el cliente, de manera que se puedan mandar instrucciones al POS con un API fácil de usar. 

## Requisitos
- Node.js 20+
- NPM

## Instalación
Para instalar este SDK en tu proyecto, solo debes incluirlo usando npm/yarn.
 
### Instalación con NPM
```bash
npm install transbank-pos-sdk-web
```

### ¿Cómo se usa?
El siguiente ejemplo permite realizar una venta por $1500.

```javascript
import POS from 'transbank-pos-sdk-web';

let port = 'COM2'; //Se puede usar POS.getPorts(); para obtener esta info.
POS.connect(ports).then(() => {
    alert('POS conectado');
    
    POS.doSale(1500); //Iniciar venta por $1.500. También devuelve promesa

})
```

### Incrustando un tag script
Si no usas NPM
```html
<script src="https://unpkg.com/transbank-pos-sdk-web@5/dist/pos.js"></script>
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
Nota que la URL https://unpkg.com/transbank-pos-sdk-web@5/dist/pos.js cargará la ultima versión 5.x.x disponible. De esa forma te asegurarás de tener las últimas correcciones y nuevas funcionalidades (retrocompatibles) de manera automática.
En caso de que quieras definir manualmente la versión instalada, puedes cambiar el `@5` por algo como `@5.0.0`
En caso de querer la última versión usar la URL https://unpkg.com/transbank-pos-sdk-web/dist/pos.js

## Documentación 

Puedes encontrar toda la documentación de cómo usar este SDK en el sitio https://www.transbankdevelopers.cl.

La documentación relevante para usar este SDK es:

- Documentación general sobre los productos y sus diferencias:
  [POSIntegrado](https://www.transbankdevelopers.cl/producto/posintegrado)
- Primeros pasos con [POSIntegrado](https://www.transbankdevelopers.cl/documentacion/posintegrado).
- Referencia detallada sobre [POSIntegrado](https://www.transbankdevelopers.cl/referencia/posintegrado).


## Información para contribuir

### **Estándares generales**

- Para los commits, seguimos las normas detalladas en [este enlace](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits) 👀
- Usamos inglés para los nombres de ramas y mensajes de commit 💬
- Todas las fusiones a la rama principal se realizan a través de solicitudes de Pull Request(PR) ⬇️
- Puedes emplear tokens como "WIP" en el encabezado de un commit, separados por dos puntos (:), por ejemplo: "WIP: este es un mensaje de commit útil ✅"
- Las ramas de nuevas funcionalidades que no han sido fusionada, se asume que no está finalizada⚠️
- Los nombres de las ramas deben estar en minúsculas y las palabras deben separarse con guiones (-) 🔤
- Los nombres de las ramas deben comenzar con uno de los tokens abreviados definidos. Por ejemplo: feat/tokens-configurations 🌿

### **Short lead tokens**

`WIP` = En progreso.

`feat` = Nuevos features.

`fix` = Corrección de un bug.

`docs` = Cambios solo de documentación.

`style` = Cambios que no afectan el significado del código. (espaciado, formateo de código, comillas faltantes, etc)

`refactor` = Un cambio en el código que no arregla un bug ni agrega una funcionalidad.

`perf` = Cambio que mejora el rendimiento.

`test` = Agregar test faltantes o los corrige.

`chore` = Cambios en el build o herramientas auxiliares y librerías.

`revert` = Revierte un commit.

`release` = Para liberar una nueva versión.

#### Flujo de trabajo

1. Crea tu rama desde develop.
2. Haz un push de los commits y publica la nueva rama.
3. Abre un Pull Request apuntando tus cambios a develop.
4. Espera a la revisión de los demás integrantes del equipo.
5. Mezcla los cambios sólo cuando esté aprobado por mínimo 2 revisores.

### Esquema de flujo

![gitflow](https://wac-cdn.atlassian.com/dam/jcr:cc0b526e-adb7-4d45-874e-9bcea9898b4a/04%20Hotfix%20branches.svg?cdnVersion=1324)

### **Reglas** 📖

1. Todo PR debe incluir test.
2. Todo PR debe cumplir con un mínimo de 80% de coverage para ser aprobado
3. El PR debe tener 2 o más aprobaciones para poder mezclarse.
4. Si un commit revierte un commit anterior deberá comenzar con "revert:" seguido del mensaje del commit anterior.

### **Pull Request**

- Usar un lenguaje imperativo y en tiempo presente: "change" no "changed" ni "changes".
- El título del los PR y mensajes de commit no pueden comenzar con una letra mayúscula.
- No se debe usar punto final en los títulos o descripción de los commits.
- El título del PR debe comenzar con el short lead token definido para la rama, seguido de : y una breve descripción del cambio.
- La descripción del PR debe detallar los cambios.
- La descripción del PR debe incluir evidencias de que los test se ejecutan de forma correcta.
- Se pueden usar gif o videos para complementar la descripción o evidenciar el funcionamiento del PR.

## Generar una nueva versión (con deploy automático a NPM)

Para generar una nueva versión, se debe crear un PR (con un título "Prepare release X.Y.Z" con los valores que correspondan para `X`, `Y` y `Z`). Se debe seguir el estándar semver para determinar si se incrementa el valor de `X` (si hay cambios no retrocompatibles), `Y` (para mejoras retrocompatibles) o `Z` (si sólo hubo correcciones a bugs).

En ese PR deben incluirse los siguientes cambios:

1. Modificar el archivo `CHANGELOG.md` para incluir una nueva entrada (al comienzo) para `X.Y.Z` que explique en español los cambios **de cara al usuario del SDK**.
2. Modificar el archivo package.json y modificar la versión.

Luego de obtener aprobación del pull request, debe mezclarse a master e inmediatamente generar un release en GitHub con el tag `X.Y.Z`. En la descripción del release debes poner lo mismo que agregaste al changelog.
