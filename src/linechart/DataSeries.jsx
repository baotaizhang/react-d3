'use strict';

var React = require('react');
var d3 = require('d3');
var Line = require('./Line');
var Circle = require('./Circle');
var moment = require('moment');


module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    data: React.PropTypes.array,
    interpolationType: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    xAxisIsDates: React.PropTypes.bool,
    displayDataPoints: React.PropTypes.bool.isRequired
  },

  getDefaultProps() {
    return {
      data: [],
      interpolationType: 'linear',
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
      xAxisIsDates: false
    };
  },

  render() {
    var props = this.props;

    // Create and map over array of paths to generate SVG lines
    var interpolatePath = d3.svg.line()
        .y((d) => {
          return props.yScale(props.yAccessor(d));
        })
        .x((d) => {
          return props.xAxisIsDates ?
            props.xScale(props.xAccessor(d).split('/')[1]) :
            props.xScale(props.xAccessor(d));
        })
        .interpolate(props.interpolationType);

    // Create an immstruct reference for series name and set it to 'inactive'
    props.structure.cursor('voronoiSeries').set(props.seriesName, 'inactive');

    // Pass on the Voronoi reference to the line and circle components
    var voronoiSeriesRef = props.structure.reference(['voronoiSeries', props.seriesName]);

    // TODO(fw): remove this?? I don't think we'll ever want these?
    var circles = null;
    if (props.displayDataPoints) {
      // Map over data to generate SVG circles at data points
      // if datum is a date object, treat it a bit differently
      circles = props.data.map((point, i) => {
        var cx = this._isDate(point, props.xAccessor) ?
          props.xScale(props.xAccessor(point).getTime()) : cx = props.xScale(props.xAccessor(point));

        var cy = this._isDate(point, props.yAccessor) ?
          props.yScale(props.yAccessor(point).getTime()) : props.yScale(props.yAccessor(point));

        var id = props.seriesName + '-' + i;
        // Create an immstruct reference for the circle id
        // and set it to 'inactive'
        props.structure.cursor('voronoi').set(id, 'inactive');

        // Pass the Voronoi circle id to the circle component,
        // where it will be observed and dereferenced
        var voronoiRef = props.structure.reference(['voronoi', id]);

        return (
          <Circle
            key={props.seriesName + i}
            id={id}
            structure={props.structure}
            cx={cx}
            cy={cy}
            r={props.pointRadius}
            voronoiRef={voronoiRef}
            voronoiSeriesRef={voronoiSeriesRef}
          />
        );
      }, this);
    }

    return (
      <g>
        <Line
          seriesName={props.seriesName}
          path={interpolatePath(props.data)}
          voronoiSeriesRef={voronoiSeriesRef}
        />
        {circles}
      </g>
    );
  }

});
