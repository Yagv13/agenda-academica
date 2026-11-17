"use strict";

const express = require("express");
const mysql = require("mysql2/promise");
const { z } = require("zod");
const path = require("node:path");

const app = express();
const puerto = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

const raizProyecto = path.resolve(__dirname, "..");

app.get("/", (req, res) => {
    res.sendFile(path.join(raizProyecto, "index.html"));
});

app.get("/privacidad", (req, res) => {
    res.sendFile(path.join(raizProyecto, "legal", "privacidad.html"));
});

app.get("/terminos", (req, res) => {
    res.sendFile(path.join(raizProyecto, "legal", "terminos.html"));
});

app.use(
    "/css",
    express.static(path.join(raizProyecto, "css"))
);

app.use(
    "/js",
    express.static(path.join(raizProyecto, "js"))
);

app.use(
    "/img",
    express.static(path.join(raizProyecto, "img"))
);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5
});

const nuevaTarea = z.object({
    nombre: z.string().trim().min(1).max(120)
}).strict();

const cambioEstado = z.object({
    completada: z.boolean()
}).strict();

function validarId(req, res, next) {
    const texto = req.params.id;
    const id = Number(texto);

    if (
        !/^[1-9]\d*$/.test(texto) ||
        !Number.isSafeInteger(id) ||
        id > 4294967295
    ) {
        return res.status(400).json({
            mensaje: "El identificador de la tarea no es válido."
        });
    }

    req.tareaId = id;
    next();
}

function formatearTarea(tarea) {
    return {
        ...tarea,
        completada: Boolean(tarea.completada)
    };
}

// Comprobar la conexión con la base de datos
app.get("/api/estado", async (req, res) => {
    const [filas] = await pool.query(
        "SELECT COUNT(*) AS total_tareas FROM tareas"
    );

    res.json({
        estado: "ok",
        base_datos: "conectada",
        total_tareas: filas[0].total_tareas
    });
});

// Consultar las tareas
app.get("/api/tareas", async (req, res) => {
    const [filas] = await pool.query(
        `SELECT id, nombre, completada, creada_en
         FROM tareas
         ORDER BY id DESC`
    );

    res.json(filas.map(formatearTarea));
});

// Crear una tarea
app.post("/api/tareas", async (req, res) => {
    const resultado = nuevaTarea.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "La tarea debe contener entre 1 y 120 caracteres."
        });
    }

    const [insercion] = await pool.execute(
        "INSERT INTO tareas (nombre) VALUES (?)",
        [resultado.data.nombre]
    );

    const [filas] = await pool.execute(
        `SELECT id, nombre, completada, creada_en
         FROM tareas WHERE id = ?`,
        [insercion.insertId]
    );

    res.status(201).json(formatearTarea(filas[0]));
});

// Cambiar el estado de una tarea
app.patch("/api/tareas/:id", validarId, async (req, res) => {
    const resultado = cambioEstado.safeParse(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "El estado debe ser verdadero o falso."
        });
    }

    const [existentes] = await pool.execute(
        "SELECT id FROM tareas WHERE id = ?",
        [req.tareaId]
    );

    if (existentes.length === 0) {
        return res.status(404).json({
            mensaje: "La tarea no existe."
        });
    }

    await pool.execute(
        "UPDATE tareas SET completada = ? WHERE id = ?",
        [resultado.data.completada, req.tareaId]
    );

    res.json({
        id: req.tareaId,
        completada: resultado.data.completada
    });
});

// Eliminar una tarea
app.delete("/api/tareas/:id", validarId, async (req, res) => {
    const [resultado] = await pool.execute(
        "DELETE FROM tareas WHERE id = ?",
        [req.tareaId]
    );

    if (resultado.affectedRows === 0) {
        return res.status(404).json({
            mensaje: "La tarea no existe."
        });
    }

    res.status(204).end();
});

// Icono solicitado automáticamente por el navegador
app.get("/favicon.ico", (req, res) => {
    res.redirect(302, "/img/favicon.svg");
});

// Manejar errores sin revelar credenciales ni consultas
app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            mensaje: "El cuerpo de la solicitud no contiene JSON válido."
        });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({
            mensaje: "La solicitud supera el tamaño permitido."
        });
    }

    console.error("Error del servidor:", error.code || error.name);

    res.status(500).json({
        mensaje: "No fue posible completar la operación."
    });
});

app.listen(puerto, "127.0.0.1", () => {
    console.log(`Servidor disponible en http://127.0.0.1:${puerto}`);
});