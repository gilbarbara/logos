import React from 'react';
import PureRender from 'react-pure-render/function';

class Logo extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            path: location.hostname === 'localhost' ? '../logos/' : 'http://svgporn.com/logos/'
        };
    }

    static propTypes = {
        hidden: React.PropTypes.bool.isRequired,
        image: React.PropTypes.string.isRequired,
        info: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func.isRequired,
        trackEvent: React.PropTypes.func.isRequired
    };

    shouldComponentUpdate = PureRender;

    toggleInfo (e) {
        let el = e.currentTarget;
        el.classList.toggle('show-info');
    }

    _onClickLogo (e) {
        this.props.trackEvent('logo', 'click', e.currentTarget.dataset.shortname);
    }

    render () {
        let props = this.props,
            info  = this.props.info;

        return (
            <li className={props.hidden ? 'hidden' : ''} onMouseEnter={this.toggleInfo} onMouseLeave={this.toggleInfo}
                data-updated={info.updated}>
                <a href={info.url} target="_blank" className="logo-item" data-shortname={info.shortname}
                   onClick={this._onClickLogo}>
                    <img src={this.state.path + this.props.image} alt={info.name} className={info.shortname} />
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
}

export default Logo;
