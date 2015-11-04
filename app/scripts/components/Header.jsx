import React from 'react';
import ReactDOM from 'react-dom';
import PureRender from 'react-pure-render/function';
import Colors from '../utils/Colors';
import ScaleLog from '../utils/ScaleLog';
import config from '../config';
import Icon from './Icon';

class Header extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            ready: false
        };
    }

    static propTypes = {
        changeCategory: React.PropTypes.func.isRequired,
        changeTag: React.PropTypes.func.isRequired,
        onClickChangeColumns: React.PropTypes.func.isRequired,
        onClickChangeView: React.PropTypes.func.isRequired,
        onClickShowTagCloud: React.PropTypes.func.isRequired,
        onSearch: React.PropTypes.func.isRequired,
        state: React.PropTypes.object.isRequired,
        toggleCategoryMenu: React.PropTypes.func.isRequired,
        trackEvent: React.PropTypes.func.isRequired,
        visible: React.PropTypes.number.isRequired
    };

    shouldComponentUpdate = PureRender;

    componentDidMount () {
        let tags       = {},
            categories = {},
            vars       = {},
            fScale     = {
                min: 1,
                max: 0,
                unit: 'rem',
                maxSize: 4
            };

        if (config.features.categories) {
            this.props.state.logos.forEach((d) => {
                d.categories.forEach((t) => {
                    if (!categories.hasOwnProperty(t)) {
                        categories[t] = 0;
                    }
                    categories[t]++;
                });
            });

            categories = this._sortObject(categories, 'value').concat({
                key: 'everybody',
                title: 'everybody',
                value: this.props.state.logos.length
            });
        }

        if (config.features.tags) {
            this.props.state.logos.forEach((d) => {
                d.tags.forEach((t) => {
                    if (!tags.hasOwnProperty(t)) {
                        tags[t] = 0;
                    }
                    tags[t]++;
                });
            });

            tags = this._sortObject(tags, 'key');

            tags.forEach((t) => {
                if (t.value < fScale.min) {
                    fScale.min = t.value;
                }
                if (t.value > fScale.max) {
                    fScale.max = t.value;
                }
            });
        }

        vars.button = ReactDOM.findDOMNode(this.refs.twitterButton);
        vars.js = document.createElement('script');
        vars.js.id = 'twitter-wjs';
        vars.js.src = (/^http:/.test(document.location) ? 'http' : 'https') + '://platform.twitter.com/widgets.js';
        vars.button.parentNode.appendChild(vars.js);

        this.setState({
            categories,
            tags,
            ready: true,
            fontScale: new ScaleLog(fScale)
        });
    }

    _sortObject (obj, attr) {
        let arr = [];

        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                arr.push({
                    key: prop,
                    title: prop,
                    value: obj[prop]
                });
            }
        }
        if (attr === 'value') {
            arr.sort((a, b) => {
                return b.value - a.value;
            });
        }
        else {
            arr.sort((a, b) => {
                return a.key.toLowerCase().localeCompare(b.key.toLowerCase());
            }); //use this to sort as strings
        }

        return arr;
    }

    _onClickShowCategories (e) {
        e.preventDefault();
        let category = e.currentTarget.dataset.category;

        this.props.toggleCategoryMenu();
        this.props.trackEvent('categories', 'toggle', category !== 'categories' ? category : undefined);
    }

    _onClickChangeCategory (e) {
        e.preventDefault();

        let category = e.currentTarget.dataset.value;

        this.props.changeCategory(category);
        this.props.toggleCategoryMenu();
        this.props.trackEvent('category', 'click', category);
    }

    _onClickTag (e) {
        e.preventDefault();
        let tag = e.currentTarget.dataset.tag;

        this.props.changeTag(tag);

        this.setState({
            showTagCloud: false
        });
        this.props.trackEvent('tag', 'cloud', tag);
    }

    render () {
        let props      = this.props,
            state      = this.state,
            categories = state.categories,
            output     = {},
            style,
            classes;

        if (state.ready) {
            if (config.features.tags) {
                output.tagsMenu = (
                    <li className="menu__tags">
                        <a href="#" className={props.state.tag ? ' tagged' : ''}
                           onClick={props.onClickShowTagCloud}>{!props.state.tag ? <span><Icon
                            id="cloud" />Tags</span> :
                        <span>#{props.state.tag}<Icon id="times-circle" /></span>}</a>
                    </li>
                );
                output.tagCloud = (
                    <div className="tag-cloud" onClick={props.onClickShowTagCloud}>
                        <div className="tag-cloud__wrapper">
                            {state.tags.map((d, i) => {
                                style = {
                                    fontSize: state.fontScale.value(d.value)
                                    };
                                switch (Math.min(Math.ceil(d.value < 5 ? 0 : d.value / 10), 5)) {
                                    case 5:
                                        {
                                            classes = 'tag-size-5';
                                            break;
                                            }
                                    case 4:
                                        {
                                            classes = 'tag-size-4';
                                            break;
                                            }
                                    case 3:
                                        {
                                            classes = 'tag-size-3';
                                            break;
                                            }
                                    case 2:
                                        {
                                            classes = 'tag-size-2';
                                            break;
                                            }
                                    case 1:
                                        {
                                            classes = 'tag-size-1';
                                            break;
                                            }
                                    default:
                                        {
                                            classes = 'tag-size-0';
                                            break;
                                            }
                                    }

                                return (<a key={i} href="#" className={classes} data-tag={d.key}
                                           onClick={this._onClickTag.bind(this)}>#{d.key + ' (' + d.value + ')'}</a>
                                    );
                                })}
                        </div>
                    </div>
                );
            }

            if (config.features.categories) {
                if (props.state.category !== 'categories') {
                    categories = [{
                        key: 'categories',
                        title: <Icon id="level-up" />,
                        value: 0
                    }].concat(categories);
                }

                categories = (
                    <span className="categories__menu">
                        for<a href="#" className="categories__toggle" data-category={props.state.category}
                              onClick={this._onClickShowCategories.bind(this)}>{props.state.category !== 'categories' ? props.state.category : ''}
                        <Icon
                            id="navicon" /></a>
                        <ul>
                            {categories.map((d, i) => {
                                return (
                                <li key={i}
                                    className={(d.key === props.state.category ? 'active' : '') + (d.key === 'categories' ? ' faded' : '')}>
                                    <a href="#" onClick={this._onClickChangeCategory.bind(this)}
                                       data-value={d.key}>{d.title} {(d.value > 0 ? '(' + d.value + ')' : '')}</a>
                                </li>);
                                })}
                        </ul>
                    </span>
                );
            }
        }

        return (
            <header
                className={['main-header', props.state.categoryMenuVisible ? 'show-menu' : '', props.state.tagCloudVisible ? 'show-tags' : ''].join(' ')}>
                <a href="#" className="logo" data-value="logo" onClick={props.onClickChangeView}>
                    <img src="media/svg-porn.svg" />
                </a>
                <h3>{props.state.category === 'categories' ? props.state.logos.length : props.visible} high quality svg logos</h3>
                {categories}
                <ul className="menu">
                    {output.tagsMenu}
                    <li className="menu__columns">
                        <div className="switch">
                            <a href="#" className={props.state.columns < 2 ? 'disabled' : ''} data-column="-1"
                               onClick={props.onClickChangeColumns}>-</a>
                            <a href="#" className={props.state.columns > 4 ? 'disabled' : ''} data-column="1"
                               onClick={props.onClickChangeColumns}>+</a>
                        </div>
                        <div className="keyboard">or use your keyboard</div>
                    </li>
                    <li className="menu__search">
                        <div className="search-box">
                            <input type="text" name="search" value={props.state.search} onChange={props.onSearch} />
                            <span className="input-icon">{props.state.search ?
                            <a href="#" onClick={props.onSearch}><Icon id="times-circle" /></a> :
                            <Icon id="search" />}
                            </span>
                        </div>
                    </li>
                </ul>
                <div className="social">
                    <a href="https://twitter.com/svgporn" className="twitter-follow-button" data-show-count="false"
                       ref="twitterButton">Follow @svgporn</a>
                </div>
                {output.tagCloud}
                <div className="overlay" onClick={props.toggleCategoryMenu}></div>
                {props.state.heading ? <h3 className="heading">{props.state.heading}<br />
                    <a href="#" data-value="all" onClick={props.onClickChangeView}>View All</a>
                    <a href="#" data-value={props.state.favorites ? 'latest' : 'favorites'}
                       onClick={props.onClickChangeView}>{props.state.favorites ? 'Latest' : 'Favorites'}</a>
                </h3> : ''}
            </header>
        );
    }
}

export default Header;
