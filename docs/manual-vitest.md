# Manual de pruebas unitarias con Vitest

Este proyecto incluye pruebas unitarias para validar la lógica principal de la aplicación con Vitest.

## 1. Objetivo

El objetivo es comprobar que las funciones y stores más importantes se comportan correctamente sin depender del navegador completo ni de la API real.

Se han cubierto tres bloques:

- Traducción de textos y recetas.
- Lógica de la lista de compra.
- Lógica del planificador semanal.

## 2. Preparación

1. Instalar dependencias:

   npm install

2. Ejecutar las pruebas:

   npm run test

## 3. Configuración aplicada

Para habilitar Vitest se añadieron estos elementos:

- `vitest.config.js`, con entorno `jsdom`.
- `vitest.setup.js`, para limpiar mocks y `localStorage` entre pruebas.
- El script `test` en `package.json`.

## 4. Casos probados

### 4.1 Traducciones

Se verifica que:

- `traducirBusqueda` traduzca usando el idioma `es|en` y reutilice la caché.
- `traducirRecetaCompleta` traduzca título, instrucciones, categoría, área e ingredientes.
- Se guarden cachés auxiliares para reutilizar traducciones posteriores.

### 4.2 Lista de compra

Se comprueba que:

- Al agregar ingredientes desde una receta se crean elementos nuevos.
- Si un ingrediente ya existe, se fusionan cantidades y se acumulan recetas.
- Las acciones de marcar comprado, limpiar comprados y eliminar item funcionan como se espera.

### 4.3 Planificador

Se valida que:

- Una receta se coloque en el día y tipo correcto.
- Un slot individual pueda limpiarse.
- La semana completa vuelva a su estado inicial.

## 5. Ejecución

Para lanzar la batería de pruebas:

    npm run test

Si solo quieres repetirlas después de un cambio puntual, basta con volver a ejecutar el mismo comando.

## 6. Resultado esperado

Cuando todo está correcto, Vitest termina sin errores y muestra que las pruebas han pasado.

## 7. Conclusión

Este proceso demuestra una base real de test unitarios para la práctica final: configuración de Vitest, pruebas aisladas de lógica de negocio y documentación del flujo seguido.