var React           = require('react'),
    PureRenderMixin = require('react-addons-pure-render-mixin'),
    Isvg            = require('react-inlinesvg'),
    _               = require('lodash'),
    Header          = require('./components/Header'),
    Footer          = require('./components/Footer'),
    Loader          = require('./components/Loader'),
    Logo            = require('./components/Logo'),
    Icon            = require('./components/Icon'),
    Colors          = require('./utils/Colors'),
    Storage         = require('./utils/Storage'),
    json            = require('../logos.json');

var searchTimeout;

var App = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState () {
        return {
            category: 'categories',
            categoryMenuVisible: false,
            columns: 3,
            favorites: false,
            logos: json.items,
            tag: undefined,
            tagCloudVisible: false
        };
    },

    componentWillMount: function () {
        var category = Storage.getItem('category'),
            columns  = Storage.getItem('columns');

        this.setState({
            category: category && category !== 'everybody' && this.state.category !== category ? category : this.state.category,
            columns: columns && this.state.columns !== columns ? columns : this.state.columns
        });

        if (location.hash === '#fav') {
            this.setState({
                favorites: true
            });
        }
    },

    componentDidMount: function () {
        document.body.addEventListener('keydown', function (e) {
            var intKey = (window.Event) ? e.which : e.keyCode,
                action;

            if ((intKey === 189 || intKey === 109) && this.state.columns > 1) {
                this._changeColumns(this.state.columns - 1);
                action = 'column-down';
            }

            if ((intKey === 187 || intKey === 107) && this.state.columns < 5) {
                this._changeColumns(this.state.columns + 1);
                action = 'column-up';
            }
            if (intKey === 27) {
                if (this.state.tagCloudVisible) {
                    this._toggleTagCloudVisibility();
                }

                if (this.state.categoryMenuVisible) {
                    this._toggleCategoryMenuVisibility();
                }
                action = 'escape';
            }

            if (action) {
                this._trackEvent('keyboard', 'press', action);
            }

        }.bind(this));

        window.addEventListener('scroll', function (e) {
            if ((document.body.scrollTop >= 1000 && document.body.clientHeight > 4000) && !this.state.tagCloudVisible && !this.state.scrollable) {
                this.setState({
                    scrollable: true
                });
            }
            else if (e.target.body.scrollTop < 1000 && this.state.scrollable) {
                this.setState({
                    scrollable: false
                });
            }
        }.bind(this));
    },

    _trackEvent (category, type, label) {
        //heap.track(category, {[type]: label});
        var options = {
            eventCategory: category,
            eventAction: type
        };

        if (label) {
            options.eventLabel = label;
        }

        ga('send', 'event', options);
    },

    _onClickChangeColumns (e) {
        e.preventDefault();
        var el  = e.currentTarget,
            col = +el.dataset.column;

        this._changeColumns(this.state.columns + col);
        this._trackEvent('switch', 'click', col > 0 ? 'up' : 'down');
    },

    _changeColumns (num) {
        this.setState({
            columns: num
        });
        Storage.setItem('columns', num);
    },

    _onClickChangeView (e) {
        e.preventDefault();
        var type = e.currentTarget.dataset.value;

        this._changeCategory(type === 'all' ? 'everybody' : 'categories');
        this.setState({
            favorites: type === 'favorites'
        });

        this._trackEvent('view', 'click', type);
    },

    _changeCategory (value) {
        this.setState({
            category: value,
            favorites: false,
            tag: undefined,
            search: undefined
        });

        if (value !== 'everybody') {
            Storage.setItem('category', value);
        }
    },

    _toggleCategoryMenuVisibility  () {
        document.body.style.overflow = !this.state.categoryMenuVisible ? 'hidden' : 'auto';
        this.setState({
            categoryMenuVisible: !this.state.categoryMenuVisible
        });
    },

    _onClickTag (e) {
        e.preventDefault();
        var tag = e.currentTarget.dataset.tag || undefined;

        document.body.style.overflow = !this.state.tagCloudVisible ? 'hidden' : 'auto';
        this._changeTag(tag);
        this._trackEvent('tag', 'info', tag);
    },

    _onClickShowTags (e) {
        if (e) {
            e.preventDefault();
        }

        if (this.state.tag) {
            this.setState({
                tag: undefined
            });
            this._trackEvent('tag-cloud', 'hide', this.state.tag);
        }
        else {
            this._toggleTagCloudVisibility();
            this._trackEvent('tag-cloud', 'show');
        }
    },

    _toggleTagCloudVisibility  () {
        document.body.style.overflow = !this.state.tagCloudVisible ? 'hidden' : 'auto';
        this.setState({
            tagCloudVisible: !this.state.tagCloudVisible
        });
    },

    _changeTag (tag) {
        document.body.style.overflow = 'auto';
        this._scrollTo(document.body, 0, window.scrollY / 10 < 500 ? window.scrollY / 10 : 500);

        this.setState({
            category: 'categories',
            favorites: false,
            search: undefined,
            tag,
            tagCloudVisible: false
        });
    },

    _searchLogos (e) {
        var search;
        if (typeof e === 'object') {
            if (e.type === 'click') {
                e.preventDefault();
                e.currentTarget.parentNode.previousSibling.focus();
            }
            else if (e.type === 'input') {
                search = e.target.value;
            }
        }

        if (search && search.length > 1) {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(function () {
                this._trackEvent('search', 'submit', search);
            }.bind(this), 500);
        }

        this.setState({
            category: 'categories',
            favorites: false,
            search: search || undefined,
            tag: undefined
        });
    },

    _scrollTo (element = document.body, to = 0, duration = document.body.scrollTop) {
        duration = duration / 10 < 500 ? duration : 500;

        var difference = to - element.scrollTop,
            perTick    = difference / duration * 10,
            timeout;

        if (duration < 0) {
            clearTimeout(timeout);
            return;
        }

        timeout = setTimeout(function () {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) {
                clearTimeout(timeout);
            }
            this._scrollTo(element, to, duration - 10);
        }.bind(this), 10);
    },

    _scrollTop (e) {
        e.preventDefault();

        this._scrollTo(document.body, 0, window.scrollY / 10 < 500 ? window.scrollY / 10 : 500);
        this._trackEvent('scroll', 'click');
    },

    render () {
        var state     = this.state,
            hidden    = false,
            db        = state.logos,
            latest    = (state.category === 'categories' && !state.tag && !state.search),
            favorites = (state.favorites && state.category === 'categories' && !state.tag && !state.search),
            heading   = favorites ? 'Favorites' : (latest ? 'Latest additions' : ''),
            logos     = [],
            visible   = 0;

        if (favorites) {
            db = _.filter(json.items, 'favorite', true);
        }
        else if (latest) {
            db = _.chain(json.items).sortByOrder(['updated', 'name'], ['desc', 'asc']).take(50).value();
        }

        db.forEach(function (d, i) {
            if (state.search) {
                hidden = !d.name.match(new RegExp(state.search, 'i'));
            }
            else if (state.tag) {
                hidden = d.tags.indexOf(state.tag) === -1;
            }
            else if (state.category !== 'categories' && state.category !== 'everybody') {
                hidden = d.categories.indexOf(state.category) === -1;
            }

            d.files.forEach(function (f, j) {
                logos.push(
                    <Logo key={i + '-' + j} info={d} image={f} hidden={hidden}
                          onClickTag={this._onClickTag} trackEvent={this._trackEvent} />
                );
            }, this);

            if (!hidden) {
                visible++;
            }
        }, this);

        logos.push(<li key="nothing" className="nothing">Nothing Found</li>);

        return (
            <div className="app">
                <Isvg src="media/icons.svg" uniquifyIDs={false} />

                <div className="container">
                    <Header state={{
                        logos: state.logos,
                        category: state.category,
                        categoryMenuVisible: state.categoryMenuVisible,
                        columns: state.columns,
                        favorites: favorites,
                        heading: heading,
                        search: state.search,
                        tag: state.tag,
                        tagCloudVisible: state.tagCloudVisible
                    }} visible={visible} onClickChangeColumns={this._onClickChangeColumns}
                            onSearch={this._searchLogos} changeCategory={this._changeCategory}
                            toggleCategoryMenu={this._toggleCategoryMenuVisibility}
                            onClickShowTagCloud={this._onClickShowTags} changeTag={this._changeTag}
                            trackEvent={this._trackEvent} onClickChangeView={this._onClickChangeView} />
                    <main>
                        <ul className={'logos col-' + state.columns + (!visible ? ' empty' : '')}>
                            {logos}
                        </ul>
                    </main>
                    <Footer />
                </div>
                <a href="#" onClick={this._scrollTop}
                   className={'scroll-top' + (state.scrollable ? ' visible' : '')}><Icon id="caret-up" /></a>
            </div>
        );
    }
});

module.exports = App;
