const setRem = function (pWidth, prem) {
    let html = document.getElementsByTagName("html")[0];
    const oWidth = document.body.clientWidth || document.documentElement.clientWidth;
    html.style.fontSize = oWidth / pWidth * prem + "px";
}

module.exports = {
    setRem: setRem
};
