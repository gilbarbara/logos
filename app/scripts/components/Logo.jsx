var React = require('react/addons');

var Logo = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        info: React.PropTypes.object.isRequired
    },

    toggleInfo (e) {
        var el = e.currentTarget;
        el.parentNode.classList.toggle('visible');
    },

    render () {
        var info = this.props.info;

        return (
            <li>
                <a href={info.url} target="_blank" className="logo-item">
                    <img src={'../logos/' + info.image} alt={info.name} className={info.shotname}
                         onMouseEnter={this.toggleInfo} onMouseLeave={this.toggleInfo}/>
                    <span className="name">{info.name}</span>
                </a>
            </li>
        );
    }

});

module.exports = Logo;
