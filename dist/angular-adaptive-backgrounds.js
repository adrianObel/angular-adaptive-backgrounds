/*
  angular-adaptive-backgrounds v0.2.0
  http://brandly.github.io/angular-adaptive-backgrounds/
*/
(function() {
  angular.module('mb-adaptive-backgrounds', ['ng']).provider('adaptiveBackgroundsOptions', function() {
    !function(n){"use strict";var t=function(){return document.createElement("canvas").getContext("2d")},e=function(n,e){var a=new Image,o=n.src||n;"data:"!==o.substring(0,5)&&(a.crossOrigin="Anonymous"),a.onload=function(){var n=t("2d");n.drawImage(a,0,0);var o=n.getImageData(0,0,a.width,a.height);e&&e(o.data)},a.src=o},a=function(n){return["rgb(",n,")"].join("")},o=function(n){return n.map(function(n){return a(n.name)})},r=5,i=10,c={};c.colors=function(n,t){t=t||{};var c=t.exclude||[],u=t.paletteSize||i;e(n,function(e){for(var i=n.width*n.height||e.length,m={},s="",d=[],f={dominant:{name:"",count:0},palette:Array.apply(null,new Array(u)).map(Boolean).map(function(){return{name:"0,0,0",count:0}})},l=0;i>l;){if(d[0]=e[l],d[1]=e[l+1],d[2]=e[l+2],s=d.join(","),m[s]=s in m?m[s]+1:1,-1===c.indexOf(a(s))){var g=m[s];g>f.dominant.count?(f.dominant.name=s,f.dominant.count=g):f.palette.some(function(n){return g>n.count?(n.name=s,n.count=g,!0):void 0})}l+=4*r}if(t.success){var p=o(f.palette);t.success({dominant:a(f.dominant.name),secondary:p[0],palette:p})}})},n.RGBaster=n.RGBaster||c}(window);;
    var options;
    options = {
      imageClass: null,
      exclude: ['rgb(0,0,0)', 'rgba(255,255,255)'],
      normalizeTextColor: false,
      normalizedTextColors: {
        light: '#fff',
        dark: '#000'
      },
      lumaClasses: {
        light: 'ab-light',
        dark: 'ab-dark'
      }
    };
    return {
      set: function(userOptions) {
        return angular.extend(options, userOptions);
      },
      $get: function() {
        return options;
      }
    };
  }).directive('adaptiveBackground', function($window, adaptiveBackgroundsOptions) {
    var getCSSBackground, options;
    options = adaptiveBackgroundsOptions;
    getCSSBackground = function(raw) {
      return $window.getComputedStyle(raw, null).getPropertyValue('background-image').replace('url(', '').replace(')', '');
    };
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var adaptBackground, childElement, findImage, handleImg, rawChildElement, rawElement, useCSSBackground;
        rawElement = element[0];
        useCSSBackground = function(el) {
          return el.tagName !== 'IMG';
        };
        findImage = function() {
          var elementWithClass, imageClass;
          imageClass = attrs.abImageClass || options.imageClass;
          if (imageClass != null) {
            elementWithClass = rawElement.querySelector('.' + imageClass);
            if (elementWithClass != null) {
              return angular.element(elementWithClass);
            }
          }
          return angular.element(element.find('img')[0]);
        };
        adaptBackground = function(image) {
          return RGBaster.colors(image, {
            paletteSize: 20,
            exclude: options.exclude,
            success: function(colors) {
              return element.css('backgroundColor', colors.dominant);
            }
          });
        };
        childElement = findImage();
        rawChildElement = childElement[0];
        if (useCSSBackground(rawChildElement)) {
          return adaptBackground(getCSSBackground(rawChildElement));
        } else {
          handleImg = function() {
            return adaptBackground(rawChildElement);
          };
          childElement.on('load', handleImg);
          scope.$on('$destroy', function() {
            return childElement.off('load', handleImg);
          });
          return handleImg();
        }
      }
    };
  });

}).call(this);
