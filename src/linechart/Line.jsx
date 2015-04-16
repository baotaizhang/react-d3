'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Line',

  propTypes: {
    data: React.PropTypes.object,
    path: React.PropTypes.string,
    strokeWidth: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      strokeWidth: 1.5
    };
  },

  getInitialState() {
    // state for animation usage
    return {
      lineStrokeWidth: this.props.strokeWidth
    };
  },

  componentDidMount() {
    var props = this.props;

    // TODO(fw): ???
    // Also see below. What is use-case for line width being state?

    // The circle reference is observed when both it is set to
    // active, and to inactive, so we have to check which one
    var unobserve = props.voronoiSeriesRef.observe(() => {
      var lineStatus = props.voronoiSeriesRef.cursor().deref();
      if (lineStatus === 'active') {
        this._animateLine(props.id);
      } else if (lineStatus === 'inactive') {
        this._restoreLine(props.id);
      }
    });
  },

  componentWillUnmount() {
    this.props.voronoiSeriesRef.destroy();
  },

  _animateLine(id) {
    this.setState({
      lineStrokeWidth: this.state.lineStrokeWidth * 1.8
    });
  },

  _restoreLine(id) {
    this.setState({
      lineStrokeWidth: this.props.strokeWidth
    });
  },

  render() {
    console.log("PATH: ", this.props.path);
    var props = this.props;
    var state = this.state;
    return (
      <path
        className='rd3-linechart-path'
        d={props.path}
        strokeWidth={state.lineStrokeWidth}
      />
    );
  }

});
