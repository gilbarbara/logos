var React = require('react');

var Icon = React.createClass({

    propTypes: {
        id: React.PropTypes.string.isRequired
    },

    render () {
        return (
            <svg className="icon" role="img" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#' + this.props.id + '"></use>' }} />
        );
    }

});

module.exports = Icon;
