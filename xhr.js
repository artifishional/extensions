(function() {
    "use strict";

    var XHR = function(error, path, type, content) {
        this.onReady = Event();
        this.error = error;
        this.content = content;
        this.type = type;
        this.path = path;
    };


    XHR.prototype.send = function() {
        var self = this;
        var request = new XMLHttpRequest();
        this.request = request;
        request.open(this.type, this.path, true);
        request.addEventListener("readystatechange", this);
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        request.setRequestHeader("Content-type", "application/json; charset=utf-8");
        request.send(this.content);
    };


    XHR.prototype.handleEvent = function() {
        if (this.request.readyState == 4) {
            this.doLoad();
        }
    };


    /**
     * Реакция на окончание загрузки
     */
    XHR.prototype.doLoad = function () {

        if(this.request.status == 200) {
            var content = JSON.parse(this.request.responseText);
        }
        else {
            if(this.error) {
                this.error.set(this.request.status, this.request.responseText);
            }
        }

        this.onReady.emit(this, this.request.status, content);

    };


    /**
     * Отменить загрузку
     */
    XHR.prototype.abort = function () {
        this.request.abort();
    };

    window.XHR = XHR;

})();