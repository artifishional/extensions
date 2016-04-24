(function() {
    "use strict";

    /**
     * @param {Model} model
     * @constructor
     */
    var BaseView = function(model) {

        this.item = [];

        /**
         * @property
         * @type {Event}
         */
        this.onModelChange = Event();

        this.setModel(model || null);

    };


    /**
     * Привзять к новой модели
     * @param {Model} model
     * @method
     */
    BaseView.prototype.setModel = function(model) {
        if (this.model != model) {
            if(this.model) {
                this.doModelDestroy(this.model);
            }
            if (model) {
                model.onDestroy.once(this.doModelDestroy, this);
                /**
                 * @property
                 * @type {Event}
                 */
                this.model = model;

                if(model.isDestroyed) {
                    return this.setModel(null);
                }

                this.refresh();
                this.onModelChange.emit(this, model);
            }
        }
    };


    /**
     * Остановить выполнение анимации
     * @method
     */
    BaseView.prototype.stop = emptyf;


    /**
     * Очистить представление
     * @method
     */
    BaseView.prototype.clear = function () {
        for(var i = 0; i < this.item.length; i++) {
            this.item[i].clear();
        }
    };


    /**
     * Обновить по текущей модели
     * @method
     */
    BaseView.prototype.refresh = function() {

    };


    /**
     * Реакция на удаление модели
     * //@param {SB1.Model.Base} src
     * @method
     */
    BaseView.prototype.doModelDestroy = function(src) {
        src.onDestroy.off(this.doModelDestroy, this);
        this.model = null;
    };


    /**
     * Добавление элемента в контейнер
     * @param {BaseView} child
     * @method
     */
    BaseView.prototype.addChild = function(child) {
        this.item.push(child);
    };


    /**
     * Добавление элемента по индексу
     * @param {BaseView} child
     * @param {Number} index
     * @method
     */
    BaseView.prototype.addChildAt = function(child, index) {
        this.item.splice(index, 0, child);
    };


    /**
     * Удаление элемента
     * @param {BaseView} child
     * @method
     */
    BaseView.prototype.removeChild = function(child) {
        this.item.remove(child);
    };


    /**
     * Представление для PIXI
     * @param {PIXI.Container | null} exist
     * @param {Manager.Model} model
     * @extends BaseView
     * @constructor
     */
    window.View = function(exist, model) {

        if(!(this instanceof View)) {
            throw "Ошибочный вызов конструктора";
        }

        /**
         * @property
         * @type {PIXI.Container}
         */
        this.pixi = exist || new PIXI.Container();

        View.super.constructor.call(this, model);

    };

    extend(View, BaseView);


    var model = new Model();
    model.id = -1;

    if(typeof PIXI != "undefined") {
        View.empty = new View(null, model);
    }

    View.ERROR = [
        "Переданный элемент не является потомком View"
    ];


    /**
     * Добавление элемента в контейнер
     * @param {View} child
     * @method
     */
    View.prototype.addChild = function(child) {
        if(!(child instanceof View)) throw View.ERROR[0];
        View.super.addChild.call(this, child);
        this.pixi.addChild(child.pixi);
    };


    /**
     * Добавление элемента по индексу
     * @param {View} child
     * @param {Number} index
     * @method
     */
    View.prototype.addChildAt = function(child, index) {
        if(!(child instanceof View)) throw View.ERROR[0];
        View.super.addChildAt.call(this, child, index);
        this.pixi.addChildAt(child.pixi, index);
    };


    /**
     * Удаление элемента из контейнера
     * @param {View} child
     * @method
     */
    View.prototype.removeChild = function(child) {
        View.super.removeChild.call(this, child);
        return this.pixi.removeChild(child.pixi);
    };


    /**
     * @param {Element} dom
     * @param {Model} model
     * @extends BaseView
     * @constructor
     */
    window.DomView = function(model, dom) {

        /**
         * @property
         * @type {Element}
         */
        this.dom = dom || document.createElement("div");

        DomView.super.constructor.call(this, model);

    };

    extend(DomView, BaseView);

    DomView.ERROR = [
        "Переданный элемент не является потомком DomView"
    ];


    /**
     * Добавление элемента в контейнер
     * @param {DomView} child
     * @method
     */
    DomView.prototype.addChild = function(child) {
        if(!(child instanceof DomView)) throw DomView.ERROR[0];

        var remove = this.item.indexOf(child);
        if(remove != -1) {
            this.item.splice(remove, 1);
        }

        DomView.super.addChild.call(this, child);
        this.dom.appendChild(child.dom);
    };


    /**
     * Добавление элемента по индексу
     * @param {View} child
     * @param {Number} index
     * @method
     */
    DomView.prototype.addChildAt = function(child, index) {
        if(!(child instanceof DomView)) throw DomView.ERROR[0];

        var remove = this.item.indexOf(child);
        if(remove != -1) {
            this.item.splice(remove, 1);
        }

        if(index == this.item.length) {
            this.addChild(child);
        }
        else {
            //this.dom.removeChild(child.dom);

            this.dom.insertBefore(child.dom, this.dom.childNodes[index]);
            DomView.super.addChildAt.call(this, child, index);
        }
    };


    /**
     * Удаление элемента из контейнера
     * @param {View} child
     * @method
     */
    DomView.prototype.removeChild = function(child) {
        DomView.super.removeChild.call(this, child);
        return this.dom.removeChild(child.dom);
    };

}());

