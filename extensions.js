function isSet(varable) {
    return typeof varable !== "undefined";
}

var ER_NEED_IMPLEMENTS = new Error("interface requires the implementation of");

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


Object.first = function(obj) {
    var keys = Object.keys(obj);
    if(keys.length) {
        return obj[keys[0]];
    }
    return null;
};

//Полчуить коллекцию значений массив
Array.prototype.values = Array.prototype.values || function() {
    for(var i = 0, res = [], cur; i < this.length; ++i)
        if((cur = this[i]) !== undefined) res.push(cur);
    return res;
};


Array.prototype.clear = function() {
    this.length = 0;
};


Array.prototype.swap = function(a, b) {
    var t = this[a];
    this[a] = this[b];
    this[b] = t;
};


Array.prototype.transpose = function(width, height) {
    for(var i = 0, k, res = []; i < width; i++)
        for(k = 0; k < height; k++) res.push(this[i + k * width]);
    for(i = 0; i < this.length; i++) this[i] = res[i];
};


Array.prototype.filter = Array.prototype.filter || function(fun/*, thisArg*/) {

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };


// Шаги алгоритма ECMA-262, 5-е издание, 15.4.4.21
// Ссылка (en): http://es5.github.io/#x15.4.4.21
// Ссылка (ru): http://es5.javascript.ru/x15.4.html#x15.4.4.21
Array.prototype.reduce = Array.prototype.reduce || function(callback/*, initialValue*/) {
        if (this == null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this), len = t.length >>> 0, k = 0, value;
        if (arguments.length == 2) {
            value = arguments[1];
        } else {
            while (k < len && ! k in t) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };



Array.prototype.find = Array.prototype.find || function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };

// ���� ��������� ECMA-262, 6-� �������, 22.1.2.1
// ������: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
Array.from = Array.from || (function() {
        var toStr = Object.prototype.toString;
        var isCallable = function(fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) { return 0; }
            if (number === 0 || !isFinite(number)) { return number; }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // �������� length ������ from ����� 1.
        return function from(arrayLike/*, mapFn, thisArg */) {
            // 1. ������� C ������ �������� this.
            var C = this;

            // 2. ������� items ������ ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }

            // 4. ���� mapfn ����� undefined, ������� mapping ������ false.
            var mapFn = arguments[1];
            if (typeof mapFn !== 'undefined') {
                mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                // 5. �����
                // 5. a. ���� ����� IsCallable(mapfn) ����� false, ���������� ���������� TypeError.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. ���� thisArg ������������, ������� T ������ thisArg; ����� ������� T ������ undefined.
                if (arguments.length > 2) {
                    var T = arguments[2];
                }
            }

            // 10. ������� lenValue ������ Get(items, "length").
            // 11. ������� len ������ ToLength(lenValue).
            var len = toLength(items.length);

            // 13. ���� IsConstructor(C) ����� true, ��
            // 13. a. ������� A ������ ���������� ������ ����������� ������ [[Construct]]
            //     ������� C �� ������� ����������, ���������� ������������ ������� len.
            // 14. a. �����, ������� A ������ ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. ������� k ������ 0.
            var k = 0;
            // 17. ���� k < len, ����� ���������... (���� � a �� h)
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. ������� putStatus ������ Put(A, "length", len, true).
            A.length = len;
            // 20. ����� A.
            return A;
        };
    })();




/**
 * Создаем выходной массив в котором меняет местами ключи с их значениями
 * относительно исходного массива
 * @returns {Array.<T>}
 */
Array.prototype.flip = function() {
    for(var i = 0, res = []; i < this.length; i++) res[this[i]] = i;
    return res;
};

/**
 * Возвращает последний элемент массива
 * @returns {T}
 */
Array.prototype.last = function() {
    return this[this.length-1] || null;
};


Array.prototype.first = function() {
    return this[0] || null;
};


/**
 * Удаляет элемент из массива по его сигнатуре
 * @param elm
 */
Array.prototype.remove = function(elm) {
    for(var i = 0; i < arguments.length; i++) {
        this.splice(this.indexOf(arguments[i]), 1);
    }
};


if (!Number.isInteger) Number.isInteger = function isInteger (nVal) {
    return typeof nVal === "number" &&
        isFinite(nVal) && nVal > -9007199254740992 &&
        nVal < 9007199254740992 && Math.floor(nVal) === nVal;
};


Number.prototype.zeroFill = function(width) {
    width -= this.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test( this ) ? 2 : 1) ).join( '0' ) + this;
    }
    return this + "";
};


/**
 * Реализация наследования
 * @param child
 * @param parent
 */
window.extend = function(child, parent) {
    child.prototype = Object.create(
        child.super = (child.parent = parent).prototype
    );
    child.prototype.constructor = child;
    child.super.constructor = parent;
};


window.isExtend = function(child, parent) {

    if(child == parent) return true;

    while(child.super) {
        child = child.super.constructor;
        if(child == parent) return true;
    }

    return false;

};


window.emptyf = function() {};


/**
 * Стандартная сортировка без перемешивания
 * @param {Function} compareFunction
 */
Array.prototype.uniSort = function(compareFunction) {
    for(var i = 0; i < this.length; i++) this[i].lQ = i;
    this.sort(function(a, b) {
        var res;
        if(res = compareFunction(a, b)) return res;
        return a.lQ - b.lQ;
    });
};


Array.prototype.equal = function(ar) {
    if(this.length != ar.length) return false;
    return this.every((elm, index) => elm == ar[index]);
};


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


