
import API_KEY from "../apiKey.js";

class APIManager {
    static API_URL = "https://api.rawg.io/api/";
    static async getData(route) {
        try {

            const url = new URL(APIManager.API_URL + route);
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

    static getRawGames() {
        return APIManager.getData("games");
    }
    static getRawGenres() {
        return APIManager.getData("genres");
    }
}

export default APIManager