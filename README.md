# Papelería "El Rincón Escolar"

Sistema web para la gestión de inventario de la papelería **El Rincón Escolar**.

El proyecto tiene como objetivo desarrollar un MVP que permita consultar y administrar el inventario de productos, controlar el stock mínimo, registrar ventas y detectar productos que necesitan reabastecimiento.

---

## Tabla de contenidos

* [Descripción del proyecto]
* [Objetivo]
* [Tecnologías]
* [Arquitectura]
* [Estructura del proyecto]
* [Historias de usuario]
* [Requisitos previos]
* [Configuración inicial]
* [Configuración del archivo ][`.env`]
* [Ejecutar el proyecto]
* [MongoDB Atlas]
* [Flujo de trabajo con Git y GitHub]
* [Flujo de trabajo con Jira]
* [Reglas para las ramas]
* [Commits]
* [Pull Requests]
* [Subtareas]
* [Reglas importantes]
* [Estado actual del proyecto]
* [Próximas funcionalidades]
* [Problemas comunes]
---

# Descripción del proyecto

**El Rincón Escolar** es una aplicación web orientada a la gestión del inventario de una papelería.

El problema principal que busca resolver el sistema es la falta de visibilidad sobre las existencias de productos.

Actualmente, el negocio necesita:

* Consultar qué productos tiene disponibles.
* Conocer la cantidad actual de cada producto.
* Definir un stock mínimo para cada producto.
* Identificar productos que necesitan reabastecimiento.
* Registrar ventas.
* Actualizar las existencias después de una venta.
* Evitar quedarse sin productos importantes.
* Evitar compras innecesarias de productos que todavía tienen suficiente existencia.

El sistema se desarrollará progresivamente mediante historias de usuario administradas en Jira.

---

# Objetivo

Desarrollar un MVP funcional de gestión de inventario utilizando:

* Node.js
* Express
* MongoDB
* MongoDB Atlas
* Mongoose
* HTML
* CSS
* JavaScript
* Git
* GitHub
* Jira

El proyecto se desarrolla mediante un flujo de trabajo colaborativo basado en ramas, Pull Requests y revisión de código.

---

# Tecnologías

## Backend

* **Node.js** — entorno de ejecución de JavaScript.
* **Express** — framework utilizado para crear el servidor y las API.
* **Mongoose** — ODM utilizado para trabajar con MongoDB.
* **dotenv** — carga las variables de configuración desde `.env`.

## Frontend

Actualmente se utiliza:

* HTML
* CSS
* JavaScript

El frontend consume las rutas proporcionadas por el backend.

## Base de datos

Se utiliza:

**MongoDB Atlas**

La base de datos compartida del proyecto es:

```text
el_rincon_escolar
```

La colección principal utilizada actualmente es:

```text
products
```

---

# Arquitectura

La aplicación sigue una arquitectura sencilla de frontend + backend + base de datos.

```text
                  GitHub
                    │
                    │ código
                    ▼
             ┌───────────────┐
             │   Backend     │
             │ Node + Express│
             └───────┬───────┘
                     │
                  Mongoose
                     │
                     ▼
             ┌───────────────┐
             │ MongoDB Atlas │
             │               │
             │el_rincon_     │
             │escolar        │
             └───────────────┘
                     ▲
                     │
                     │ API
                     │
             ┌───────┴───────┐
             │   Frontend    │
             │ HTML/CSS/JS   │
             └───────────────┘
```

Todos los integrantes utilizan el mismo repositorio de GitHub y se conectan a la misma base de datos de MongoDB Atlas.

---

# Estructura del proyecto

La estructura actual es:

```text
el-rincon-escolar/
│
├── backend/
│   ├── models/
│   │   └── product.js
│   │
│   ├── seed/
│   │   └── products.js
│   │
│   └── server.js
│
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Importante

El archivo:

```text
.env
```

**NO debe subirse a GitHub.**

El archivo:

```text
.env.example
```

sí debe estar en el repositorio.

---

# Historias de usuario

Actualmente el proyecto tiene las siguientes historias principales:

## IN-1 — Consultar inventarios de productos

**Objetivo:**

Permitir al encargado de tienda consultar los productos existentes y conocer su cantidad disponible.

### Criterios de aceptación

* Los productos registrados deben aparecer en la pantalla.
* Cada producto debe mostrar su cantidad disponible.
* La cantidad mostrada debe corresponder con la información almacenada en MongoDB.
* Si no existen productos, debe mostrarse un mensaje indicando que no hay productos registrados.

### Implementación actual

Esta historia ya fue desarrollada.

Incluye:

* Modelo de producto.
* Consulta de productos.
* Endpoint `GET /productos`.
* Vista de inventario.
* Conexión entre frontend y backend.
* Prueba de consulta.

### Subtareas

* IN-6 — Crear modelo de producto.
* IN-7 — Crear consulta de productos.
* IN-8 — Crear endpoint GET de productos.
* IN-9 — Crear vista de inventario.
* IN-10 — Probar consulta de inventario.

---

# IN-5 — Definir stock mínimo por producto

**Objetivo:**

Permitir establecer un nivel mínimo de existencia para cada producto.

El stock mínimo es importante porque **cada producto puede tener una necesidad de reposición diferente**.

Ejemplo:

```text
Cuaderno
Stock actual: 8
Stock mínimo: 10
→ Necesita reabastecimiento
```

Mientras:

```text
Pluma
Stock actual: 30
Stock mínimo: 15
→ Existencia suficiente
```

### Criterios de aceptación

* Cada producto debe poder tener un stock mínimo.
* El stock mínimo debe almacenarse en MongoDB.
* El sistema debe poder consultar el stock mínimo.
* El valor debe ser numérico.
* No debe permitirse un stock mínimo negativo.
* El stock mínimo debe utilizarse posteriormente para determinar cuándo un producto necesita reabastecimiento.

---

# IN-3 — Registrar venta

**Objetivo:**

Permitir registrar una venta y actualizar la existencia del producto vendido.

### Criterios de aceptación

* Debe poder seleccionarse un producto.
* Debe indicarse la cantidad vendida.
* La cantidad vendida debe ser válida.
* No debe permitirse vender una cantidad mayor al stock disponible.
* Al registrar una venta, el stock debe disminuir.
* La actualización debe reflejarse en MongoDB.
* El inventario mostrado debe reflejar el nuevo stock.

Ejemplo:

```text
Antes:

Pluma
Stock: 30

Venta:
Cantidad: 5

Después:

Pluma
Stock: 25
```

---

# IN-4 — Alerta de bajo inventario

**Objetivo:**

Identificar productos cuyo stock actual sea igual o inferior a su stock mínimo.

### Regla principal

```text
stock actual <= stock mínimo
```

Ejemplo:

```text
Stock actual: 4
Stock mínimo: 5

4 <= 5
```

Resultado:

```text
Reabastecer
```

### Criterios de aceptación

* El sistema debe comparar el stock actual con el stock mínimo.
* Debe identificar los productos que requieren reabastecimiento.
* Los productos con stock suficiente no deben marcarse como productos de bajo inventario.
* La alerta debe actualizarse cuando cambie el stock.
* La información debe corresponder con los datos almacenados en MongoDB.

---

# Requisitos previos

Cada integrante debe tener instalado:

* Git
* Node.js
* VS Code

No es necesario instalar MongoDB Community en cada computadora.

La base de datos utilizada por el proyecto está alojada en MongoDB Atlas.

---

# Configuración inicial

## 1. Clonar el repositorio

Desde Terminal, PowerShell o Git Bash:

```bash
git clone https://github.com/RafiuxMax01/el-rincon-escolar.git
```

Entrar al proyecto:

```bash
cd el-rincon-escolar
```

---

## 2. Instalar dependencias

Ejecutar:

```bash
npm install
```

Esto instalará las dependencias definidas en `package.json`.

Entre ellas:

* express
* mongoose
* dotenv

Se generará la carpeta:

```text
node_modules/
```

Esta carpeta es local y **no debe subirse a GitHub**.

---

# Configuración del archivo `.env`

Cada integrante debe crear su propio `.env`.

El archivo `.env` **NO se obtiene de GitHub**, porque contiene información privada de conexión.

El repositorio contiene:

```text
.env.example
```

Este archivo funciona únicamente como plantilla.

---

## Crear `.env`

Después de clonar el repositorio, ejecutar:

```bash
cp .env.example .env
```

En Windows, si el comando anterior no funciona, puede crearse el archivo `.env` manualmente en la raíz del proyecto.

La estructura debe quedar:

```text
el-rincon-escolar/
│
├── .env
├── .env.example
├── package.json
└── ...
```

---

## Contenido del `.env`

El archivo debe contener las variables necesarias para ejecutar el proyecto.

Ejemplo:

```env
MONGODB_URI=mongodb+srv://rincon_app:CONTRASENA_AQUI@rincon-escolar.XXXXX.mongodb.net/el_rincon_escolar
PORT=3000
```

### IMPORTANTE

La contraseña real **NO debe escribirse en este README**.

Tampoco debe:

* Subirse a GitHub.
* Escribirse en un commit.
* Colocarse en el código.
* Compartirse en un Pull Request.
* Colocarse en capturas de pantalla.
* Agregarse a Jira.

### ¿Cómo obtener la contraseña?

Cada integrante debe:

1. Crear su `.env`.
2. Dejar preparada la variable `MONGODB_URI`.
3. Comunicarse directamente con el responsable del proyecto para recibir las credenciales necesarias.
4. Colocar las credenciales únicamente en su archivo `.env` local.

**No solicitar ni publicar la contraseña en GitHub.**

---

# Seguridad del `.env`

El proyecto contiene un `.gitignore` que evita que `.env` sea incluido en los commits.

Antes de hacer un commit, ejecutar:

```bash
git status
```

Verificar que **NO aparezca**:

```text
.env
```

Tampoco debe aparecer:

```text
node_modules/
```

Si alguno de estos elementos aparece en los cambios, **NO hacer commit** hasta corregirlo.

---

# Ejecutar el proyecto

Una vez configurado `.env`:

```bash
npm run dev
```

El servidor debería mostrar:

```text
Conectado a MongoDB
Servidor ejecutándose en http://localhost:3000
```

Abrir en el navegador:

```text
http://localhost:3000
```

---

# Comprobar la API

Para consultar los productos:

```text
http://localhost:3000/productos
```

La API debe devolver los productos almacenados en MongoDB Atlas.

Ejemplo:

```json
[
  {
    "nombre": "Cuaderno profesional",
    "precio": 45,
    "stock": 8,
    "stockMinimo": 10
  }
]
```

---

# MongoDB Atlas

El proyecto utiliza una base de datos compartida en MongoDB Atlas.

Todos los integrantes deben conectarse a la misma base:

```text
el_rincon_escolar
```

Esto permite que el equipo trabaje con los mismos datos.

```text
Rafa ────────┐
Simon ───────┤
Joshua ──────┤
Carlos ──────┼──→ MongoDB Atlas
Ivan ────────┤
Integrante ──┘
```

## No crear bases de datos locales diferentes para el proyecto

No es necesario instalar MongoDB localmente para trabajar en este proyecto.

---

# Seed de datos

Existe un script para crear datos iniciales de prueba:

```bash
npm run seed
```

### ADVERTENCIA

El seed actual elimina los productos existentes antes de insertar los datos iniciales.

Por esta razón:

> **NO ejecutar ****`npm run seed`**** durante el desarrollo normal del equipo.**

Solo debe utilizarse cuando el equipo acuerde explícitamente reinicializar los datos.

Nunca ejecutar el seed sobre datos importantes sin confirmar primero qué información será eliminada.

---

# Flujo de trabajo con Git y GitHub

Este proyecto utiliza ramas para evitar trabajar directamente sobre `main`.

La rama:

```text
main
```

representa el código estable del proyecto.

Los integrantes deben trabajar en ramas específicas de cada historia.

---

# Regla principal de ramas

Las ramas se crean **POR HISTORIA**, no por cada subtarea.

Por ejemplo, para:

```text
IN-5 — Definir stock mínimo por producto
```

se crea:

```bash
feature/IN-5-stock-minimo
```

Dentro de esa rama se realizan las subtareas correspondientes a IN-5.

### Ejemplo

```text
IN-5
│
├── Subtarea A
├── Subtarea B
├── Subtarea C
└── Subtarea D
        │
        ▼
feature/IN-5-stock-minimo
```

No se debe crear una rama diferente para cada subtarea, salvo que el equipo acuerde expresamente lo contrario.

---

# Antes de comenzar una historia

Siempre actualizar `main`:

```bash
git switch main
```

Después:

```bash
git pull origin main
```

Esto garantiza que se está trabajando sobre la versión más reciente del proyecto.

---

# Crear la rama de la historia

Ejemplo para IN-5:

```bash
git switch -c feature/IN-5-stock-minimo
```

Comprobar la rama actual:

```bash
git branch --show-current
```

Debe aparecer:

```text
feature/IN-5-stock-minimo
```

---

# Trabajar en las subtareas

Una vez creada la rama, realizar las subtareas asignadas en Jira.

Ejemplo:

```text
Jira
IN-5
│
├── Subtarea 1 → realizada
├── Subtarea 2 → realizada
├── Subtarea 3 → realizada
└── Subtarea 4 → realizada
```

Todos los cambios relacionados con IN-5 deben permanecer en:

```text
feature/IN-5-stock-minimo
```

---

# Revisar cambios

Antes de hacer commit:

```bash
git status
```

Esto muestra los archivos modificados.

También puede utilizarse:

```bash
git diff
```

para revisar exactamente qué cambió.

---

# Guardar cambios

Agregar los cambios:

```bash
git add .
```

Después revisar:

```bash
git status
```

Confirmar que solamente aparecen archivos relacionados con la tarea.

Especialmente:

```text
NO .env
NO node_modules/
```

---

# Crear un commit

El commit debe incluir el identificador de Jira.

Ejemplo:

```bash
git commit -m "IN-5 Implementar stock mínimo"
```

La idea es que GitHub y Jira puedan relacionar fácilmente el cambio con la historia correspondiente.

---

# Subir la rama

La primera vez:

```bash
git push -u origin feature/IN-5-stock-minimo
```

Después de eso:

```bash
git push
```

---

# Pull Request

Una vez terminada la historia y sus subtareas:

```text
feature/IN-5-stock-minimo
             ↓
          Pull Request
             ↓
            main
```

Crear un Pull Request en GitHub.

El Pull Request debe indicar:

* Historia de Jira.
* Qué se implementó.
* Qué subtareas se completaron.
* Cómo se probó.
* Cualquier consideración importante.
  
**DEBE QUEDAR COMO EL SIGUIENTE EJEMPLO (Este ejemplo pertenece al fin de IN-1)**

**Descripción:**

Se implementó la consulta y visualización del inventario de productos.

**Cambios realizados:**

Se implementó el modelo de productos con Mongoose.
Se agregó el endpoint GET /productos.
Se agregó la interfaz de inventario.
Se conectó el frontend con el backend.
Se agregó el estado de stock mínimo.
Se agregó un seed con productos de prueba.
Se configuró el script npm run seed.

**Criterios de aceptación:**

 Se muestran los productos registrados.
 Se muestra la cantidad disponible de cada producto.
 La cantidad corresponde a los datos almacenados en MongoDB.
 Se muestra un mensaje cuando no existen productos.
 
**Pruebas:**

MongoDB Atlas conectado correctamente.
GET /productos devuelve los productos.
La interfaz muestra correctamente los productos.
Se verificó el estado de stock mínimo.

---

# Revisión de código

El autor de la tarea **no debería aprobar y mezclar su propio código sin revisión**, salvo que el equipo/profesor haya establecido otra regla.

Otro integrante debe revisar:

* Funcionamiento.
* Código.
* Criterios de aceptación.
* Posibles errores.
* Que no existan credenciales expuestas.
* Que no se hayan modificado archivos innecesarios.

Si existen observaciones:

```text
PR
 ↓
Correcciones
 ↓
Commit
 ↓
Push
 ↓
PR actualizado
```

No es necesario crear otro Pull Request.

---

# Merge

Cuando el Pull Request haya sido revisado y aprobado:

```text
feature/IN-X
     ↓
   MERGE
     ↓
   main
```

La historia queda integrada a la rama principal.

---

# Después de un Merge

Antes de comenzar otra historia:

```bash
git switch main
```

Después:

```bash
git pull origin main
```

Y posteriormente crear la nueva rama:

```bash
git switch -c feature/IN-X-nombre
```

### Nunca comenzar una nueva historia desde una versión antigua de `main`.

---

# Flujo de trabajo con Jira

Jira es la fuente de organización del trabajo.

El flujo esperado es:

```text
Jira
 ↓
Historia
 ↓
Subtareas
 ↓
Asignación
 ↓
Rama Git
 ↓
Desarrollo
 ↓
Commit
 ↓
Push
 ↓
Pull Request
 ↓
Revisión
 ↓
Merge
 ↓
Actualizar Jira
 ↓
Cerrar historia
```

---

# Relación entre Jira y GitHub

Siempre utilizar el identificador de Jira.

Ejemplo:

```text
Historia:
IN-5

Rama:
feature/IN-5-stock-minimo

Commit:
IN-5 Implementar stock mínimo

Pull Request:
IN-5 Implementar stock mínimo
```

Esto permite mantener trazabilidad entre:

```text
Requisito
   ↓
Jira
   ↓
Código
   ↓
GitHub
```

---

# Subtareas

Las subtareas representan las diferentes partes necesarias para completar una historia.

Las subtareas se desarrollan dentro de la rama de su historia.

Ejemplo:

```text
IN-1 Consultar inventarios
│
├── IN-6 Crear modelo de producto
├── IN-7 Crear consulta de productos
├── IN-8 Crear endpoint GET de productos
├── IN-9 Crear vista de inventario
└── IN-10 Probar consulta de inventario
```

Todas fueron desarrolladas dentro de:

```text
feature/IN-1-inventario
```

### Regla

No crear una rama para:

```text
IN-6
IN-7
IN-8
IN-9
IN-10
```

La rama corresponde a:

```text
IN-1
```

y dentro de ella se realizan sus subtareas.

---

# Reglas importantes

## 1. No hacer push directamente a `main`

Incorrecto:

```bash
git switch main
git push
```

El trabajo debe entrar mediante Pull Request.

---

## 2. Siempre actualizar `main`

Antes de crear una nueva rama:

```bash
git switch main
git pull origin main
```

---

## 3. Una rama por historia

Ejemplo:

```text
feature/IN-1-inventario
feature/IN-5-stock-minimo
feature/IN-3-registrar-venta
feature/IN-4-alerta-inventario
```

---

## 4. No subir `.env`

Nunca ejecutar un commit que incluya:

```text
.env
```

---

## 5. No subir `node_modules`

No debe aparecer en Git.

Está incluido en `.gitignore`.

---

## 6. No ejecutar el seed sin autorización

El seed actual puede eliminar los productos existentes.

---

## 7. No modificar código de otra historia sin coordinación

Si una modificación afecta directamente otra historia, comunicarlo al responsable correspondiente.

---

## 8. No trabajar directamente sobre `main`

Siempre utilizar una rama.

---

## 9. Revisar `git status`

Antes de cada commit:

```bash
git status
```

---

## 10. Si aparece un conflicto de Git

No borrar archivos ni utilizar comandos destructivos sin saber qué hacen.

Primero comunicar el conflicto al equipo y resolverlo cuidadosamente.

---

# Comandos principales

## Clonar

```bash
git clone https://github.com/RafiuxMax01/el-rincon-escolar.git
```

## Entrar al proyecto

```bash
cd el-rincon-escolar
```

## Instalar dependencias

```bash
npm install
```

## Crear `.env`

```bash
cp .env.example .env
```

## Ejecutar servidor

```bash
npm run dev
```

## Ver estado

```bash
git status
```

## Ver rama

```bash
git branch --show-current
```

## Actualizar main

```bash
git switch main
git pull origin main
```

## Crear rama

```bash
git switch -c feature/IN-X-nombre
```

## Agregar cambios

```bash
git add .
```

## Crear commit

```bash
git commit -m "IN-X Descripción del cambio"
```

## Subir rama

```bash
git push -u origin feature/IN-X-nombre
```

Después del primer push:

```bash
git push
```

---

# Estado actual del proyecto

## IN-1 — Consultar inventarios de productos

**Estado: Completada**

Implementado:

* Modelo de producto.
* Consulta de productos.
* API `GET /productos`.
* Frontend de inventario.
* Conexión con MongoDB Atlas.
* Datos iniciales de prueba.
* Validación de criterios de aceptación.

---

## IN-5 — Definir stock mínimo por producto

**Estado: Pendiente / En desarrollo**

El modelo de producto ya contempla:

```text
stockMinimo
```

La funcionalidad completa deberá desarrollarse según los criterios definidos en Jira.

---

## IN-3 — Registrar venta

**Estado: Pendiente**

Se desarrollará posteriormente.

---

## IN-4 — Alerta de bajo inventario

**Estado: Pendiente**

Se desarrollará posteriormente.

---

# Próximas funcionalidades

El proyecto continuará creciendo después de las historias actuales.

Entre las funcionalidades previstas se encuentra la implementación de un **CRUD de productos**.

## CRUD

CRUD significa:

```text
C — Create
    Crear

R — Read
    Consultar

U — Update
    Actualizar

D — Delete
    Eliminar
```

El sistema deberá progresivamente permitir:

### Crear productos

Ejemplo:

```text
Nombre: Marcador negro
Precio: $15
Stock: 20
Stock mínimo: 5
```

### Consultar productos

Actualmente ya existe:

```http
GET /productos
```

### Actualizar productos

Posteriormente se implementará una ruta para modificar información de productos.

Ejemplo conceptual:

```http
PUT /productos/:id
```

### Eliminar productos

Posteriormente se implementará una ruta para eliminar productos.

Ejemplo conceptual:

```http
DELETE /productos/:id
```

---

# Evolución esperada de la API

La API crecerá progresivamente.

Actualmente:

```http
GET /productos
```

En etapas posteriores se espera implementar operaciones similares a:

```http
GET    /productos
GET    /productos/:id
POST   /productos
PUT    /productos/:id
DELETE /productos/:id
```

También podrán agregarse endpoints relacionados con:

* Ventas.
* Inventario.
* Alertas.
* Stock mínimo.
* Consultas específicas.

Los endpoints definitivos deberán definirse en Jira antes de implementarse.

---

# Evolución esperada del sistema

La aplicación evolucionará aproximadamente de la siguiente manera:

```text
                    MVP
                     │
                     ▼
             Consultar inventario
                     │
                     ▼
              Stock mínimo
                     │
                     ▼
              Registrar ventas
                     │
                     ▼
             Alertas de inventario
                     │
                     ▼
                 CRUD
                     │
                     ▼
          Gestión completa de productos
                     │
                     ▼
            Nuevas funcionalidades
```

La arquitectura puede cambiar conforme aumenten las necesidades del proyecto.

Cualquier cambio importante de arquitectura deberá coordinarse con el equipo antes de implementarse.

---

# Definition of Done

Una historia no debe considerarse terminada solamente porque el código funciona en la computadora del desarrollador.

Para considerar una historia terminada debe cumplirse, según corresponda:

* [ ] Las subtareas están terminadas.
* [ ] Los criterios de aceptación se cumplen.
* [ ] La funcionalidad fue probada.
* [ ] No existen errores conocidos que impidan cumplir la historia.
* [ ] El código está en la rama correspondiente.
* [ ] Se realizó commit.
* [ ] La rama fue subida a GitHub.
* [ ] Se creó Pull Request.
* [ ] El código fue revisado.
* [ ] El Pull Request fue aprobado.
* [ ] El código fue integrado a `main`.
* [ ] Jira fue actualizado.
* [ ] La historia puede marcarse como terminada.

---

# Equipo y organización

El proyecto utiliza Jira para administrar:

* Historias de usuario.
* Subtareas.
* Sprint.
* Asignaciones.
* Criterios de aceptación.
* Seguimiento del trabajo.

GitHub se utiliza para:

* Control de versiones.
* Ramas.
* Commits.
* Pull Requests.
* Revisión de código.
* Integración del código.

MongoDB Atlas se utiliza para:

* Almacenar los datos.
* Compartir la base de datos entre los integrantes.
* Mantener la información del proyecto disponible para el equipo.

---

# Regla general del proyecto

Ante cualquier cambio, seguir esta secuencia:

```text
1. Revisar Jira
       ↓
2. Identificar la historia
       ↓
3. Revisar sus subtareas
       ↓
4. Actualizar main
       ↓
5. Crear rama de la historia
       ↓
6. Programar
       ↓
7. Probar
       ↓
8. git status
       ↓
9. git add
       ↓
10. git commit
       ↓
11. git push
       ↓
12. Pull Request
       ↓
13. Revisión
       ↓
14. Merge
       ↓
15. Actualizar Jira
```

**Si no está relacionado con una historia o tarea de Jira, no debe agregarse código arbitrariamente al proyecto.**

---

# Soporte para nuevos integrantes

Si un integrante acaba de incorporarse al proyecto, debe completar:

```text
[ ] Tener Git instalado
[ ] Tener Node.js instalado
[ ] Tener VS Code instalado
[ ] Clonar el repositorio
[ ] Ejecutar npm install
[ ] Crear .env desde .env.example
[ ] Solicitar las credenciales al responsable
[ ] Ejecutar npm run dev
[ ] Comprobar http://localhost:3000
[ ] Comprobar http://localhost:3000/productos
[ ] Confirmar que puede conectarse a MongoDB Atlas
[ ] Revisar su historia asignada en Jira
[ ] Actualizar main
[ ] Crear su rama
[ ] Comenzar sus subtareas
```

---

# Nota de seguridad

Las credenciales de MongoDB Atlas son información privada.

**Nunca incluir credenciales reales en:**

* README.md
* código fuente
* GitHub
* commits
* Pull Requests
* Jira
* capturas de pantalla
* mensajes públicos

El archivo `.env` debe permanecer exclusivamente en cada computadora local.

El archivo `.env.example` solamente debe contener nombres de variables y valores de ejemplo, nunca credenciales reales.

---

# Licencia

Proyecto académico desarrollado para fines educativos.

**Papelería "El Rincón Escolar"**
