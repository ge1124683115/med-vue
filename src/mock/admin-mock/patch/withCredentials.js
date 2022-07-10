export default function (Mock) {
    Mock.XHR.prototype.__send = Mock.XHR.prototype.send;
    Mock.XHR.prototype.send = function () {
        if (this.custom.xhr) this.custom.xhr.withCredentials = this.withCredentials || false;
        this.__send.apply(this, arguments);
    }
}
