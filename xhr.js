(function() {
    "use strict";

    var XHR = function(error, path, type, content) {
        this.onReady = Event();
        this.error = error;
        this.content = content;
        this.type = type;
        this.path = path;
        this.response = {};
        this.status = 0;
        this._aborted = false;
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
        this._abortTimer = setTimeout(this.cancel.bind(this), 10000);
    };


    XHR.prototype.handleEvent = function() {
        clearTimeout(this._abortTimer);
        if(this._aborted) return;
        if (this.request.readyState == 4) {
            this.doLoad({status: this.request.status, responseText: this.request.responseText});
        }
    };


    XHR.prototype.cancel = function() {
        this.doLoad({status: 198});
        this.abort();
    };


    /**
     * Реакция на окончание загрузки
     */
    XHR.prototype.doLoad = function (event) {
        this.status = event.status;
        var content = null;
        if(this.request.status == 200) {
            try {
                this.response = content = JSON.parse(event.responseText);
            }
            catch (e) {
                this.status = 199;
                this.error && this.error.set(event.status);
            }
        }
        else {
            this.error && this.error.set(event.status, event.responseText);
        }
        this.onReady.emit(this, event.status, content);
    };


    /**
     * Отменить загрузку
     */
    XHR.prototype.abort = function () {
        this._aborted = true;
        this.request.abort();
    };

    window.XHR = XHR;

})();