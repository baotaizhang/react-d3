'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Area',

  propTypes: {
    path: React.PropTypes.string
  },

  render() {
    var props = this.props;

    return (
      <path
        className="rd3-areachart-area"
        d={props.path}
        strokeWidth={2}
      />
    );
  }
});
