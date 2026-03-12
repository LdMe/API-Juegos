
class StorageManager {

    static saveToStorage(key,data){
        const stringData = JSON.stringify(data);
        localStorage.setItem(key,stringData);
    }
    static getFromStorage(key,defaultValue){
        const data = localStorage.getItem(key);
        if(!data){
            return defaultValue;
        }
        const jsonData = JSON.parse(data);
        return jsonData;
    }
    static saveFavorite(id){
        const favorites = StorageManager.getFromStorage("favorites",[]);
        const favoritesSet =  new Set(favorites);
        favoritesSet.add(id);
        const favoritesArray = Array.from(favoritesSet);
        StorageManager.saveToStorage("favorites",favoritesArray);
    }
    static removeFavorite(id){
        const favorites = StorageManager.getFromStorage("favorites",[]);
        const filteredFavorites = favorites.filter(fav => fav !== id);
        StorageManager.saveToStorage("favorites",filteredFavorites);
    }
    static toggleFavorite(id){
        const favorites = StorageManager.getFromStorage("favorites",[]);
        const isIdFavorite = favorites.some(fav => fav === id);
        if(!isIdFavorite){
            StorageManager.saveFavorite(id);
        }else{
            StorageManager.removeFavorite(id);
        }
    }
    static getFavorites(){
        return StorageManager.getFromStorage("favorites",[]);
    }
}

export default StorageManager;