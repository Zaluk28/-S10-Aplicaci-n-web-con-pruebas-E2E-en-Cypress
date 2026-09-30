# Café Aurora - Cypress E2E Challenge

Aplicación web funcional de pedidos para una cafetería, construida para ser observable, controlable y testeable de extremo a extremo con Cypress + TypeScript.

## Arquitectura

- **Frontend:** HTML/CSS/JavaScript accesible servido por Express.
- **API:** Node.js 20+ con servidor HTTP nativo (sin dependencia de servicios externos).
- **Persistencia:** archivo JSON local (`data/store.json`). Es persistencia real en disco, deliberadamente simple para una evaluación reproducible.
- **E2E:** Cypress con TypeScript.
- **CI:** GitHub Actions.

La aplicación no depende de servicios externos ni requiere secretos.

## Funciones implementadas

- Listado de productos con precio, stock y disponibilidad.
- Carrito con agregar/quitar y modificación de cantidad.
- Total calculado en la interfaz y validado por la API.
- Validación de carrito vacío y cantidades inválidas en API.
- Confirmación de orden con identificador `ORD-...`.
- Persistencia de órdenes y consulta por ID.
- Estado visible de éxito y error.
- Reset reproducible de datos para pruebas.

## Requisitos

- Node.js 20+
- npm
- Navegador compatible con Cypress

## Instalación

```bash
npm install
```

Para conservar un lockfile reproducible antes de entregar, ejecute `npm install` una vez y confirme `package-lock.json` en Git.

## Ejecutar la aplicación

```bash
npm start
```

Abra `http://127.0.0.1:3000`.

## Ejecutar en modo de prueba

Los endpoints de control de datos existen únicamente con `NODE_ENV=test`.

Linux/macOS:

```bash
node app/server.js --test
```

PowerShell:

```powershell
node app/server.js --test
```

## Cypress

Interfaz de Cypress:

```bash
npm run cy:open
```

Ejecución headless:

```bash
npm run ci
```

`baseUrl` está configurado como `http://127.0.0.1:3000` en `cypress.config.ts`.

## Recorridos E2E obligatorios

### E2E-001 - Camino exitoso

1. Reset de datos mediante API antes de la prueba.
2. Agrega Americano y dos Lattes.
3. Comprueba total `Q66.00`.
4. Intercepta `POST /api/orders` con alias `@createOrder`.
5. Comprueba request, status `201` y total de la respuesta.
6. Verifica el ID mostrado en UI.
7. Consulta `GET /api/orders/:id` para demostrar que total y estado quedaron persistidos.

### E2E-002 - Validación

Intenta confirmar un carrito vacío, valida el mensaje visible y demuestra que no se envió `POST /api/orders`.

### E2E-003 - Fallo controlado y recuperación

`cy.intercept()` simula un `503` únicamente en el primer intento de confirmación. La UI:

- muestra un error legible;
- conserva el pedido en curso;
- permite reintentar;
- confirma correctamente en el segundo intento real.

## Estrategia de datos e independencia

`cypress/support/e2e.ts` ejecuta antes de **cada** test:

```text
POST /api/test/reset
```

Ese endpoint copia `data/seed.json` sobre `data/store.json`. Solo se expone con `NODE_ENV=test`, por lo que los tests no dependen de IDs, stock ni órdenes de una ejecución anterior. Esto permite ejecutar los specs en cualquier orden.

## Prevención de flakiness

- No se usan esperas numéricas (`cy.wait(3000)`).
- Se sincroniza con alias de red (`cy.wait('@createOrder')`) y estados visibles.
- Datos reiniciados antes de cada prueba.
- Selectores estables `data-cy` solo donde aportan estabilidad; el resto usa nombres/roles visibles.
- No hay servicios de terceros.
- La recuperación del fallo simulado está controlada por el propio intercept.

## Dependencias reales y simuladas

**Reales durante E2E:** frontend, API Node.js y persistencia JSON local.

**Simulada únicamente en E2E-003:** primera respuesta de `POST /api/orders` con HTTP 503, declarada explícitamente mediante `cy.intercept()` para verificar el estado de error y la recuperación.

## GitHub Actions

Workflow: `.github/workflows/e2e.yml`.

Ejecuta `npm install` y `npm run ci`. Con `if: always()` publica `cypress/screenshots` y `cypress/videos` como artifact, de modo que la evidencia de un fallo no se pierde.

Después de subir el repositorio, use como enlace de evidencia la URL de una ejecución verde de **Actions > Cypress E2E**.

## Cypress vs Playwright vs Agent Browser

- **Cypress:** lo elegiría para esta tarea porque el requisito lo exige y ofrece excelente depuración del DOM/red, intercepts claros y una experiencia muy práctica para recorridos E2E web.
- **Playwright:** lo elegiría cuando necesite validar varios motores de navegador (Chromium, Firefox y WebKit), múltiples pestañas/contextos o escenarios más cercanos a automatización de navegador completa.
- **Agent Browser:** lo elegiría para exploración asistida por un agente o flujos web menos rígidos, especialmente cuando la tarea requiere interpretar una interfaz de forma dinámica. Para una suite de regresión determinista y evaluable, mantendría Cypress/Playwright como fuente principal de verdad.

## Uso responsable de IA

Se utilizó ChatGPT como apoyo para proponer la arquitectura de prueba, revisar selectores, estructurar los recorridos y preparar documentación. Antes de entregar, el estudiante debe ejecutar personalmente la suite, revisar cada aserción y confirmar que puede explicar por qué cada prueba es determinista. No se compartieron secretos ni datos personales reales.

## Evidencia para la entrega

Antes de generar el PDF final:

1. Subir este proyecto a un repositorio público de GitHub.
2. Confirmar una ejecución verde de GitHub Actions.
3. Guardar capturas legibles de E2E-001, E2E-002 y E2E-003 (Cypress Runner o resultados).
4. Guardar/descargar el artifact de CI si desea mostrar video/capturas de fallo.
5. Grabar un video de máximo 3 minutos.
6. Completar en `docs/ENTREGA.md` los enlaces y evidencias.

## Limitación

La persistencia JSON es suficiente para demostrar persistencia y comportamiento E2E, pero no evalúa concurrencia, transacciones ni fallos propios de una base de datos real. Esa limitación debe mencionarse en el video/PDF.
