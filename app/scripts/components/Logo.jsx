var React = require('react/addons');

var Logo = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        info: React.PropTypes.object.isRequired
    },

    render: function () {
        var info = this.props.info;

        return (
            <li>
                <a href={info.url} target="_blank" className="logo-item">
                    <img src={'../logos/' + info.image} alt={info.name} className={info.shotname}/>
                    <span className="name">{info.name}</span>
                </a>
            </li>
        );
    }

});

module.exports = Logo;
