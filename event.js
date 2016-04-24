/**
 * Класс для реализации события
 * @constructor
 */
window.Event = function () {
    if (!(this instanceof Event)) return new Event();
    this.pointer = 0;
    Event.super.constructor.call(this);
};

extend(Event, Array);
Event.ERROR = [
    "Переданное значение handler не может быть приведено к типу Function",
    "Для добавления обработчиков в очередь используйте методы on и once",
    "Обнаружена попытка повторного включения"
];


Event.prototype.handleEvent = function(e) {
    this.emit(this, e);
};


/**
 * Емитер
 */
Event.prototype.emit = function () {

    var elm;

    //var buffer = this.slice();

    for (this.pointer = 0; this.pointer < this.length; this.pointer++) {
        if(this.pointer>-1) {
            elm = this[this.pointer];
            //Прерывание цепочки
            if (elm.handler.apply(elm.thisArg, arguments) === false) break;
            if (elm.once) this.off(elm.handler, elm.thisArg);
        }
    }

};


/**
 * Добавить обработчик
 * @param {Function} handler
 * @param thisArg
 */
Event.prototype.on = function (handler, thisArg) {

    //console.log(this.length);

    if (!(handler instanceof Function)) throw Event.ERROR[0];

    //todo: Подсказка для отладочной версии
    if (this.filter(function (elm) {
            return elm.thisArg == thisArg && elm.handler == handler &&
                !(thisArg && thisArg.model != elm.thisArg.model);
        }).length > 2) throw Event.ERROR[2];

    //Два включения могут произойти, так как сначала представление подписывается
    //на новую модель, а потом происходит очистка, а в данный момент используется
    //общий контейнер для модели

    Event.super.push.call(
        this, {once: 0, handler: handler, thisArg: thisArg}
    );

};


/**
 * Удалить обработчик
 * @param {Function} handler
 * @param thisArg
 */
Event.prototype.off = function (handler, thisArg) {
    for (var i = this.length, res, elm; i-- && !res;) {
        if (handler == (elm = this[i]).handler && elm.thisArg == thisArg) {
            res = this.removeAtIndex(i);
        }
    }
    return res;
};


Event.prototype.push = function (record) {
    throw Event.ERROR[1];
};


/**
 * Добавить разовый обработчик
 * @param {Function} handler
 * @param thisArg
 */
Event.prototype.once = function (handler, thisArg) {

    if (!(handler instanceof Function)) throw Event.ERROR[0];

    if (this.find(function (elm) {
            return elm.thisArg == thisArg && elm.handler == handler;
        })) throw Event.ERROR[2];

    Event.super.push.call(
        this, {once: 1, handler: handler, thisArg: thisArg}
    );

};


/**
 * Удалить по индексу
 * @param {Number} index
 * @method
 * @private
 */
Event.prototype.removeAtIndex = function (index) {
    this.pointer <= index && this.pointer--;
    return this.splice(index, 1);
};


window.onLoad = Event();
window.addEventListener("load", window.onLoad);
