(function() {
    "use strict";

    /**
     * Базовый класс модели
     * @constructor
     */
    var Model = function () {

        this.shelve = new Shelve();

        /**
         * Удаление модели
         * @property {Event}
         */
        this.onDestroy = Event();

        /**
         * Общее изменение модели
         * @property {Event}
         */
        this.onChange = Event();

        this.isDestroyed = false;

    };


    /**
     * Удаление модели
     */
    Model.prototype.destroy = function () {
        this.isDestroyed = true;
        this.onDestroy.emit(this);
    };


    Model.prototype.createShelve = function () {

    };


    Model.prototype.clear = function () {};

    window.Model = Model;

})();