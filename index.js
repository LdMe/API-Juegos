const API_KEY = "4a220f3402654dd08d7d231c1e8a78e2";
const API_URL = "https://api.rawg.io/api/";

class MissingIDError extends Error {
    constructor(){
        super("El elemento no tiene id")
    }
}
class ElementNotFoundError extends Error {
    constructor(){
        super("El elemento no existe")
    }
}
class Game {
    constructor(id, name, background_image, rating,genres) {
        this.id = id;
        this.name = name;
        this.background_image = background_image;
        this.rating = rating;
        this.isFavorite = false;
        this.genres = genres;
    }
    setFavorite(value) {
        this.isFavorite = value;
    }
    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }

    toString() {
        return `Juego: ${this.name}, puntuación: ${this.rating},imagen de fondo: ${this.background_image} `
    }
}

class Genre {
    constructor(id, name, background_image) {
        this.id = id;
        this.name = name;
        this.background_image = background_image;
    }
    toString() {
        return `Género: ${this.name}, imagen de fondo: ${this.background_image} `
    }
}

class GenericCollection {
    constructor() {
        this.collection = new Map();
    }
    add(element) {
        if (!element.id) {
            throw new MissingIDError();
        }
        this.collection.set(element.id, element);
    }
    getById(id) {
        const element = this.collection.get(id);
        if(!element) {
            throw new ElementNotFoundError();
        }
        return element;
    }
    getElements() {
        return Array.from(this.collection.values());
    }

}
class GameCollection extends GenericCollection {
    addToFavorites(id) {
        const game = this.collection.get(id);
        game.setFavorite(true);
    }
    removeFromFavorites(id) {
        const game = this.collection.get(id);
        game.setFavorite(false);
    }
    toggleFavorite(id) {
        const game = this.collection.get(id);
        game.toggleFavorite();
    }
    getByGenreId(id){
        const gamesArray = this.getElements();
        return gamesArray.filter(game => game.genres.includes(id));
    }
    getFavorites(){
         const gamesArray = this.getElements();
         return gamesArray.filter(game => game.isFavorite);
    }
}
async function getData(route) {
    try {
        // const response = await fetch(API_URL,{
        //     method: "get",
        //     headers: {
        //         Authorization: `Bearer ${API_KEY}`
        //     }
        // });
        const url = new URL(API_URL + route);
        url.searchParams.append("key", API_KEY)
        const response = await fetch(url.toString())

        if (!response.ok) {
            console.log("ha habido un error", response.status);
            return [];
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(error);
    }
}

function getRawGames() {
    return getData("games");
}
function getRawGenres() {
    return getData("genres");
}
function createGames(gamesData) {
    // return gamesData.map(game => new Game(game.id,game.name,game.background_image,game.rating));
    const collection = new GameCollection();
    gamesData.forEach(rawGame => {
        const genres = rawGame.genres.map(genre => genre.id);
        const game = new Game(rawGame.id, rawGame.name, rawGame.background_image, rawGame.rating,genres);
        collection.add(game);
    })
    return collection;

}
function createGenres(genresData) {
    //return genresData.map(genre => new Genre(genre.id,genre.name,genre.image_background));
    const collection = new GenericCollection();
    genresData.forEach(rawGenre => {
        const game = new Genre(rawGenre.id, rawGenre.name, rawGenre.background_image);
        collection.add(game);
    })
    return collection;
}

async function main() {
    try{
        const rawGames = await getRawGames();
        const games = createGames(rawGames);
        
        const rawGenres = await getRawGenres();
        const genres = createGenres(rawGenres);
    
        const genre4 = genres.getById(400000000000);
        console.log(genre4)
        const actionGames = games.getByGenreId(genre4.id);
        console.log(actionGames)
        games.addToFavorites(3939);
        const favoriteGames = games.getFavorites();
        console.log(favoriteGames)
    }catch(error){
        if(error instanceof ElementNotFoundError){
            console.log("no se ha encontrado");
        }else{
            console.log("Ha ocurrido un error")
        }
        // console.error(error);
    }
}

main();