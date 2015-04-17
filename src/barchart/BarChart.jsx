'use strict';

var React = require('react');
var d3 = require('d3');
var _ = require('lodash');
var DataSeries = require('./DataSeries');
var common = require('../common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var mixins = require('../mixins');
var CartesianChartPropsMixin = mixins.CartesianChartPropsMixin;

/*
 * Takes an array of objects with 'label' and 'value' keys.
 * Additional props are handled via the CartesianChartPropsMixin
 */

var XAXIS_HEIGHT = 20;
var TOTALS_HEIGHT = 20;
var TOTALS_PADDING = 10;

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin ],

  displayName: 'BarChart',

  propTypes: {
    title: React.PropTypes.string,
    data: React.PropTypes.arrayOf(React.PropTypes.object),
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      yAxisTickCount: 4,
      margins: {top: 10, right: 20, bottom: 40, left: 30}
    };
  },

  render() {
    var props = this.props;

    var labels = _.pluck(props.data, 'label');
    var values = _.pluck(props.data, 'value');
    var valueTotals = _.pluck(props.data, 'total');
    var chartHeight = props.height - (XAXIS_HEIGHT + TOTALS_HEIGHT + TOTALS_PADDING);

    var yScale = d3.scale.linear()
      .domain([d3.min([d3.min(valueTotals), 0]), d3.max(valueTotals)])
      .range([0, chartHeight]);

    var xScale = d3.scale.ordinal()
      .domain(labels)
      .rangeRoundBands([0, props.width]);

    return (
      <Chart
        title={props.title}
        width={props.width}
        height={props.height + XAXIS_HEIGHT}
      >
        <g className='rd3-barchart'>
          <DataSeries
            data={props.data}
            values={values}
            width={props.width}
            height={chartHeight + TOTALS_HEIGHT + TOTALS_PADDING}
            yScale={yScale}
            totalsHeight={TOTALS_HEIGHT}
          />
        </g>
        <XAxis
          data={props.data}
          width={props.width}
          height={props.height - XAXIS_HEIGHT}
          xScale={xScale}
          xAxisLabel={props.xAxisLabel}
          xAxisOffset={0}
          xAxisClassName='rd3-barchart-xaxis'
        />
      </Chart>
    );
  }

});
