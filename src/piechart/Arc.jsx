'use strict';

var React = require('react');
var d3 = require('d3');


module.exports = React.createClass({

  displayName: 'Arc',

  propTypes: {
    d: React.PropTypes.string,
    startAngle: React.PropTypes.number,
    endAngle: React.PropTypes.number,
    innerRadius: React.PropTypes.number,
    outerRadius: React.PropTypes.number,
    label: React.PropTypes.string,
    value: React.PropTypes.number,
    width: React.PropTypes.number
  },

  render() {
    var props = this.props;
    var arc = d3.svg.arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle)
      .endAngle(props.endAngle);
    var rotate = `rotate(${ (props.startAngle+props.endAngle)/2 * (180/Math.PI) })`;
    var positions = arc.centroid();
    var radius = props.outerRadius;
    var dist   = radius + 35;
    var angle  = (props.startAngle + props.endAngle) / 2;
    var x      = dist * (1.2 * Math.sin(angle));
    var y      = -dist * Math.cos(angle);
    var t = `translate(${x},${y})`;

    var percentage = props.percentage;

    return (
      <g className='rd3-piechart-arc'>
        <path className={props.label + ' arc'}
          d={arc()}
        />
        <circle
          className='r3-piechart-circle'
          cx={arc.centroid()[0]}
          cy={arc.centroid()[1]}
          r='0.65em'
        />
        <text
          className='rd3-piechart-text'
          transform={`translate(${arc.centroid()})`}
          dy='.35em'
          style={{
            'shapeRendering': 'crispEdges',
            'textAnchor': 'middle'
          }}
        >
        {percentage ? props.value + '%' : props.value}
        </text>
      </g>
    );
  }
});
