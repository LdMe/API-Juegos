
# 🎮 Explorador de Videojuegos (Vanilla JS & POO)

Este proyecto es una aplicación Frontend construida íntegramente con **JavaScript Vanilla**. Su objetivo principal es aplicar los principios de la **Programación Orientada a Objetos (POO)** y la **Arquitectura Limpia (MVC)** para crear una aplicación robusta, escalable y fácil de mantener.

La aplicación consume datos de la [RAWG Video Games API](https://rawg.io/apidocs), permite explorar un catálogo de juegos, filtrar por géneros y gestionar una lista de favoritos persistente en el navegador.

## ✨ Funcionalidades

- **Carga dinámica de datos:** Conexión asíncrona a la API de RAWG para obtener juegos y géneros.
- **Filtrado:** Capacidad para ver los juegos asociados a un género específico.
- **Sistema de Favoritos:** Posibilidad de añadir o quitar juegos de una lista de favoritos.
- **Persistencia de Datos:** Los favoritos se guardan en el `localStorage` del navegador para no perderlos al recargar la página.
- **Gestión de Errores Custom:** Uso de clases de error propias (`MissingIDError`, `ElementNotFoundError`) para un control de excepciones preciso.

## 🏗️ Arquitectura del Proyecto

El código está diseñado separando estrictamente las responsabilidades. El núcleo de datos no sabe nada de la interfaz de usuario, y la interfaz no sabe cómo se guardan los datos. Todo está orquestado por un controlador central.

### 1. Modelos y Colecciones (El Core / Datos)
Clases puras que solo manejan datos en la memoria RAM:
- `Game` y `Genre`: Representan las entidades individuales.
- `GenericCollection`: Clase base (herencia) que gestiona un mapa (`Map`) de elementos.
- `GameCollection`: Extiende de la base y añade lógica de negocio específica (filtros, toggle de favoritos).

### 2. Infraestructura (Los Managers)
Clases estáticas que se comunican con el "mundo exterior":
- `APIManager`: Gestiona las peticiones `fetch` a la red.
- `DOMManager`: Traduce los objetos a elementos HTML y los pinta en la pantalla.
- `StorageManager`: Serializa los datos (JSON) para guardarlos y leerlos del Disco Duro (`localStorage`).

### 3. El Controlador Principal
- `App`: Es el cerebro de la aplicación. Inicializa los datos, escucha los eventos de la vista y coordina las colecciones con los Managers.

## 🗺️ Diagrama de Clases

```mermaid
classDiagram
    %% CONTROLADOR PRINCIPAL
    class App {
        +GameCollection games
        +GenericCollection genres
        +init()
        +crearJuegos(gamesData)
        +crearGeneros(genresData)
        +setupEventListeners()
        +handleToggleFavorite(id) 
    }

    %% INFRAESTRUCTURA (Los 3 pilares externos)
    class APIManager {
        <<static>>
        +API_URL String
        +getData(route) Array
        +getRawGames() Array
        +getRawGenres() Array
    }
    class DOMManager {
        <<static>>
        +renderGames(gamesArray, container)
        +renderGenres(genresArray, container)
        +actualizarBotonFavorito(id, esFavorito)
    }
    class StorageManager {
        <<static>>
        +saveFavorites(favoritesArray)
        +loadFavorites() Array
    }

    %% MODELOS Y COLECCIONES (Lógica Core)
    class Game {
        +Number id
        +String name
        +Boolean isFavorite
        +toggleFavorite()
    }
    class Genre {
        +Number id
        +String name
    }
    class GenericCollection {
        +Map collection
        +add(element)
        +getById(id)
        +getElements() Array
    }
    class GameCollection {
        +addToFavorites(id)
        +toggleFavorite(id)
        +getFavorites() Array
    }

    %% RELACIONES
    %% App orquesta todo
    App --> APIManager : Pide datos externos
    App --> DOMManager : Manda pintar UI
    App --> StorageManager : Manda guardar/cargar
    App *-- GameCollection : Instancia (this.games)
    App *-- GenericCollection : Instancia (this.genres)
    
    %% Herencia y Composición
    GenericCollection <|-- GameCollection : HEREDA
    GenericCollection o-- Genre : Contiene
    GameCollection o-- Game : Contiene

```

## Diagramas de Secuencia
### Secuencia de Inicialización
```mermaid
sequenceDiagram
    participant Main as index.js
    participant App as App (Controlador)
    participant API as APIManager (Red)
    participant Model as Colecciones (Memoria)
    participant Storage as StorageManager (Disco)
    participant DOM as DOMManager (Vista)

    Main->>App: 1. const miApp = new App()
    Main->>App: 2. miApp.init()
    
    %% FASE 1: Red
    App->>API: 3. APIManager.getRawGames() y getRawGenres()
    API-->>App: Arrays de objetos planos (JSON)
    
    %% FASE 2: Memoria
    App->>Model: 4. this.crearJuegos() y this.crearGeneros()
    Note over Model: Nacen las instancias<br/>de Game y Genre
    
    %% FASE 3: Disco Duro
    App->>Storage: 5. StorageManager.loadFavorites()
    Storage-->>App: Array de IDs guardados (ej: [3939])
    
    loop Por cada ID guardado
        App->>Model: 6. this.games.addToFavorites(id)
    end
    
    %% FASE 4: Pantalla
    App->>DOM: 7. DOMManager.renderGames() y renderGenres()
    Note over DOM: Construye el HTML final
    
    %% FASE 5: Eventos
    App->>DOM: 8. setupEventListeners()
``` 

### Secuencia de Favoritos

```mermaid
sequenceDiagram
    actor Usuario
    participant DOM as DOMManager (Vista)
    participant App as App (Controlador)
    participant Model as GameCollection (Datos)
    participant Storage as StorageManager (Disco)

    Usuario->>DOM: 1. Clic en "♥" (ej. Juego ID: 3939)
    
    %% La Vista avisa al Controlador
    DOM->>App: 2. App.handleToggleFavorite(3939)
    
    %% FASE 1: App actualiza la memoria (El Modelo)
    App->>Model: 3. this.games.toggleFavorite(3939)
    Note over Model: Se invierte el booleano<br/>isFavorite en el Map
    
    %% FASE 2: App guarda en el Disco Duro (La Persistencia)
    App->>Model: 4. this.games.getFavorites()
    Model-->>App: Array de juegos favoritos actualizados
    
    App->>Storage: 5. StorageManager.saveFavorites(arrayFavoritos)
    Note over Storage: Se convierte a JSON y<br/>se guarda en localStorage
    
    %% FASE 3: App actualiza la Pantalla (La Vista)
    App->>Model: 6. this.games.getById(3939)
    Model-->>App: Instancia del Juego (para saber su nuevo estado)
    
    App->>DOM: 7. DOMManager.actualizarBotonFavorito(3939, juego.isFavorite)
    Note over DOM: Se cambia la clase CSS<br/>(corazón relleno/vacío)
```

## 🚀 Instalación y Uso

1. Clona este repositorio:
```bash
git clone git@github.com:LdMe/API-Juegos.git

```


2. Obtén una API Key gratuita en [RAWG](https://rawg.io/apidocs).
3. Añade tu API Key en la clase `APIManager` (reemplazando `"TU_API_KEY_AQUI"`).
> **Nota de seguridad:** En un entorno de producción real, la API key debería estar protegida en el backend o mediante variables de entorno.


4. Abre el archivo `index.html` en tu navegador usando **Live Server** (extensión de VS Code) para evitar problemas de CORS.

## 🧠 Próximos Pasos (Retos)

* [ ] Implementar paginación desde la API.
* [ ] Añadir una barra de búsqueda por nombre de juego.
* [ ] Crear una vista de "Detalles del Juego" usando el ID.

---

*Proyecto desarrollado con ❤️ como parte del módulo de JavaScript Frontend.*
