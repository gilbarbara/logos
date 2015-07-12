var React = require('react'),
    App  = require('./App');

var showName = (e) => {
    var el = e.toElement;
    el.parentNode.classList.add('visible');
};

var hideName = (e) => {
    var el = e.fromElement;
    el.parentNode.classList.remove('visible');
};


var enableTips = () => {
    var elems = document.querySelectorAll('.logo-item img');
    for (var i = 0; i < elems.length; i++) {
        elems[i].addEventListener("mouseenter", showName, false);
        elems[i].addEventListener("mouseleave", hideName, false);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    React.render(<App/>, document.getElementById('react'));
    enableTips();
});

