'use strict';

var imagesCount;
var loadedImagesCount = 0;
var currentSection = "main"
var app;

window.onload = function () {
    preloadImages(function onCompleted() {
        onPageLoaded(500);
        app = new Vue({
            el: '#container',
            data: {
                experience: (new Date()).getFullYear() - 2013
            }
        });
    });
};

function navigate(sectionName) {
    var section = document.querySelector('section#' + currentSection);
    section.classList.add('invisible');
    section = document.querySelector('section#' + sectionName);
    section.classList.remove('invisible');
    currentSection = sectionName;
}

function onPageLoaded(timeout) {
    setTimeout(() => {
        let body = document.querySelector('body');
        body.classList.add('loaded');
    }, timeout);
}

function preloadImages(onCompleted) {
    var images = Array.from(document.images).map(image => {
        return image.src;
    }).concat(getBackgroundImages());
    console.log(images);
    imagesCount = images.length;
    loadedImagesCount = 0;
    for (var imgNo in images) {
        preloadImage(images[imgNo], function () {
            loadedImagesCount++;
            if (imagesCount == loadedImagesCount) {
                onCompleted();
            }
        });
    }
}

function preloadImage(url, callback) {
    var img = new Image();
    img.src = url;
    img.onload = callback;
}

function getBackgroundImages() {
    var url, B = [],
        A = document.getElementsByTagName('*');
    A = B.slice.call(A, 0, A.length);
    while (A.length) {
        url = document.deepCss(A.shift(), 'background-image');
        if (url) url = /url\(['"]?([^")]+)/.exec(url) || [];
        url = url[1];
        if (url && B.indexOf(url) == -1) B[B.length] = url;
    }
    return B;
}

document.deepCss = function (who, css) {
    if (!who || !who.style) return '';
    var sty = css.replace(/\-([a-z])/g, function (a, b) {
        return b.toUpperCase();
    });
    if (who.currentStyle) {
        return who.style[sty] || who.currentStyle[sty] || '';
    }
    var dv = document.defaultView || window;
    return who.style[sty] ||
        dv.getComputedStyle(who, "").getPropertyValue(css) || '';
}

Array.prototype.indexOf = Array.prototype.indexOf ||
    function (what, index) {
        index = index || 0;
        var L = this.length;
        while (index < L) {
            if (this[index] === what) return index;
            ++index;
        }
        return -1;
    }

//Tooltips on CV
//TODO Rework to vanilla js

var initWidth = 1366;

function setAnchorPointLeft(elem, y, x) {
    var w = $(window).width();
    var fraction = w / initWidth;
    elem.css('top', y * fraction - elem.outerHeight() - 15.29 + 'px')
    elem.css('left', x * fraction - elem.outerWidth() - 15.29 + "px")
}

function setAnchorPointRight(elem, y, x) {
    var w = $(window).width();
    var fraction = w / initWidth;

    elem.css('top', y * fraction - elem.outerHeight() - 15.29 + 'px')
    elem.css('right', x * fraction - elem.outerWidth() - 15.29 + "px")
}

function align() {
    $('.r-tip').each(function (index, item) {
        let y = $(item).attr('y');
        let x = $(item).attr('x');
        setAnchorPointRight($(item), y, x);
    });

    $('.l-tip').each(function (index, item) {
        let y = $(item).attr('y');
        let x = $(item).attr('x');
        setAnchorPointLeft($(item), y, x);
    });
}

$(function () {
    align();
    $(window).resize(function () {
        align();
    });
});