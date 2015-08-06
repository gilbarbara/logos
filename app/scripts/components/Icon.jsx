var React    = require('react/addons');

var Icon = React.createClass({
    mixins: [React.addons.PureRenderMixin],

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
