(function() {
    "use strict";

    window.onSourceLoad = Event();
    window.sourceLoadState = false;

    function hasLoaded() {
        window.onSourceLoad.emit(this);
        window.sourceLoadState = true;
    }

    window.addEventListener("load", elm=>notExisting && hasLoaded());

    var notExisting = true;
    var PackLoader = function(res, path) {
        notExisting = false;
        this.isHeaderLoaded = false;
        this.standing = false;
        this.onLoad = Event();
        this.path = path;
        this.res = res;
        var xhr = new XHR(null, (path || "") + res, "post");
        xhr.onReady.on(this.doXHRReady, this);
        xhr.send();
    };


    PackLoader.prototype.load = function() {
        this.standing = true;
        this._load();
    };


    PackLoader.prototype._load = function() {
        if(this.isHeaderLoaded && this.standing) {
            new SourceLoader(this.path, this.content, {
                onLoad: this.doLoadComplete, context: this
            });
        }
    };


    PackLoader.prototype.doLoadComplete = function() {
        this.onLoad.emit(this);
    };


    PackLoader.prototype.doXHRReady = function(src, status, content) {
        this.isHeaderLoaded = true;
        this.content = content;
        this._load();
    };

    window.PackLoader = PackLoader;


    var PacksLoader = function(packs, args) {
        this.onLoad = Event();
        if(args) this.onLoad.on(args.onLoad, args.onLoadContext || args.context || window);
        this.item = packs ? packs.map(elm=>
            elm instanceof PackLoader ? elm : new PackLoader(elm.res, elm.path)
        ) : [];
        packs && this.load();
    };


    PacksLoader.prototype.push = function(...values) {
        this.item.push(...values);
    };


    PacksLoader.prototype.load = function() {
        this.item.forEach(elm=>elm.onLoad.on(this.doPackLoaded, this));
        this.item[0] && this.item[0].load();
    };


    PacksLoader.prototype.doPackLoaded = function(src) {
        var next = this.item.indexOf(src) + 1;
        if(this.item.length > next) {
            this.item[next].load();
        }
        else {
            this.onLoad.emit(this);
            hasLoaded();
        }
    };

    window.PacksLoader = PacksLoader;

})();