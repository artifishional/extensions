(function() {
    "use strict";

    var Structure = function(copy) {
        this.extend(copy);
    };


    Structure.prototype.extend = function(structure) {
        for(var key in structure) {
            if(structure.hasOwnProperty(key)) {
                if(!this[key]) {
                    if(structure[key].extend) {
                        this[key] = new Structure(structure[key]);
                    }
                    else {
                        this[key] = structure[key];
                    }
                }
                else {
                    if(structure[key].extend) {
                        this[key].extend(structure[key]);
                    }
                    else {
                        this[key] = structure[key];
                    }
                }
            }
        }
    };

    window.Structure = Structure;

})();