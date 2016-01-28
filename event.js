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


Event.prototype.handleEvent = function(e) {
    this.emit(this, e);
};


/**
 * Емитер
 */
Event.prototype.emit = function () {
    var elm;
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
 * @param {Object=} thisArg
 */
Event.prototype.on = function (handler, thisArg) {
    /*<TODO DEBUG>*/
    if (!(handler instanceof Function))
        throw new TypeError("handler is not a Function");
    /*</TODO>*/
    Event.super.push.call(
        this, {once: 0, handler: handler, thisArg: thisArg}
    );
};


/**
 * Удалить обработчик
 * @param {Function} handler
 * @param {Object=} thisArg
 */
Event.prototype.off = function (handler, thisArg) {
    for (var i = this.length, res, elm; i-- && !res;) {
        if (handler == (elm = this[i]).handler && elm.thisArg == thisArg) {
            res = this.removeAtIndex(i);
        }
    }
    return res;
};


Event.prototype.push =
    Event.prototype.splice =
        Event.prototype.remove = function () {
            throw "private method";
        };


/**
 * Добавить разовый обработчик
 * @param {Function} handler
 * @param thisArg
 */
Event.prototype.once = function (handler, thisArg) {
    /*<TODO DEBUG>*/
    if (!(handler instanceof Function))
        throw new TypeError("handler is not a Function");
    /*</TODO>*/
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