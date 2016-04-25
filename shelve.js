(function() {
    "use strict";

    var Shelve = function() {
        this.lastShelve = null;
        this.shelves = null;
        this.observers = [];
    };


    Shelve.prototype.on = function(context) {
        this.observers.push(context);
    };


    /**
     * @param {ShelveChange} change
     */
    Shelve.prototype.raise = function(change) {
        /*this.immediate && */delAside(this.immediate);
        if(!this.observers.length && !this.shelves) return;
        if(!this.shelves) this.shelves = [];
        //Если есть новые подписчики
        var fl;
        if(fl = this.observers.length) {
            this.lastShelve = change;
            this.observers.forEach(change.on, change);
            this.observers = [];
        }
        //Если были новые подписчики->был создан новый шелв
        fl && this.shelves.push(this.lastShelve);
        //прокинуть асинхронные изменения
        this.async(this);
        //прокинуть синхронные изменения (кроме последнего)
        this.shelves.forEach(function (elm, index, array) {
            (array.length - 1 > index || !fl) && elm.raise(change);
        });
        /*!this.immediate && */(this.immediate = setAside(this.sync, this));
    };


    Shelve.prototype.sync = function(context) {
        context.immediate = 0;
        var shelves = context.shelves;
        context.shelves = null;
        context.lastShelve = null;
        //Сначала собираем все синхронизированные объекты
        shelves.forEach(function (elm) {
            context.observers.push.apply(context.observers, elm.item);
        });
        //Теперь пробрасываем шелвы
        shelves.forEach(function (elm) {
            elm.sync();
        });
    };


    Shelve.prototype.async = function(context) {
        context.shelves.forEach(function (elm) {
            elm.async();
        });
    };


    Shelve.prototype.off = function(context) {

    };


    window.Shelve = Shelve;

})();