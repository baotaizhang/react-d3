'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Circle',

  propTypes: {
    id: React.PropTypes.string,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    r: React.PropTypes.number
  },

  getInitialState() {
    // state for animation usage
    return {
      circleRadius: this.props.r
    };
  },

  componentDidMount() {
    var props = this.props;

    // TODO(fw): Again?? See Line.jsx.
    // Also, again, circleRadius in state?

    // The circle reference is observed when both it is set to
    // active, and to inactive, so we have to check which one
    var unobserve = props.voronoiRef.observe(() => {
      var circleStatus = props.voronoiRef.cursor().deref();
      var seriesName = props.id.split('-')[0];

      if (circleStatus === 'active') {
        this._animateCircle(props.id);
        props.structure.cursor('voronoiSeries').cursor(seriesName).update(()=>'active');
      } else if (circleStatus === 'inactive') {
        this._restoreCircle(props.id);
        props.structure.cursor('voronoiSeries').cursor(seriesName).update(()=>'inactive');
      }
    });
  },

  componentWillUnmount() {
    this.props.voronoiRef.destroy();
  },

  _animateCircle(id) {
    this.setState({
      circleRadius: this.state.circleRadius * ( 5 / 4 )
    });
  },

  _restoreCircle(id) {
    this.setState({
      circleRadius: this.props.r
    });
  },

  render() {
    var props = this.props;

    return (
      <circle
        className='rd3-linechart-circle'
        id={props.id}
        cx={props.cx}
        cy={props.cy}
        r={this.state.circleRadius}
      />
    );
  }
});
