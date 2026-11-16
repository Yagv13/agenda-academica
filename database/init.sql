-- Base de datos de la agenda académica
CREATE DATABASE IF NOT EXISTS agenda_academica
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE agenda_academica;

-- Tabla de tareas
CREATE TABLE IF NOT EXISTS tareas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    completada BOOLEAN NOT NULL DEFAULT FALSE,
    creada_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_tareas_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) BETWEEN 1 AND 120),

    CONSTRAINT chk_tareas_completada
        CHECK (completada IN (0, 1))
);