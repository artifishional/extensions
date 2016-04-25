(function() {
    "use strict";

    var id = 0;
    var queue = [];
    var ID;

    window.setAside = function(handler) {
        if(!queue.length) {
            ID = setImmediate(call);
        }
        //queue.unshift({id: ++id, handler: handler, args: [].slice.call(arguments, 1)});
        queue.push({id: ++id, handler: handler, args: [].slice.call(arguments, 1)});
        return id;
    };


    function call() {
        var next;
        while(queue.length > 0) {
            next = queue.shift();
            next.handler.apply(undefined, next.args);
        }
    }


    window.delAside = function(id) {
        var cur = queue.find(function (elm) {
            return id == elm.id;
        });
        cur && queue.splice(queue.indexOf(cur), 1);
        !queue.length && clearImmediate(ID);
    }

})();

