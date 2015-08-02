var React = require('react/addons');

var Logo = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        hidden: React.PropTypes.bool.isRequired,
        image: React.PropTypes.string.isRequired,
        info: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func.isRequired
    },

    toggleInfo (e) {
        var el = e.currentTarget;
        el.classList.toggle('show-info');
    },

    render () {
        var props = this.props,
            info  = this.props.info;

        return (
            <li className={props.hidden ? 'hidden' : ''} onMouseEnter={this.toggleInfo} onMouseLeave={this.toggleInfo} data-added={info.added}>
                <a href={info.url} target="_blank" className="logo-item">
                    <img src={'../logos/' + this.props.image} alt={info.name} className={info.shotname}/>
                </a>

                <div className="info">
                    <h5><a href={info.url} target="_blank">{info.name}</a></h5>

                    <div className="tags">{
                        info.tags.map((t, i) => {
                            return (<a key={i} href="#" onClick={props.onClickTag} data-tag={t}>#{t}</a>);
                        })
                    }</div>
                </div>
            </li>
        );
    }

});

module.exports = Logo;
