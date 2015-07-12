var React = require('react/addons');

var Header = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        logos: React.PropTypes.array.isRequired
    },

    render: function () {
        var props = this.props;

        return (
            <header>
                <img src="media/svg-porn.svg" className="logo"/>

                <h3>A collection of svg logos for developers.</h3>
            </header>
        );
    }

});

module.exports = Header;
