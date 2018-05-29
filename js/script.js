"use strict";

var imagesCount;
var loadedImagesCount = 0;
var currentSection = "main";
var app;

//Tooltips on CV
Vue.component("pinned-tooltip", {
  props: ["position", "company", "from", "to", "x", "y", "top", "left"],
  template: `
<div class="tip l-tip" :x="x" :y="y" :style="{ top: top + 'px', left:left+'px'}">
<p>
  <b>{{position}}</b>
</p>
<p>{{company}}</p>
<p>{{from}} - {{to}}</p>
</div>`,
  created() {
    window.addEventListener("resize", this.updateComponentPosition);
    window.dispatchEvent(new Event('resize'));
  },
  destroyed() {
    window.removeEventListener("resize", this.updateComponentPosition);
    this.data();
  },
  methods: {
    updateComponentPosition(e) {
      var windowWidth = e.target.innerWidth;
      var windowHeight = e.target.innerHeight;
      var xScale = windowWidth / this.getBackgroundImageSize().width;
      var yScale = windowHeight / this.getBackgroundImageSize().height;
      var scale;
      var yOffset = 0;
      var xOffset = 0;

      if (xScale > yScale) {
        // The image fits perfectly in x axis, stretched in y
        scale = xScale;
        yOffset =
          (windowHeight - this.getBackgroundImageSize().height * scale) / 2;
      } else {
        // The image fits perfectly in y axis, stretched in x
        scale = yScale;
        xOffset =
          (windowWidth - this.getBackgroundImageSize().width * scale) / 2;
      }

      this.top = this.y * scale + yOffset;
      this.left = this.x * scale + xOffset;
    },
    getBackgroundImageSize() {
      //TODO "unmock" this later
      return {
        width: 4465,
        height: 2827
      };
    }
  }
});

window.onload = function () {
  preloadImages(function onCompleted() {
    onPageLoaded(500);
    app = new Vue({
      el: "#container",
      data: {
        experience: new Date().getFullYear() - 2013
      }
    });


  });
};

function navigate(sectionName) {
  var section = document.querySelector("section#" + currentSection);
  section.classList.add("invisible");
  section = document.querySelector("section#" + sectionName);
  section.classList.remove("invisible");
  currentSection = sectionName;
  //align();
}

function onPageLoaded(timeout) {
  setTimeout(() => {
    let body = document.querySelector("body");
    body.classList.add("loaded");
  }, timeout);
}

function preloadImages(onCompleted) {
  var images = Array.from(document.images)
    .map(image => {
      return image.src;
    })
    .concat(getBackgroundImages());
  //console.log(images);
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
  var url,
    B = [],
    A = document.getElementsByTagName("*");
  A = B.slice.call(A, 0, A.length);
  while (A.length) {
    url = document.deepCss(A.shift(), "background-image");
    if (url) url = /url\(['"]?([^")]+)/.exec(url) || [];
    url = url[1];
    if (url && B.indexOf(url) == -1) B[B.length] = url;
  }
  return B;
}

document.deepCss = function (who, css) {
  if (!who || !who.style) return "";
  var sty = css.replace(/\-([a-z])/g, function (a, b) {
    return b.toUpperCase();
  });
  if (who.currentStyle) {
    return who.style[sty] || who.currentStyle[sty] || "";
  }
  var dv = document.defaultView || window;
  return (
    who.style[sty] || dv.getComputedStyle(who, "").getPropertyValue(css) || ""
  );
};

Array.prototype.indexOf =
  Array.prototype.indexOf ||
  function (what, index) {
    index = index || 0;
    var L = this.length;
    while (index < L) {
      if (this[index] === what) return index;
      ++index;
    }
    return -1;
  };