"use strict";

const formulario = document.querySelector("#formulario-tarea");
const entrada = document.querySelector("#nombre-tarea");
const lista = document.querySelector("#lista-tareas");
const listaVacia = document.querySelector("#lista-vacia");
const contador = document.querySelector("#contador");
const mensaje = document.querySelector("#mensaje");
const botonAgregar = formulario.querySelector('button[type="submit"]');

let tareas = [];
let ocupado = false;
let cargaCorrecta = false;

async function solicitar(ruta, opciones = {}) {
    const respuesta = await fetch(ruta, {
        ...opciones,
        headers: {
            "Content-Type": "application/json",
            ...opciones.headers
        }
    });

    if (!respuesta.ok) {
        const datos = await respuesta.json().catch(() => null);

        throw new Error(
            datos?.mensaje || "No fue posible completar la operación."
        );
    }

    if (respuesta.status === 204) {
        return null;
    }

    return respuesta.json();
}

function mostrarTareas() {
    lista.replaceChildren();

    const completadas = tareas.filter(
        (tarea) => tarea.completada
    ).length;

    contador.textContent = cargaCorrecta
        ? `${completadas} de ${tareas.length} completadas`
        : "Sin datos disponibles";

    listaVacia.hidden = !cargaCorrecta || tareas.length > 0;
    botonAgregar.disabled = ocupado;

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
        casilla.disabled = ocupado;

        casilla.addEventListener("change", () => {
            const nuevoEstado = casilla.checked;

            ejecutarCambio(async () => {
                await solicitar(`/api/tareas/${tarea.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        completada: nuevoEstado
                    })
                });
            });
        });

        const texto = document.createElement("span");
        texto.textContent = tarea.nombre;

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "boton-eliminar";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.disabled = ocupado;
        botonEliminar.setAttribute(
            "aria-label",
            `Eliminar tarea: ${tarea.nombre}`
        );

        botonEliminar.addEventListener("click", () => {
            ejecutarCambio(async () => {
                await solicitar(`/api/tareas/${tarea.id}`, {
                    method: "DELETE"
                });
            });
        });

        etiqueta.append(casilla, texto);
        elemento.append(etiqueta, botonEliminar);
        lista.append(elemento);
    });
}

async function ejecutarCambio(accion) {
    if (ocupado) {
        return;
    }

    ocupado = true;
    mensaje.textContent = "";
    mostrarTareas();

    let cambioGuardado = false;

    try {
        await accion();
        cambioGuardado = true;

        tareas = await solicitar("/api/tareas");
        cargaCorrecta = true;
    } catch (error) {
        if (cambioGuardado) {
            cargaCorrecta = false;
            tareas = [];

            mensaje.textContent =
                "El cambio se guardó, pero no se pudo actualizar la lista. " +
                "Recarga la página para consultar las tareas.";
        } else {
            mensaje.textContent =
                error.message +
                " Si se interrumpió la conexión, recarga antes de reintentar.";
        }
    } finally {
        ocupado = false;
        mostrarTareas();
    }
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = entrada.value.trim();

    if (!nombre) {
        mensaje.textContent = "Escribe una tarea antes de agregarla.";
        entrada.focus();
        return;
    }

    ejecutarCambio(async () => {
        await solicitar("/api/tareas", {
            method: "POST",
            body: JSON.stringify({ nombre })
        });

        formulario.reset();
        entrada.focus();
    });
});

async function iniciar() {
    ocupado = true;
    mensaje.textContent = "Cargando tareas...";
    mostrarTareas();

    try {
        tareas = await solicitar("/api/tareas");
        cargaCorrecta = true;
        mensaje.textContent = "";
    } catch (error) {
        mensaje.textContent = error.message;
    } finally {
        ocupado = false;
        mostrarTareas();
    }
}

iniciar();