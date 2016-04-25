(function() {
    "use strict";

    var ShelveChange = function(src) {
        this.src = src;
        this.item = [];
    };

    ShelveChange.prototype.raise = null;


    ShelveChange.prototype.on = function(context) {
        this.item.push(context);
    };


    ShelveChange.prototype.off = function(context) {
        this.item.remove(context);
    };


    ShelveChange.prototype.async = function() {
        this.item.forEach(function(elm) {
            elm.async && elm.async(this);
        }, this);
    };


    ShelveChange.prototype.sync = function() {
        this.item.forEach(function(elm) {
            elm.sync && elm.sync(this);
        }, this);
    };

    window.ShelveChange = ShelveChange;

})();