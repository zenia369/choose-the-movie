export default class Search {

    async search(word) {
        const URL = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${word}`;
        
        const request = await fetch(
            URL, 
            {
            method: 'GET',
            headers: {
                'X-API-KEY': 'cb5f0c80-e1ab-45b3-8cee-3f02642f6379',
                'Content-Type': 'application/json',
                }
            })
        const {films} = await request.json();

        return films
    }

}