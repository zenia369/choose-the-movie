import '../css/style.css';
import '../img/logo.png'
import Helper from './helpers';
import Storage from './localStorage';
import Search from './search';
import ActiveModal from './modal';
import FiltreMod from './filtreMod'

const switchContent = document.querySelectorAll('#show-new');
const switchBtn = document.querySelector('#swich');
const List = document.querySelector('#content__list');
const storageList = document.querySelector('#storage__list');
const contentList = document.querySelector('#filtre__list');
const formSearch = document.querySelector('#search-form');
const Modal = document.querySelector('.modal-warapp');
const switchMod = document.querySelector('.wrapper-content-switcher').children;
const textModalTitle = document.querySelector('#search-title');
const Loader = document.querySelector('#loader');
const loadNewSetCartds = document.querySelector('#loadMore');

/* Filter */
const standartMod = document.querySelector('#standart');
const filterMod = document.querySelector('#activeFilter');
/* END Filter */

const Helpers = new Helper();
const LocalStorage = new Storage();
const ActiveSearch = new Search();
const OpenModal = new ActiveModal();
const Filtre = new FiltreMod(); 



(() => {
    Fetch();
    LocalStorage.start();
})()

switchBtn.addEventListener('click', switcher);
loadNewSetCartds.addEventListener('click', Fetch);
List.addEventListener('click', workWithStorage);
contentList.addEventListener('click', workWithStorage)
formSearch.addEventListener('submit', handlerSearch);
filterMod.addEventListener('click', activeFilterMod)

standartMod.addEventListener('click', () => {
    standartMod.classList.add('active');
    filterMod.classList.remove('active');
})

/* Пагинація */

// window.addEventListener('scroll', throttle(checkPosition));
// window.addEventListener("resize", throttle(checkPosition));

// async function checkPosition() {
//     // Нам потребуется знать высоту документа и высоту экрана.
//     const height = document.body.offsetHeight
//     const screenHeight = window.innerHeight
  
//     // Они могут отличаться: если на странице много контента,
//     // высота документа будет больше высоты экрана (отсюда и скролл).
  
//     // Записываем, сколько пикселей пользователь уже проскроллил.
//     const scrolled = window.scrollY
  
//     // Обозначим порог, по приближении к которому
//     // будем вызывать какое-то действие.
//     // В нашем случае — четверть экрана до конца страницы.
//     const threshold = height - screenHeight / 4
  
//     // Отслеживаем, где находится низ экрана относительно страницы.
//     const position = scrolled + screenHeight
  
//     if (position >= threshold) {
//       // Если мы пересекли полосу-порог, вызываем нужное действие.
//        await loadCard();
//     }
// }

// function throttle(callee, timeout = 3000) {
//     let timer = null
  
//     return function perform(...args) {
//       if (timer) return
  
//       timer = setTimeout(() => {
//         callee(...args)
  
//         clearTimeout(timer)
//         timer = null
//       }, timeout)
//     }
// }
  
/* КІНЕЦЬ Пагинація */

function activeFilterMod(e) {
    if(!e.target.parentNode.classList.contains('active')) {

        const modalData = {
            title: 'Обери смайлик, щоб почати шукати тобі фільми!',
            html: 'undefiend'
        }
    
        const emoji = [
            {emoji:'😀', id: '13'}, 
            {emoji:'😊', id: '19'}, 
            {emoji:'😎', id: '11'},
            {emoji:'😴', id: '22'},
            {emoji:'😖', id: '18'},
            {emoji:'😝', id: '7'},
            {emoji:'🦾', id: '6'},
            {emoji:'😍', id: '2'},
            {emoji:'👎', id: '17'}
        ]
    
        const data = OpenModal.createEmojiCard(emoji)
        modalData.html = data;
    
        const html = OpenModal.createHTMLForModal(modalData);
    
        Helpers.innerToHTML(Modal, html);
        openModal();
    
        const searchList = document.querySelector('#search__list');
    
        searchList.addEventListener('click', chooseEmoji);
    
    }
    
}

async function chooseEmoji(e) {
    const id = e.target.dataset.id;
    if(typeof id === 'string') {

        if(switchMod[1].classList.contains('d-none')) {
            switchMod[0].classList.toggle('d-none');
            switchMod[1].classList.toggle('d-none');
            // switchMod[1].classList.add('d-block');
    
            standartMod.classList.remove('active');
            filterMod.classList.add('active');
    
            closeModal();
        }

        const data = await Filtre.activeFiltreFetch(id);
        Filtre.addPage();

        const html = Helpers.createCard(data);

        contentList.innerHTML += html;


    }

}


async function handlerSearch(e) {
    e.preventDefault();

    const title = e.target.children[0].value.toLowerCase();
    e.target.children[0].value = '';

    const modalData = {
        title: `Пошук за словом: ${title}`,
        html: '',
    }

    let data = await ActiveSearch.search(title);

    let cards = '';

    if(!data.length <= 0) {
        const check = LocalStorage.getData();

        const newData = Helpers.checkIsMarked(check, data);
        data = newData;

        cards = Helpers.createCard(data);
        modalData.html = cards
    } else {
        cards = '<h3 style="text-align:center; color:#fff"> Нічого немає </h3>';
    }

    const html = OpenModal.createHTMLForModal(modalData);

    Helpers.innerToHTML(Modal, html);
    openModal();

}

function openModal() {
    Modal.classList.remove('d-none');
    Modal.classList.add('d-block');

    const searchList = document.querySelector('#search__list');
    const btnModalClose = document.querySelector('#search-close');

    searchList.addEventListener('click', workWithStorage);
    btnModalClose.addEventListener('click', closeModal)
}

function closeModal() {
    Modal.innerHTML = '';
    Modal.classList.remove('d-block');
    Modal.classList.add('d-none');
}

function switcher(e) {
    const target = e.target;

    if(!target.classList.contains('buttonActive')) {
        target.classList.add('buttonActive');
        const items = LocalStorage.getData();

        if(items.length <= 0) {
            console.log(items.length);
            storageList.innerHTML = '<h3 style="text-align:center; color:#fff"> Нічого немає </h3>'
        } else {
            items.forEach( async id => {
                const response = await Helpers.activeIDFetch(id);
                
                const card = Helpers.createCard([response]);
    
                Helpers.innerToHTML(storageList, card)
            })
        }

        switchContent[0].classList.add('d-none');
        switchContent[1].classList.remove('d-none');
    } else {
        target.classList.remove('buttonActive');

        switchContent[0].classList.remove('d-none');
        switchContent[1].classList.add('d-none');

        storageList.innerHTML = '';
    }


}

function workWithStorage(e) {
    const target = e.target;
    const id = target.dataset.id;
    if(target.tagName === "I" && !target.classList.contains('active')) {

        LocalStorage.lStorage(id);
        LocalStorage.addToStorage();

        target.classList.add('active');

    } else if(target.tagName === "I" && target.classList.contains('active')) {
  
        LocalStorage.removeFromStorage(id);
        LocalStorage.addToStorage();

        target.classList.remove('active');
    }
}

async function Fetch() {

    const URL = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=`;
    const page = Helpers.__PAGE;

    let films = await Helpers.activeFetch(URL+page);

    const check = LocalStorage.getData();

    const newData = Helpers.checkIsMarked(check, films);
    films = newData;

    const Cards = Helpers.createCard(films);

    Helpers.innerToHTML(List, Cards)
}



