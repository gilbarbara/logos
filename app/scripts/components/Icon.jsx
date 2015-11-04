var React           = require('react'),
    PureRenderMixin = require('react-addons-pure-render-mixin');

var Icon = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
        id: React.PropTypes.string.isRequired
    },

    render () {
        return (
            <svg className="icon" role="img"
                 dangerouslySetInnerHTML={{ __html: '<use xlink:href="#' + this.props.id + '"></use>' }} />
        );
    }

});

module.exports = Icon;
