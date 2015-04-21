'use strict';

var React = require('react');
var d3 = require('d3');
var _ = require('lodash');
var Bar = require('./Bar');

/*
 * Takes an array of data objects, and renders a bar for that array. If more than one value
 * is passed in, graph will effectively be a 'stacked bar' graph;
 * if only one value is passed in, a standard bar graph will be rendered/
 */

module.exports = React.createClass({
  displayName: 'DataSeries',

  propTypes: {
    data: React.PropTypes.array,
    values: React.PropTypes.arrayOf(React.PropTypes.object),
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    padding: React.PropTypes.number,
    totalsHeight: React.PropTypes.number,
    totalsPadding: React.PropTypes.number,
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      padding: 0.1,
      data: []
    };
  },

  render() {
    var props = this.props;

    var xScale = d3.scale.ordinal()
      .domain(d3.range(props.values.length))
      .rangeRoundBands([0, props.width], props.padding);

    var bars = props.values.map(function(valObj, i) {
      return (
        <Bar
          key={i}
          data={valObj}
          total={props.data[i].total}
          width={xScale.rangeBand()}
          height={props.yScale(0) + props.yScale(_.sum(_.values(valObj)))}
          availableHeight={props.height}
          totalHeight={props.totalsHeight}
          offset={xScale(i)}
        />
      );
    });

    return (
      <g>{bars}</g>
    );
  }
});
