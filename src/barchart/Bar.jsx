'use strict';

var React = require('react');
var _ = require('lodash');


var TOTAL_RADIUS = '10px';

module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    total: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    availableHeight: React.PropTypes.number,
    totalHeight: React.PropTypes.number,
    offset: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      offset: 0
    };
  },

  render() {
    var props = this.props;
    var cumulativeHeight = 0;
    var totalAvailableHeight

    var barSeries = _.map(_.values(props.data), (datum, i) => {
      var height = props.height > 0 ? props.height * (datum / _.sum(_.values(props.data))) : 0;
      cumulativeHeight += height;

      return (
        <rect
          key={i}
          width={props.width}
          height={height}
          x={props.offset}
          y={props.availableHeight - cumulativeHeight}
          className={'rd3-barchart-bar ' + _.keys(props.data)[i]}
        />
      );
    });

    var totalXOffset = props.offset + (props.width / 2);
    var totalYOffset = props.availableHeight - (cumulativeHeight + props.totalHeight);

    return (
      <g>
        <circle
          className='r3-bar-circle'
          cx={totalXOffset}
          cy={totalYOffset}
          r={TOTAL_RADIUS}
        />
        <text
          className='rd3-bar-text'
          transform={`translate(${totalXOffset}, ${totalYOffset})`}
          dy='.35em'
          style={{
            'shapeRendering': 'crispEdges',
            'textAnchor': 'middle'
          }}
        >{props.total}</text>
        {barSeries}
      </g>
    );
  }
});
