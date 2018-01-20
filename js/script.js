window.onload = function () {
    console.log('loaded');
    let body = document.querySelector('body');
    body.classList.add('loaded');
    this.currentSection = "main";

    var app = new Vue({
        el: '#container',
        data: {
            experience: (new Date()).getFullYear() - 2013
        }
    })
};

function navigate(sectionName) {
    var section = document.querySelector('section#' + this.currentSection);
    section.classList.add('invisible');
    section = document.querySelector('section#' + sectionName);
    section.classList.remove('invisible');
    this.currentSection = sectionName;
}
