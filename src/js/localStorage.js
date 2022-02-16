export default class Storage {
    constructor() {
        this._lStorage = [];
        this.name = 'Films'
    }

    start() {
        const data = localStorage.getItem(this.name);
        this._lStorage = data ? JSON.parse(data) : [];
        localStorage.setItem(this.name, data ? data : []);
    }

    addToStorage() {
        const body = JSON.stringify(this._lStorage)
        localStorage.setItem(this.name, body)
    }

    removeFromStorage(id) {
        const data = this._lStorage.filter(el => el != id);
        this._lStorage = data;
    }

    lStorage(id) {
        this._lStorage = [...this._lStorage, id];
    }

    getData() {
        const data = localStorage.getItem(this.name);
        const newData = data ? JSON.parse(data) : [];
        return newData 
    }
}