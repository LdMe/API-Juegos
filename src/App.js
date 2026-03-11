import APIManager from "./managers/APIManager.js";
import { GenericCollection, GameCollection } from "./core/Collections.js";
import Game from "./core/Game.js";
import Genre from "./core/Genre.js";
import DOMManager from "./managers/DOMManager.js";
class App {
    constructor() {
        this.games = null;
        this.genres = null;
        this.domManager = new DOMManager();
    }
    async init() {
        const rawGames = await APIManager.getRawGames();
        this.games = this.createGames(rawGames);

        const gamesSection  = document.getElementById("games-list");
        if(gamesSection) {
            this.domManager.renderGames(this.games.getElements(),gamesSection)
        }

        const rawGenres = await APIManager.getRawGenres();
        this.genres = this.createGenres(rawGenres);
        const genresSection =  document.getElementById("genres-list");
        if(genresSection){
            this.domManager.renderGenres(this.genres.getElements(),genresSection)
        }


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