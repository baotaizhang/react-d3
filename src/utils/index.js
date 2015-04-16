var d3 = require('d3');
var _ = require('lodash');


exports.calculateScales = (chartWidth, chartHeight, xValues, yValues) => {

  var xScale, yScale;

  if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]') {
    xScale = d3.time.scale()
      .range([0, chartWidth]);
  } else {
    xScale = d3.scale.linear()
      .range([0, chartWidth]);
  }
  xScale.domain(d3.extent(xValues));

  if (yValues.length > 0 && Object.prototype.toString.call(yValues[0]) === '[object Date]') {
    yScale = d3.time.scale()
      .range([chartHeight, 0]);
  } else {
    yScale = d3.scale.linear()
      .range([chartHeight, 0]);
  }

  yScale.domain(d3.extent(yValues));

  return {
    xScale: xScale,
    yScale: yScale
  };

};

// TODO(fw): Replace cases of this method w/lodash

// debounce from Underscore.js
// MIT License: https://raw.githubusercontent.com/jashkenas/underscore/master/LICENSE
// Copyright (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative
// Reporters & Editors
exports.debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// TODO(fw): this method was buggy, and may still be...
exports.flattenData = (data, xAccessor, yAccessor, xAxisIsDates=false) => {
  var allValues = [];
  var xValues = [];
  var yValues = [];
  var coincidentCoordinateCheck = {};

  _.each(data, (series) => {
    _.each(series.values, (item, idx) => {
      // (fw): this will support dates, but will always
      // consider x-axis values by day
      var x = xAxisIsDates ?
        parseInt(xAccessor(item).split('/')[1], 10) : xAccessor(item);
      var y = yAccessor(item);
      var yNode;

      // d3's Voronoi cannot handle NaN values
      if (isNaN(x)) {
        return;
      }
      xValues.push(x);

      // Handle case where yAccessor returns an object (as in candlestick)
      if (_.isObject(y) && _.keys(y).length > 0) {
        _.each(_.keys(y), (key) => {
          // d3's Voronoi cannot handle NaN values
          if (isNaN(y[key])) {
            return;
          }

          yValues.push(y[key]);
          // Handle candlestick, where multiple y points are to be plotted for a single x
          yNode = 0;
        });
      } else {
        if (isNaN(y)) {
          return;
        }

        yValues.push(y);
        yNode = y;
      }

      var xyCoords = `${ x }-${ yNode }`;

      if (xyCoords in coincidentCoordinateCheck) {
        // d3's Voronoi cannot handle coincident coords
        return;
      }

      // TODO(fw): is this necessary?
      coincidentCoordinateCheck[xyCoords] = '';

      var pointItem = {
        coord: {
          x: x,
          y: yNode,
        },
        id: `${ series.name }-${ idx }`
      };
      allValues.push(pointItem);
    });
  });

  return {
    allValues: allValues,
    xValues: xValues,
    yValues: yValues
  };
};


exports.shade = (hex, percent) => {

  var R, G, B, red, green, blue, number;
  var min = Math.min, round = Math.round;
  if(hex.length !== 7) { return hex; }
  number = parseInt(hex.slice(1), 16);
  R = number >> 16;
  G = number >> 8 & 0xFF;
  B = number & 0xFF;
  red = min( 255, round( ( 1 + percent ) * R )).toString(16);
  green = min( 255, round( ( 1 + percent ) * G )).toString(16);
  blue = min( 255, round( ( 1 + percent ) * B )).toString(16);
  return `#${ red }${ green }${ blue }`;

};
