(function() {
    "use strict";

    var SourceLoader = function(path, res, args) {
        this.res = res;
        this.path = path || "";
        this.onLoad = Event();
        this.loading = false;
        this.item = res.content.scripts;
        typeof DEBUG != "undefined" && [].push.apply(this.item, res.content.test);
        if (args) this.onLoad.on(args.onLoad, args.onLoadContext || args.context || window);
        this.load();
    };


    SourceLoader.prototype.handleEvent = function() {
        this.onLoad.emit(this);
    };


    SourceLoader.prototype.load = function() {
        if(this.loading) return;
        this.loading = true;
        this.item.forEach((elm, index, ar) => {
            var script = document.createElement("script");
            script.src = this.path + elm;
            script.async = false;
            if (ar.length == index + 1) script.addEventListener("load", this);
            document.head.appendChild(script);
        });
    };

    window.SourceLoader = SourceLoader;

})();