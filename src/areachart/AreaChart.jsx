'use strict';

var React = require('react');
var d3 = require('d3');
var _ = require('lodash');
var common = require('../common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var DataSeries = require('./DataSeries');
var CartesianChartPropsMixin = require('../mixins').CartesianChartPropsMixin;

var XAXIS_HEIGHT = 40;
var XAXIS_PADDING = 10;
var YAXIS_PADDING = 10;

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin ],

  displayName: 'AreaChart',

  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getDefaultProps() {
    return {
      xAxisTickInterval: {unit: 'day', interval: 1}
    };
  },

  render() {
    var props = this.props;

    var xValues = [];
    var yValues = [];

    _.each(props.data, (series) => {
      _.each(series.values, (val, idx) => {
        xValues.push(props.xAccessor(val));
        yValues.push(props.yAccessor(val));
      });
    });

    var xScale = xValues.length > 0 && _.isDate(xValues[0]) ?
      d3.time.scale().range([0, props.width - XAXIS_PADDING]) : d3.scale.linear().range([0, props.width]);

    // Chart needs to allow room for x-axis labels
    var maxChartHeight = props.height - (XAXIS_HEIGHT + YAXIS_PADDING);
    var yScale = d3.scale.linear().range([maxChartHeight, 0]);

    xScale.domain(d3.extent(xValues));
    yScale.domain(d3.extent(yValues));

    // TODO(fw): not 100% sure about the necessity of the
    // offset and order
    var stack = d3.layout.stack()
      .x(props.xAccessor)
      .y(props.yAccessor)
      .offset('zero')
      .order('default')
      .values((d) => {
        return d.values;
      });

    var layers = stack(props.data);

    var dataSeries = layers.map( (d, idx) => {
      return (
        <DataSeries
          key={idx}
          index={idx}
          data={d.values}
          xScale={xScale}
          yScale={yScale}
          xAccessor={props.xAccessor}
          yAccessor={props.yAccessor}
        />
      );
    });

    return (
      <Chart
        viewBox={props.viewBox}
        data={props.data}
        width={props.width}
        height={props.height}
      >
        <g className='rd3-areachart'>
          {dataSeries}
          <XAxis
            width={props.width}
            height={props.height - (XAXIS_HEIGHT + XAXIS_PADDING)}
            xScale={xScale}
            xAxisLabel={props.xAxisLabel}
            xAxisLeftOffset={0}
            xAxisTickInterval={props.xAxisTickInterval}
            tickFormatting={props.xAxisFormatter}
            xAxisClassName='rd3-areachart-xaxis'
          />
        </g>
      </Chart>
    );
  }

});
