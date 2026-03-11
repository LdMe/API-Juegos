class Genre {
    constructor(id, name, backgroundImage) {
        this.id = id;
        this.name = name;
        this.backgroundImage = backgroundImage;
    }
    toString() {
        return `Género: ${this.name}, imagen de fondo: ${this.backgroundImage} `
    }
}

export default Genre;