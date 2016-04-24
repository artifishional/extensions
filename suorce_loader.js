(function() {

    var SourceLoader = function(res, callback, thisArg) {
        this.res = res;
        this.onLoad = Event();
        this.item = res.scripts;
        if (callback) {
            this.onLoad.on(callback, thisArg || null);
            this.load();
        }
    };


    SourceLoader.prototype.handleEvent = function() {
        this.onLoad.emit(this);
    };


    SourceLoader.prototype.load = function() {
        this.item.forEach((elm, index, ar) => {
            var script = document.createElement("script");
            script.src = elm;
            script.async = true;
            if (ar.length == index + 1)
                script.addEventListener("load", this);
            document.head.appendChild(script);
        });
    };

    window.SourceLoader = SourceLoader;

});