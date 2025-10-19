import '../css/style.css';
import '../img/logo.png';
import '../img/logo_transparent.png';
import '../img/favicon.png';
import Helper from './helpers';
import Storage from './localStorage';
import Search from './search';
import ActiveModal from './modal';
import FiltreMod from './filtreMod'

const switchContent = document.querySelectorAll('#show-new');
const switchBtn = document.querySelector('#swich');
const switchMod = document.querySelector('.wrapper-content-switcher').children;

const btnFiltreLoadMore = document.querySelector('#filtre-loadMore');
const btnLoadNewSetCartds = document.querySelector('#loadMore');

const List = document.querySelector('#content__list');
const storageList = document.querySelector('#storage__list');
const contentList = document.querySelector('#filtre__list');

const formSearch = document.querySelector('#search-form');
const Modal = document.querySelector('.modal-warapp');
const Loader = document.querySelector('#loader-in-filterList');



/* Filter Mod */
const standartMod = document.querySelector('#standart');
const filterMod = document.querySelector('#activeFilter');
/* END Filter Mod */

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
btnLoadNewSetCartds.addEventListener('click', Fetch);
List.addEventListener('click', workWithStorage);
contentList.addEventListener('click', workWithStorage)
formSearch.addEventListener('submit', handlerSearch);
filterMod.addEventListener('click', activeFilterMod)
standartMod.addEventListener('click', activeStandartMod);
btnFiltreLoadMore.addEventListener('click', activeBtnForFiltreLoadMore)


function activeStandartMod(e) {
    if(!e.path[1].classList.contains('active')) {
        contentList.innerHTML = '';

        switcherLoader();
    
        ToggleForWindowMod();
    }

}

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

function activeBtnForFiltreLoadMore(e) {
    const id = e.target.dataset.id;

    switcherLoader();

    LoadCardForFilterMod(id)
}

function ToggleForWindowMod() {
    switchMod[0].classList.toggle('d-none');
    switchMod[1].classList.toggle('d-none');

    standartMod.classList.toggle('active');
    filterMod.classList.toggle('active');
}

async function LoadCardForFilterMod(id) {
    let data = await Filtre.activeFiltreFetch(id);

    const check = LocalStorage.getData();
    const newData = Helpers.checkIsMarked(check, data);
    data = newData;

    Filtre.addPage();

    const html = Helpers.createCard(data);

    Helpers.innerToHTML(contentList, html);

    switcherLoader();
}

function switcherLoader() {
    Loader.classList.toggle('loader-active');
    btnFiltreLoadMore.classList.toggle('btn-active');
}

function switcherForContent() {
    switchContent[0].classList.toggle('d-none');
    switchContent[1].classList.toggle('d-none');
}

function switcher(e) {
    const target = e.target;

    if(!target.classList.contains('buttonActive')) {
        target.classList.add('buttonActive');
        const items = LocalStorage.getData();

        if(items.length <= 0) {
            storageList.innerHTML = '<h3 style="text-align:center; color:#fff"> Нічого немає </h3>'
        } else {
            items.forEach( async id => {
                const response = await Helpers.activeIDFetch(id);
                
                const card = Helpers.createCard([response]);
    
                Helpers.innerToHTML(storageList, card)
            })
        }

        switcherForContent();
    } else {
        target.classList.remove('buttonActive');

        switcherForContent();

        storageList.innerHTML = '';
    }
}



function chooseEmoji(e) {
    const id = e.target.dataset.id;
    if(typeof id === 'string') {

        ToggleForWindowMod();

        closeModal();

        LoadCardForFilterMod(id);


        btnFiltreLoadMore.dataset.id = id;
        btnFiltreLoadMore.dataset.page = Filtre.__PAGE; 
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

    let films = await Helpers.activeFetch();

    const check = LocalStorage.getData();

    const newData = Helpers.checkIsMarked(check, films);
    films = newData;

    const Cards = Helpers.createCard(films);

    Helpers.innerToHTML(List, Cards)
}



