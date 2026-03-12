import APIManager from "./managers/APIManager.js";
import { GenericCollection, GameCollection } from "./core/Collections.js";
import Game from "./core/Game.js";
import Genre from "./core/Genre.js";
import DOMManager from "./managers/DOMManager.js";
import StorageManager from "./managers/StorageManager.js";
class App {
    constructor() {
        this.games = null;
        this.genres = null;
        this.domManager = new DOMManager();
        this.showFavorites = false;
        this.gamesSection = document.getElementById("games-list");
        this.genresSection = document.getElementById("genres-list");
        this.searchTimeout = null;
    }
    async init() {
        // genres
        const rawGenres = await APIManager.getRawGenres();
        this.genres = this.createGenres(rawGenres);

        if (this.genresSection) {
            this.domManager.renderGenres(this.genres.getElements(), this.genresSection)
        }

        // games
        this.getAndShowGames();

        this.setupListeners();

    }
    async getAndShowGames(query="",genre="") {
        const rawGames = await APIManager.getRawGames(query,genre);
        this.games = this.createGames(rawGames);

        this.loadFavorites();

        this.renderGames();
    }

    renderGames() {
        if (this.gamesSection) {
            const games = this.showFavorites ? this.games.getFavorites() : this.games.getElements();
            this.domManager.renderGames(games, this.gamesSection)
        }
        this.setupFavoriteListeners();
    }
    loadFavorites() {
        const favoriteIds = StorageManager.getFavorites();
        favoriteIds.forEach(favId => {
            this.games.addToFavorites(favId);
        })
    }
    setupListeners() {

        this.setupGenreListeners();
        this.setupFavoriteListeners();
        this.setupNavbarListeners();
        this.setupSearchListener();

    }
    setupGenreListeners() {
        this.domManager.setupListeners(".genre-card", "click", (e) => {
            const genre = e.currentTarget;
            console.log(genre);
            const id = genre.dataset.id;
            console.log("genreListener")
            if(!id){
                return;
            }
            this.getAndShowGames("",id)
        })
    }
    setupFavoriteListeners() {
        // listeners favoritos
        this.domManager.setupListeners(".fav-button", "click", (e) => {
            const button = e.currentTarget;
            const id = parseInt(button.dataset.gameId);
            this.handleToggleFavorite(id);
            console.log("favoriteListener")
            const isGameFavorite = this.games.isFavorite(id);
            if (isGameFavorite) {
                button.textContent = "Quitar de favoritos";
            } else {
                button.textContent = "Añadir a favoritos";
            }
        })
    }
    setupNavbarListeners() {
        //listeners navbar
        this.domManager.setupListeners("#navbar li", "click", (e) => {
            const element = e.currentTarget;
            const route = element.dataset.route;
            console.log("navbarListener")
            if (route === "home") {
                this.showFavorites = false;
            } else if (route === "fav") {
                this.showFavorites = true;
            }
            const elements = [...document.querySelectorAll("#navbar li")];
            elements.forEach(el => el.classList.remove("selected"))

            element.classList.add("selected")
            this.renderGames();
        })
    }
    setupSearchListener(){
        this.domManager.setupListeners("#search-input","input",(e)=>{
            const text = e.target.value;
            if(this.searchTimeout){
                clearTimeout(this.searchTimeout);
            }
            this.searchTimeout = setTimeout(()=>{
                console.log("buscar")
                this.getAndShowGames(text);
                this.searchTimeout = null;
            },1000)
        })
    }
    handleToggleFavorite(id) {
        this.games.toggleFavorite(id);
        StorageManager.toggleFavorite(id);
    }
    createGames(gamesData) {
        // return gamesData.map(game => new Game(game.id,game.name,game.background_image,game.rating));
        const collection = new GameCollection();
        gamesData.forEach(rawGame => {
            const genres = rawGame.genres.map(genre => genre.id);
            const game = new Game(rawGame.id, rawGame.name, rawGame.background_image, rawGame.rating, genres);
            collection.add(game);
        })
        return collection;

    }
    createGenres(genresData) {
        //return genresData.map(genre => new Genre(genre.id,genre.name,genre.image_background));
        const collection = new GenericCollection();
        genresData.forEach(rawGenre => {
            const game = new Genre(rawGenre.id, rawGenre.name, rawGenre.background_image);
            collection.add(game);
        })
        return collection;
    }
}

export default App;