# Papelería "El Rincón Escolar"

Sistema web para la gestión de inventario de la papelería **El Rincón Escolar**.

El proyecto tiene como objetivo desarrollar un **MVP (Producto Mínimo Viable)** que permita al encargado consultar y mantener actualizado el inventario, registrar ventas que descuenten automáticamente las existencias y detectar productos que necesitan reabastecimiento mediante alertas visuales.

---

## Tabla de contenidos

* [Descripción del proyecto](#descripción-del-proyecto)
* [Objetivo](#objetivo)
* [Tecnologías](#tecnologías)
* [Arquitectura](#arquitectura)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Historias de Usuario](#historias-de-usuario)
* [Requisitos previos](#requisitos-previos)
* [Configuración inicial](#configuración-inicial)
* [Configuración del archivo `.env`](#configuración-del-archivo-env)
* [Ejecutar el proyecto](#ejecutar-el-proyecto)
* [Flujo de trabajo](#flujo-de-trabajo-git-github-y-jira)
* [Estado actual del proyecto](#estado-actual-del-proyecto)

---

## Descripción del proyecto

### El problema principal

> "Se nos acaba el producto sin darnos cuenta, y a veces compramos de más de algo que ya teníamos harto. Queremos saber qué tenemos y cuánto, para no quedarnos sin lo que más se vende."

Actualmente, la papelería carece de visibilidad sobre sus existencias. Para solucionar este problema, el sistema proporciona las siguientes funcionalidades:

* **Visibilidad de inventario:** conocer qué productos hay disponibles y qué cantidad existe de cada uno.
* **Control automático:** descontar inmediatamente las existencias al registrar una venta.
* **Alertas de reabastecimiento:** mostrar avisos cuando un producto alcanza su nivel de stock mínimo.
* **Stock mínimo personalizado:** establecer un nivel mínimo diferente para cada producto.
* **Historial de métricas:** mantener un registro de productos vendidos para facilitar el análisis de ventas.

---

## Objetivo

Desarrollar un **MVP funcional de gestión de inventario** utilizando un stack basado en JavaScript y un flujo de trabajo colaborativo profesional mediante:

* Git
* GitHub
* Jira
* Ramas por historia de usuario
* Pull Requests
* Code Review

---

## Tecnologías

### Backend

| Tecnología   | Función                                            |
| ------------ | -------------------------------------------------- |
| **Node.js**  | Entorno de ejecución para JavaScript               |
| **Express**  | Framework utilizado para el servidor y la API REST |
| **Mongoose** | ODM para trabajar con MongoDB                      |
| **dotenv**   | Gestión de variables de entorno                    |

### Frontend

| Tecnología             | Función                                |
| ---------------------- | -------------------------------------- |
| **HTML5**              | Estructura de la interfaz              |
| **CSS3**               | Diseño y estilos visuales              |
| **JavaScript Vanilla** | Lógica del cliente y consumo de la API |

La interfaz está diseñada para ser adaptable y facilitar el uso diario del sistema.

### Base de datos

**MongoDB Atlas**

Base de datos NoSQL alojada en la nube.

Colección principal:

```text
products
```

---

## Arquitectura

La aplicación utiliza una arquitectura cliente-servidor directa:

```text
                  ┌─────────────────────┐
                  │       Backend       │
                  │    Node + Express   │
                  └──────────┬──────────┘
                             │
                         Mongoose
                             │
                             ▼
                  ┌─────────────────────┐
                  │    MongoDB Atlas    │
                  │      Database       │
                  └──────────┬──────────┘
                             ▲
                             │
                          API REST
                             │
                  ┌──────────┴──────────┐
                  │      Frontend       │
                  │    HTML / CSS / JS  │
                  └─────────────────────┘
```

Todos los integrantes del equipo se conectan a la misma base de datos remota para garantizar la consistencia de la información durante el desarrollo.

---

## Estructura del proyecto

```text
el-rincon-escolar/
│
├── backend/
│   ├── models/
│   │   └── product.js       # Esquemas de Mongoose
│   │
│   ├── seed/                # Scripts para poblar la DB
│   │
│   └── server.js            # Servidor principal de Express
│
├── frontend/
│   ├── app.js               # Lógica del cliente y consumo de API
│   ├── index.html           # Estructura de la interfaz
│   └── style.css            # Estilos visuales
│
├── .env                     # Variables de entorno (NO SUBIR)
├── .env.example             # Plantilla de variables de entorno
├── .gitignore               # Archivos excluidos de Git
└── package.json             # Dependencias y scripts de Node
```

---

## Historias de Usuario

El desarrollo se gestionó mediante un backlog basado en historias de usuario dentro de Jira.

| ID        | Historia                                                                                                                                        |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **IN-1**  | Como encargado de tienda, quiero ver la lista de productos con su cantidad disponible, para saber qué hay en existencia.                        |
| **IN-5**  | Definir un stock mínimo distinto por producto para saber cuándo pedir más.                                                                      |
| **IN-3**  | Como encargado de tienda, quiero registrar una venta y que descuente del inventario automáticamente, para mantener el conteo actualizado.       |
| **IN-4**  | Como encargado de tienda, quiero ver una alerta cuando un producto esté por agotarse (stock actual <= stock mínimo), para reabastecer a tiempo. |
| **IN-28** | Mejorar interfaz de la papelería para facilitar el uso diario.                                                                                  |
| **IN-29** | Historial y contador de productos vendidos para análisis de ventas.                                                                             |

---

## Requisitos previos

Para ejecutar el proyecto es necesario contar con:

* Git
* Node.js
* Un editor de código, por ejemplo VS Code

> No es necesario instalar MongoDB localmente, ya que el proyecto utiliza **MongoDB Atlas**.

---

## Configuración inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/RafiuxMax01/el-rincon-escolar.git
cd el-rincon-escolar
```

### 2. Instalar las dependencias

```bash
npm install
```

Esto instalará las dependencias definidas en `package.json` y generará la carpeta:

```text
node_modules/
```

Esta carpeta se encuentra excluida de Git mediante `.gitignore`.

---

## Configuración del archivo `.env`

> **Importante:** el archivo `.env` nunca debe subirse a GitHub.

Crea el archivo `.env` utilizando la plantilla incluida en el proyecto:

```bash
cp .env.example .env
```

Después, edita el archivo `.env` y agrega la URL de conexión a MongoDB Atlas.

Ejemplo:

```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/el_rincon_escolar
PORT=3000
```

Las credenciales de acceso a la base de datos deben solicitarse al administrador del proyecto.

**No compartas contraseñas mediante Slack, Jira ni capturas de pantalla.**

---

## Ejecutar el proyecto

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Una vez iniciado el servidor, accede desde el navegador a:

```text
http://localhost:3000
```

---

## Flujo de trabajo: Git, GitHub y Jira

El proyecto utiliza un esquema de trabajo basado en **ramas por historia de usuario** y **Pull Requests obligatorios**.

### 1. Actualizar `main`

Antes de comenzar una nueva historia:

```bash
git switch main
git pull origin main
```

### 2. Crear una rama para la historia de Jira

La nomenclatura de la rama debe incluir el identificador de Jira.

Ejemplo:

```bash
git switch -c feature/IN-5-stock-minimo
```

### 3. Desarrollar la funcionalidad

Realizar cambios únicamente relacionados con la historia de usuario correspondiente.

Se recomienda trabajar mediante commits atómicos y descriptivos.

Ejemplo:

```bash
git add .
git commit -m "IN-5: Se agregó el campo stockMinimo al modelo de Mongoose"
```

### 4. Subir la rama a GitHub

```bash
git push -u origin feature/IN-5-stock-minimo
```

### 5. Crear el Pull Request

Una vez terminada la historia:

```text
feature/IN-5-stock-minimo
          |
          v
      Pull Request
          |
          v
    Code Review
          |
          v
       Aprobación
          |
          v
       main
```

El Pull Request debe ser revisado y aprobado por un compañero antes de realizar el merge a `main`.

### Regla principal

**No trabajar directamente sobre `main`.**

Cada funcionalidad debe desarrollarse en su propia rama y posteriormente integrarse mediante Pull Request.

---

## Estado actual del proyecto

El MVP cuenta actualmente con las siguientes funcionalidades implementadas.

### Sprint 1 — Completado

| Historia | Funcionalidad                                                   | Estado     |
| -------- | --------------------------------------------------------------- | ---------- |
| **IN-1** | Consulta de inventario de productos                             | Completado |
| **IN-5** | Definición de stock mínimo por producto                         | Completado |
| **IN-3** | Registro de ventas con descuento automático en la base de datos | Completado |
| **IN-4** | Alerta visual de bajo inventario                                | Completado |

### Sprint 2 — Completado

| Historia  | Funcionalidad                                      | Estado     |
| --------- | -------------------------------------------------- | ---------- |
| **IN-28** | Mejora integral de la interfaz de usuario          | Completado |
| **IN-29** | Historial y contador general de productos vendidos | Completado |

---

## MVP actual

El sistema permite actualmente:

1. Consultar los productos disponibles.
2. Visualizar las cantidades existentes.
3. Definir un stock mínimo individual para cada producto.
4. Registrar ventas.
5. Descontar automáticamente las unidades vendidas del inventario.
6. Detectar productos cuyo stock actual sea menor o igual al stock mínimo.
7. Mostrar alertas visuales de bajo inventario.
8. Consultar el historial de productos vendidos.
9. Visualizar un contador general de productos vendidos.
10. Utilizar una interfaz mejorada para facilitar las operaciones diarias.

---

## Flujo general del sistema

```text
                    Usuario
                       │
                       ▼
              ┌─────────────────┐
              │    Frontend     │
              │   HTML/CSS/JS   │
              └────────┬────────┘
                       │
                    API REST
                       │
                       ▼
              ┌─────────────────┐
              │     Express     │
              │     + Node      │
              └────────┬────────┘
                       │
                    Mongoose
                       │
                       ▼
              ┌─────────────────┐
              │  MongoDB Atlas  │
              │    products     │
              └─────────────────┘
```

El flujo permite que las operaciones realizadas desde la interfaz sean procesadas por el backend y posteriormente almacenadas o consultadas en MongoDB Atlas.

---

## Control de versiones

El proyecto utiliza Git y GitHub como herramientas principales para el control de versiones y colaboración.

El flujo establecido es:

```text
Jira
  │
  ▼
Historia de Usuario
  │
  ▼
Feature Branch
  │
  ▼
Desarrollo
  │
  ▼
Commit
  │
  ▼
Push
  │
  ▼
Pull Request
  │
  ▼
Code Review
  │
  ▼
Merge
  │
  ▼
main
```

---

## Proyecto

**Papelería "El Rincón Escolar"**

Sistema web para la gestión de inventario, ventas y reabastecimiento de productos.
