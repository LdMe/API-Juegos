class DOMManager {
    constructor() {

    }
    renderGames(games,parent){
        const htmlGames = games.map(game =>this.createGameHtml(game));
        parent.append(...htmlGames);
    }
    createGameHtml(game){
        // contentedor (tarjeta)
        const article = document.createElement("article");
        article.classList.add("game-card")
        article.setAttribute("id",`game-${game.id}`);

        // imagen
        const image = document.createElement("img");
        image.setAttribute("alt",`portada del juego ${game.name}`);
        image.setAttribute("src",game.backgroundImage);

        // titulo
        const title = document.createElement("h3");
        title.textContent = game.name;

        // rating
        const rating = document.createElement("p");
        rating.classList.add("rating");
        rating.textContent = "rating: "+game.rating;

        article.append(image,title,rating);
        return article;

    }
    renderGenres(genres,parent){
        const htmlGenres = genres.map(genre =>this.createGenreHtml(genre));
        parent.append(...htmlGenres);
    }
    createGenreHtml(genre){
        const article = document.createElement("article");
        article.classList.add("genre-card")
        article.setAttribute("id",`genre-${genre.id}`);
        article.style.backgroundImage = genre.backgroundImage;

        const title = document.createElement("h3");
        title.innerText = genre.name;
        
        article.appendChild(title);
        return article;

    }
}

export default DOMManager;