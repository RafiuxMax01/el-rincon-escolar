# Papelería "El Rincón Escolar"

Sistema web para la gestión de inventario de la papelería **El Rincón Escolar**.

El proyecto tiene como objetivo desarrollar un MVP que permita consultar y administrar el inventario de productos, controlar el stock mínimo, registrar ventas y detectar productos que necesitan reabastecimiento.

---

## Tabla de contenidos

* [Descripción del proyecto](#descripción-del-proyecto)
* [Objetivo](#objetivo)
* [Tecnologías](#tecnologías)
* [Arquitectura](#arquitectura)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Sprints e Historias de Usuario](#sprints-e-historias-de-usuario)
* [Definition of Done (DoD) y Sprint Review](#definition-of-done-dod-y-sprint-review)
* [Requisitos previos](#requisitos-previos)
* [Configuración inicial](#configuración-inicial)
* [Flujo de trabajo con Git y GitHub](#flujo-de-trabajo-con-git-y-github)
* [Flujo de trabajo con Jira](#flujo-de-trabajo-con-jira)
* [Reglas importantes](#reglas-importantes)
* [Próximas funcionalidades](#próximas-funcionalidades)

---

## Descripción del proyecto

**El Rincón Escolar** es una aplicación web orientada a la gestión del inventario de una papelería. El problema principal que busca resolver el sistema es la falta de visibilidad sobre las existencias, definido por el cliente de la siguiente manera:

> *"Se nos acaba el producto sin darnos cuenta, y a veces compramos de más de algo que ya teníamos harto. Queremos saber qué tenemos y cuánto, para no quedarnos sin lo que más se vende."*

Actualmente, el negocio necesita:

* Consultar qué productos tiene disponibles y su cantidad actual.
* Registrar una venta y que descuente del inventario automáticamente.
* Ver una alerta cuando un producto esté por agotarse para reabastecer a tiempo.
* Definir un stock mínimo (distinto por producto) para detonar las alertas.

El sistema se desarrolla progresivamente mediante historias de usuario administradas en Jira.

---

## Objetivo

Desarrollar un MVP funcional de gestión de inventario utilizando un stack basado en **Node.js, Express, MongoDB Atlas (Mongoose) y HTML/CSS/JS** puro para el frontend. El proyecto se desarrolla bajo un marco ágil con Sprints, empleando un flujo colaborativo basado en ramas, Pull Requests y revisión de código constante.

---

## Tecnologías

* **Backend:** Node.js, Express, Mongoose, dotenv.
* **Frontend:** HTML, CSS, JavaScript (Consumo de API REST).
* **Base de datos:** MongoDB Atlas (Colección principal: `products` en la base `el_rincon_escolar`).
* **Gestión y Control de Versiones:** Git, GitHub, Jira.

---

## Arquitectura

La aplicación sigue una arquitectura sencilla de frontend + backend + base de datos. Todos los desarrolladores se conectan a un clúster centralizado en MongoDB Atlas, eliminando la necesidad de bases de datos locales.

```text
                  GitHub (Control de versiones)
                    │
             ┌──────▼────────┐
             │   Backend     │
             │ Node + Express│
             └───────┬───────┘
                     │ Mongoose
             ┌───────▼───────┐
             │ MongoDB Atlas │ (el_rincon_escolar)
             └───────┬───────┘
                     │ API REST
             ┌───────▼───────┐
             │   Frontend    │
             │ HTML/CSS/JS   │
             └───────────────┘
```

## Estructura del proyecto

Plaintext

```text
el-rincon-escolar/
│
├── backend/
│   ├── models/product.js
│   ├── seed/products.js
│   └── server.js
│
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── .env           <-- (NO SE SUBE A GITHUB)
├── .env.example   <-- (PLANTILLA, SÍ SE SUBE)
├── .gitignore
├── package.json
└── README.md
```

## Sprints e Historias de Usuario

El trabajo está dividido en Sprints estructurados en Jira. A continuación se detalla el progreso actual del backlog:

### IN Sprint 1 (1 sep - 9 sep)

**Objetivo del Sprint:** Desarrollar un MVP para la papelería "El Rincón Escolar" que permita al encargado consultar y mantener actualizado el inventario, registrar ventas que descuenten automáticamente las existencias.

* **[IN-1] Consultar inventarios de productos:** Como encargado de tienda, quiero ver la lista de productos con su cantidad disponible. **(Estado: Listo)**.

* **[IN-5] Definir stock mínimo por producto:** Permitir establecer un nivel mínimo de existencia individual. **(Estado: Listo)**.

* **[IN-3] Registrar venta:** Registrar una venta y descontar el inventario automáticamente. **(Estado: Listo)**.

* **[IN-4] Alerta de bajo inventario:** Identificar productos cuyo stock actual sea igual o inferior a su stock mínimo. **(Estado: Listo)**.

### IN Sprint 2 (11 sep - 21 sep)

**Objetivo del Sprint:** Del MVP que ya se tenía en el Sprint 1, se continuará la creación del mismo, a través de nuevas historias de usuario, las cuales entran como mejorar la interfaz del usuario, al igual un orden.

* **[IN-28] Mejorar interfaz de la papelería:** Refinamiento visual y de experiencia de usuario del MVP. **(Estado: Listo)**.

* **[IN-29] Historial y contador de productos vendidos:** Creación de un registro para visualizar métricas de ventas. **(Estado: Listo)**.

## Definition of Done (DoD) y Sprint Review

Para asegurar la calidad del incremento entregado en cada iteración, nos regimos por estándares estrictos antes de considerar una historia como "Lista" y antes de presentarla en el Sprint Review.

### Definition of Done (DoD)

Ninguna historia o tarea pasa a la columna de **Listo** en Jira sin cumplir el 100% de los siguientes criterios:

* [ ] Las subtareas asignadas están terminadas.
* [ ] Los Criterios de Aceptación (definidos en la historia) se cumplen en su totalidad.
* [ ] El código está en su rama correspondiente (`feature/IN-X-nombre`).
* [ ] El código fue subido a GitHub y se creó un Pull Request (PR).
* [ ] El código pasó por **Revisión de Código (Code Review)** por al menos un compañero de equipo.
* [ ] No existen credenciales o datos sensibles (`.env`) en el repositorio.
* [ ] El PR fue aprobado y el Merge hacia `main` se completó sin conflictos.
* [ ] Se actualizó el estado en Jira.

### Sprint Review

Al finalizar cada Sprint, el equipo se reúne para la **Sprint Review**. En esta ceremonia:

1. **Demostración:** Se muestra el incremento de software funcionando (el MVP en acción) al Product Owner / Interesados.
2. **Validación:** Se comprueba que cada funcionalidad resuelve el problema planteado inicialmente (ej. visualizar alertas de stock, descontar ventas en tiempo real).
3. **Feedback:** Se recopilan comentarios para integrarlos al backlog del siguiente Sprint (como ocurrió en la transición del Sprint 1 al Sprint 2 con las mejoras de interfaz).

## Configuración inicial

### 1. Clonar el repositorio e instalar dependencias

Bash

```bash
git clone https://github.com/RafiuxMax01/el-rincon-escolar.git
cd el-rincon-escolar
npm install
```

### 2. Configurar Variables de Entorno (`.env`)

El archivo `.env` **NO se obtiene de GitHub**, ya que contiene credenciales privadas.

Bash

```bash
cp .env.example .env
```

Abre el archivo `.env` generado e introduce la cadena de conexión proporcionada por el responsable del proyecto:

Fragmento de código

```text
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/el_rincon_escolar
PORT=3000
```

*Nunca hagas commit del archivo **`.env`**. Revisa con **`git status`** antes de subir cambios.*

### 3. Ejecutar el proyecto

Bash

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### 4. Poblar la base de datos (Seed)

*Advertencia: Ejecutar este script borra los datos actuales y carga los de prueba.*

Bash

```bash
npm run seed
```

## Flujo de trabajo con Git y GitHub

1. **Actualizar siempre `main` antes de empezar:**

   Bash

   ```bash
   git switch main
   git pull origin main
   ```

2. **Crear rama por Historia de Jira:** No se crean ramas por subtarea, sino por historia principal.

   Bash

   ```bash
   git switch -c feature/IN-5-stock-minimo
   ```

3. **Guardar cambios y crear Commit descriptivo (incluyendo el ID de Jira):**

   Bash

   ```bash
   git add .
   git commit -m "IN-5 Implementar lógica de validación para stock mínimo"
   ```

4. **Subir rama y crear Pull Request:**

   Bash

   ```bash
   git push -u origin feature/IN-5-stock-minimo
   ```

5. **Revisión y Merge:** Esperar revisión de código de un compañero. Tras la aprobación, se integra a `main`.

## Reglas importantes

1. **NO hacer push directamente a `main`.** Todo cambio entra por Pull Request.
2. **NO subir `.env` ni `node_modules`.**
3. **Identificador de Jira en todo momento:** Las ramas, commits y Pull Requests deben iniciar con la clave del ticket (ej. `IN-3`).
4. **No modificar código de otra historia sin coordinación.** Si un cambio afecta el área de otro desarrollador, comunícalo antes de intervenir.
5. **Ante un conflicto de Git:** No borres archivos a ciegas. Comunícate con el equipo para una resolución segura.
