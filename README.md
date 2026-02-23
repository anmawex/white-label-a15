# Simulador de Crédito (ProApp)

Este proyecto es una aplicación web desarrollada en **Angular** orientada a la simulación de créditos. Permite a los usuarios realizar cálculos y simulaciones de solicitudes basándose en distintos parámetros y validaciones de datos.

## Estructura y Arquitectura del Proyecto

El proyecto sigue una arquitectura modular y escalable, enfocada en la separación de responsabilidades funcionales e interfaces visuales. La estructura principal dentro de `src/app` es la siguiente:

- **`core/`**: Centraliza la lógica de negocio, reglas de dominio y servicios singletons. Aquí se ubican los modelos, utilidades principales y la lógica de cálculo financiero.
- **`features/`**: Rutas y vistas principales de la aplicación. Se divide en módulos funcionales como `home` y `settings`.
- **`shared/`**: Recursos globales reutilizables a lo largo del proyecto, conteniendo *pipes*, directivas y, destacablemente, un sistema de componentes UI compartidos organizados metodológicamente.

## Patrón Strategy (Strategy Pattern)

Para los cálculos de amortización, el proyecto implementa el **Patrón de Diseño Estrategia**, ubicado en `src/app/core/strategies/`.
- Permite aislar los algoritmos de cálculo del resto de la interfaz y lógica.
- Actualmente se encuentra implementada la estrategia principal de amortización (`french-amortization.strategy.ts` junto con su interfaz `calculation.strategy.ts`). 
- **Beneficio:** Otorga flexibilidad absoluta al sistema. Si en el futuro se requiriera una nueva fórmula o sistema de cálculo, basta con crear una nueva estrategia mediante la misma interfaz, sin tener que modificar los servicios o componentes actuales que consumen los resultados.

## Metodología Atomic Design

La interfaz de usuario está construida bajo los principios de **Atomic Design** (`src/app/shared/components/`). Esto nos entrega una alta reusabilidad, favorece el escalado del proyecto y facilita el mantenimiento de los elementos visuales. La librería de componentes internos se divide en:
- **Átomos (`atoms/`):** Elementos base de la interfaz que no pueden ser descompuestos, como botones, *inputs* de formulario y tipografías.
- **Moléculas (`molecules/`):** Pequeñas agrupaciones de átomos que en conjunto resuelven una funcionalidad de UI simple.
- **Organismos (`organisms/`):** Contenedores más complejos formados por átomos y moléculas para armar secciones enteras, como los formularios estructurados del simulador, abarcando los controles y visualizaciones dependientes.

## Stack Tecnológico

- **Framework:** Angular v15.2
- **Programación Reactiva:** RxJS (empleado en los flujos complejos, simulaciones asíncronas e integraciones dinámicas de la UI)
- **Estilos:** Tailwind CSS con PostCSS

## Desarrollo

Para ejecutar un servidor de pruebas en tu entorno local:

1. Instala las dependencias necesarias: `npm install`
2. Ejecuta el entorno de desarrollo: `npm run start` o `ng serve`
3. Ingresa a `http://localhost:4200/` en tu navegador.
