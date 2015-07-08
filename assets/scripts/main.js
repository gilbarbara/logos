function showName (e) {
    var el = e.toElement;
    el.parentNode.classList.add('visible');
}

function hideName (e) {
    var el = e.fromElement;
    el.parentNode.classList.remove('visible');
}


function enableTips () {
    var elems = document.querySelectorAll('.logo-item img');
    for (var i = 0; i < elems.length; i++) {
        elems[i].addEventListener("mouseenter", showName, false);
        elems[i].addEventListener("mouseleave", hideName, false);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    enableTips();
});

