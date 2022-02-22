export default class FiltreMod {
    constructor() {
        this.__PAGE = 1;
    }

    addPage() {
        this.__PAGE += 1;
    }

    async activeFiltreFetch(id) {
        const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films?genres=${id}&order=RATING&type=ALL&ratingFrom=0&ratingTo=10&yearFrom=2000&yearTo=3000&page=1`

        const request = await fetch(
            url, 
            {
            method: 'GET',
            headers: {
                'X-API-KEY': 'cb5f0c80-e1ab-45b3-8cee-3f02642f6379',
                'Content-Type': 'application/json',
                }
            })

        const {items} = await request.json();

        return items
    }
}