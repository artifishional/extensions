(function() {
    "use strict";

    var ShelveChange = function(src) {
        this.src = src;
        this.item = [];
    };

    ShelveChange.prototype.raise = null;


    ShelveChange.prototype.on = function(context) {
        /*<TODO DEBUG>*/
        if(!(context instanceof Object)) throw new TypeError();
        /*</TODO>*/
        this.item.push(context);
    };


    ShelveChange.prototype.off = function(context) {
        this.item.remove(context);
    };


    ShelveChange.prototype.asyncHandler = function() {
        this.item.forEach(function(elm) {
            elm.asyncHandler && elm.asyncHandler(this);
        }, this);
    };


    ShelveChange.prototype.syncHandler = function() {
        this.item.forEach(function(elm) {
            elm.syncHandler && elm.syncHandler(this);
        }, this);
    };

    window.ShelveChange = ShelveChange;

})();