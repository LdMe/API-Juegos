class Game {
    constructor(id, name, backgroundImage, rating,genres) {
        this.id = id;
        this.name = name;
        this.backgroundImage = backgroundImage;
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
        return `Juego: ${this.name}, puntuación: ${this.rating},imagen de fondo: ${this.backgroundImage} `
    }
}

export default Game;