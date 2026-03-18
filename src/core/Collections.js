import {MissingIDError,ElementNotFoundError} from "./errors.js"
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
        if(!game){
            return;
        }
        game.setFavorite(true);
    }
    removeFromFavorites(id) {
        const game = this.collection.get(id);
        if(!game){
            return;
        }
        game.setFavorite(false);
    }
    isFavorite(id){
        const game = this.collection.get(id);
        if(!game){
            return false;
        }
        return game.isFavorite;
    }
    toggleFavorite(id) {
        const game = this.collection.get(id);
        if(!game){
            return;
        }
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

export{
    GenericCollection,
    GameCollection
}