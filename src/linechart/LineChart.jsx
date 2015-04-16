'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('../common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var Voronoi = common.Voronoi;
var utils = require('../utils');
var immstruct = require('immstruct');
var DataSeries = require('./DataSeries');
var mixins = require('../mixins');
var CartesianChartPropsMixin = mixins.CartesianChartPropsMixin;

/*
 * If you're using dates for the x-axis values pass 'xAxisIsDates',
 * and make sure that each data object's x value is either a Date() or moment() object
 * or moment-parsable date string with format "MM/DD/YYYY".
 * ....support for differently formatted dates will likely be an ongoing process.
 * ???(fw): do we want to keep accessor methods (d.x, d.y) as props, or
 * just define as d.x and d.y
 */

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin ],

  displayName: 'LineChart',

  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.object),
    xAxisIsDates: React.PropTypes.bool,
    displayDataPoints: React.PropTypes.bool,
    pointRadius: React.PropTypes.number,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      pointRadius: 3,
      interpolate: false,
      interpolationType: null,
      displayDataPoints: false,
      hoverAnimation: false
    };
  },

  render() {
    var props = this.props;

    var structure = immstruct('lineChart', { voronoi: {}, voronoiSeries: {}});
    var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor, props.xAxisIsDates);

    var allValues = flattenedData.allValues;
    var xValues = flattenedData.xValues;
    var yValues = flattenedData.yValues;

    var scales = utils.calculateScales(props.width, props.height, xValues, yValues);

    var dataSeriesArray = props.data.map( (series, idx) => {
      return (
          <DataSeries
            key={series.name}
            seriesName={series.name}
            data={series.values}
            structure={structure}
            width={props.width}
            height={props.height}
            xScale={scales.xScale}
            yScale={scales.yScale}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
            xAxisIsDates={props.xAxisIsDates}
            displayDataPoints={props.displayDataPoints}
            pointRadius={props.pointRadius}
            interpolationType={interpolationType}
          />
      );
    });

    return (
      <Chart
        data={props.data}
        viewBox={props.viewBox}
        width={props.width}
        height={props.height}
      >
        <g className='rd3-linechart'>
          {dataSeriesArray}
          {props.hoverAnimation ? <Voronoi
            structure={structure}
            data={allValues}
            xScale={scales.xScale}
            yScale={scales.yScale}
            width={innerWidth}
            height={innerHeight}
          /> : <g/> }
          <XAxis
            xAxisClassName='rd3-linechart-xaxis'
            width={props.width}
            height={props.height}
            xScale={scales.xScale}
            xOrient={props.xOrient}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
            xAxisTickCount={props.xAxisTickCount}
            tickFormatting={props.xAxisFormatter}
            xAxisIsDates={props.xAxisIsDates}
            strokeWidth={props.strokeWidth}
          />
          <YAxis
            yAxisClassName='rd3-linechart-yaxis'
            width={innerWidth}
            height={innerHeight}
            yScale={scales.yScale}
            yOrient={props.yOrient}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
            yAxisTickCount={props.yAxisTickCount}
            tickFormatting={props.yAxisFormatter}
          />
        </g>
      </Chart>
    );
  }

});
