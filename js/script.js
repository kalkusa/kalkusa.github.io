window.onload = function () {
    this.currentSection = "main";
};

function navigate(sectionName) {
    var section = document.querySelector('section#' +  this.currentSection);
    section.classList.add('invisible');
    section = document.querySelector('section#' + sectionName);
    section.classList.remove('invisible');
    this.currentSection = sectionName;
}