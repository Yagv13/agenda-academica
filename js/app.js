"use strict";

const CLAVE_ALMACENAMIENTO = "agenda-academica-tareas";

const formulario = document.querySelector("#formulario-tarea");
const entrada = document.querySelector("#nombre-tarea");
const lista = document.querySelector("#lista-tareas");
const listaVacia = document.querySelector("#lista-vacia");
const contador = document.querySelector("#contador");
const mensaje = document.querySelector("#mensaje");

let tareas = cargarTareas();

function cargarTareas() {
    try {
        const contenido = localStorage.getItem(CLAVE_ALMACENAMIENTO);

        if (contenido === null) {
            return [];
        }

        const datos = JSON.parse(contenido);

        if (!Array.isArray(datos)) {
            throw new Error("Formato de almacenamiento incorrecto.");
        }

        return datos.filter((tarea) =>
            tarea !== null &&
            typeof tarea === "object" &&
            typeof tarea.id === "string" &&
            typeof tarea.nombre === "string" &&
            typeof tarea.completada === "boolean"
        );
    } catch (error) {
        mensaje.textContent =
            "No fue posible recuperar las tareas guardadas. " +
            "Comprueba que el navegador permita el almacenamiento local.";

        return [];
    }
}

function guardarTareas() {
    try {
        localStorage.setItem(
            CLAVE_ALMACENAMIENTO,
            JSON.stringify(tareas)
        );

        mensaje.textContent = "";
    } catch (error) {
        mensaje.textContent =
            "Los cambios están visibles, pero no pudieron guardarse. " +
            "Se perderán al recargar la página.";
    }
}

function mostrarTareas() {
    lista.replaceChildren();

    const completadas = tareas.filter((tarea) => tarea.completada).length;

    contador.textContent =
        `${completadas} de ${tareas.length} completadas`;

    listaVacia.hidden = tareas.length > 0;

    tareas.forEach((tarea) => {
        const elemento = document.createElement("li");
        elemento.className = "tarea";

        if (tarea.completada) {
            elemento.classList.add("completada");
        }

        const etiqueta = document.createElement("label");

        const casilla = document.createElement("input");
        casilla.type = "checkbox";
        casilla.checked = tarea.completada;

        casilla.addEventListener("change", () => {
            tarea.completada = casilla.checked;
            guardarTareas();
            mostrarTareas();
        });

        const texto = document.createElement("span");
        texto.textContent = tarea.nombre;

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "boton-eliminar";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.setAttribute(
            "aria-label",
            `Eliminar tarea: ${tarea.nombre}`
        );

        botonEliminar.addEventListener("click", () => {
            tareas = tareas.filter((item) => item.id !== tarea.id);
            guardarTareas();
            mostrarTareas();
        });

        etiqueta.append(casilla, texto);
        elemento.append(etiqueta, botonEliminar);
        lista.append(elemento);
    });
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = entrada.value.trim();

    if (!nombre) {
        mensaje.textContent = "Escribe una tarea antes de agregarla.";
        entrada.focus();
        return;
    }

    tareas.push({
        id: crypto.randomUUID(),
        nombre,
        completada: false
    });

    guardarTareas();
    mostrarTareas();

    formulario.reset();
    entrada.focus();
});

mostrarTareas();