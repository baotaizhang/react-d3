'use strict';

var React = require('react');
var d3 = require('d3');
var Arc = require('./Arc');


module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    transform: React.PropTypes.string,
    data: React.PropTypes.array,
    innerRadius: React.PropTypes.number,
    radius: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      innerRadius: 0,
      data: []
    };
  },

  render() {
    var props = this.props;

    var pie = d3.layout
      .pie()
      .sort(null);

    var arcData = pie(props.data);

    var arcs = arcData.map((arc, i) => {
      return (
        <Arc
          key={i}
          startAngle={arc.startAngle}
          endAngle={arc.endAngle}
          innerRadius={props.innerRadius}
          outerRadius={props.radius}
          label={props.labels[i]}
          value={props.data[i]}
          width={props.width}
        />
      );
    });
    return (
      <g className='rd3-piechart-pie' transform={props.transform} >{arcs}</g>
    );
  }
});
