export default class Helper {
    constructor() {
        this.__PAGE = 1;
    }

    addPage() {
        this.__PAGE += 1;
    }

    async activeFetch(url) {
        const request = await fetch(
            url, 
            {
            method: 'GET',
            headers: {
                'X-API-KEY': 'cb5f0c80-e1ab-45b3-8cee-3f02642f6379',
                'Content-Type': 'application/json',
                }
            })
        let {films} = await request.json();

        this.addPage()

        films = this.addMarked(films)

        return films;
    }

    async activeIDFetch(id) {
        const request = await fetch(
            `https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, 
            {
            method: 'GET',
            headers: {
                'X-API-KEY': 'cb5f0c80-e1ab-45b3-8cee-3f02642f6379',
                'Content-Type': 'application/json',
                }
            })

        const item = await request.json();

        return {...item, marked: true}
    }



    addMarked(arr) {
        return arr.map(el => {
            return {
                ...el,
                marked: false,
            }
        })
    }

    checkIsMarked(storage, data) {
        storage.forEach(check => {
            // data.forEach(el => {
            //     if(el.filmId === +check) {
            //         el.marked = true;
            //         return
            //     }
            // })
            for(let i = 0; i < data.length; i++) {
                if(data[i].filmId === +check) {
                    data[i].marked = true;
                    return
                }
            }
        })

        return data
    }

    innerToHTML(parent, html) {
        parent.innerHTML += html;
    }

    createCard(list) {
        return list.map((el, i) => {
            return `
                    <div class="col-3 d-flex content__list__item">
                        <div class="content__list__item__wrapp">
                            <!-- Image and rating -->
                            <div class="content__list__item__header" style="background: url(${el.posterUrlPreview}); background-repeat: no-repeat; background-size: cover">
                                <span>${el.rating ? [...el.rating][0] :'🐳'}</span>
                                <i data-id="${el.filmId ? el.filmId : el.kinopoiskId}" class="fa-regular fa-bookmark ${el.marked ? 'active' : ''}"></i>
                                
                            </div>
                            <!-- END Image and rating -->
                            <!-- About films -->
                            <div class="content__list__item__footer">
                                <div class="content__list__item__footer__name">
                                    <p data-id="${el.filmId}" class="">
                                        ${el.nameRu}
                                        <span>${el.year}</span>
                                    </p>
                                </div>
                                <div  class="content__list__item__footer__ganre">
                                    <p class="textToLowerCase">
                                        ${el.genres.map(el => el.genre).join(', ')}
                                    </p>
                                </div>
                            </div>
                            <!-- END About films -->
                        </div>
                    </div>
                `
        }).join(' ')
    }
}