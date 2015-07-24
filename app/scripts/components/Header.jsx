var React    = require('react/addons'),
    lodash   = require('lodash'),
    Colors   = require('../utils/Colors'),
    ScaleLog = require('../utils/ScaleLog'),
    config   = require('../config'),
    Icon     = require('./Icon');

var Header = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        columns: React.PropTypes.number.isRequired,
        logos: React.PropTypes.array.isRequired,
        onClickChangeColumns: React.PropTypes.func.isRequired,
        onClickTag: React.PropTypes.func.isRequired,
        changeCategory: React.PropTypes.func.isRequired,
        visible: React.PropTypes.number.isRequired
    },

    getInitialState () {
        return {
            ready: false,
            showCategoriesMenu: false
        };
    },

    componentDidMount () {
        let tags       = {},
            categories = {},
            fScale     = {
                min: 1,
                max: 0,
                unit: 'rem'
            };

        if (config.features.categories) {
            this.props.logos.forEach(function (d) {
                d.categories.forEach(function (t) {
                    if (!categories.hasOwnProperty(t)) {
                        categories[t] = 0;
                    }
                    categories[t]++;
                });
            });

            categories = [{key: 'anyone', value: 0}].concat(this._sortObject(categories, 'value'));
        }

        if (config.features.tags) {
            this.props.logos.forEach(function (d) {
                d.tags.forEach(function (t) {
                    if (!tags.hasOwnProperty(t)) {
                        tags[t] = 0;
                    }
                    tags[t]++;
                });
            });

            tags = this._sortObject(tags, 'value');
            tags.forEach((t) => {
                if (t.value < fScale.min) {
                    fScale.min = t.value;
                }
                if (t.value > fScale.max) {
                    fScale.max = t.value;
                }
            });
        }

        this.setState({
            categories,
            tags,
            ready: true,
            fontScale: new ScaleLog(fScale),
            colorScale: new ScaleLog({ minSize: 12, min: fScale.min, maxSize: 70, max: fScale.max }),
            color: new Colors('#ffced3')
        });
    },

    _sortObject (obj, attr) {
        var arr = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                arr.push({
                    key: prop,
                    value: obj[prop]
                });
            }
        }
        if (attr === 'value') {
            arr.sort(function (a, b) {
                return b.value - a.value;
            });
        }
        else {
            arr.sort(function (a, b) {
                return a.key.toLowerCase().localeCompare(b.key.toLowerCase());
            }); //use this to sort as strings
        }

        return arr;
    },

    _onClickShowCategories (e) {
        e.preventDefault();

        this._toggleCategoriesMenu();
    },

    _onClickChangeCategory (e) {
        e.preventDefault();

        var el = e.currentTarget;

        this.props.changeCategory(el.dataset.value);
        this._toggleCategoriesMenu();
    },

    _toggleCategoriesMenu () {
        this.setState({
            showCategoriesMenu: !this.state.showCategoriesMenu
        });
    },

    render () {
        var props      = this.props,
            state      = this.state,
            categories = props.category,
            tags,
            style;

        if (state.ready) {
            if (config.features.tags) {
                tags = (
                    <div className="tag-cloud">
                        {state.tags.map((d, i) => {
                            style = {
                                backgroundColor: state.color.hsl2hex({
                                    h: state.color.hue(),
                                    s: state.color.saturation(),
                                    l: state.color.lightness() - +state.colorScale.value(d.value)
                                }),
                                fontSize: state.fontScale.value(d.value)
                            };
                            return (<a key={i} href="#" data-tag={d.key} onClick={this.props.onClickTag}
                                       style={style}>{d.key + ' (' + d.value + ')'}</a>
                            );
                        })}
                    </div>
                );
            }

            if (config.features.categories) {
                categories = (
                    <span className="categories">
                    <a href="#" className="categories__toggle"
                       onClick={this._onClickShowCategories}>{props.category} <Icon id="caret-down"/></a>
                    <ul className="categories__menu">
                        {state.categories.map((d, i) => {
                            return (<li key={i}><a href="#" onClick={this._onClickChangeCategory} data-value={d.key}>{d.key}
                            {d.key === props.category ? <Icon id="check"/> : ''}</a></li>);
                        })}
                    </ul>
                </span>
                );
            }
        }

        return (
            <header className={state.showCategoriesMenu ? 'show-menu' : ''}>
                <img src="media/svg-porn.svg" className="logo"/>

                <h3>A collection of {props.visible} svg logos for {categories}</h3>

                <ul className="menu">
                    <li><span className="title">Columns</span>

                        <div className="switch">
                            <a href="#" className={props.columns < 2 ? 'disabled' : ''} data-column="-1"
                               onClick={props.onClickChangeColumns}>-</a>
                            <a href="#" className={props.columns > 4 ? 'disabled' : ''} data-column="1"
                               onClick={props.onClickChangeColumns}>+</a>
                        </div>
                        <span className="keyboard">or use your keyboard</span>
                    </li>
                </ul>
                {tags}
                <div className="overlay" onClick={this._toggleCategoriesMenu}></div>
            </header>
        );
    }
});

module.exports = Header;
