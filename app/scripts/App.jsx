var React   = require('react/addons'),
    Isvg    = require('react-inlinesvg'),
    _       = require('lodash'),
    Header  = require('./components/Header'),
    Footer  = require('./components/Footer'),
    Loader  = require('./components/Loader'),
    Logo    = require('./components/Logo'),
    Icon    = require('./components/Icon'),
    Storage = require('./utils/Storage'),
    json    = require('../logos.json');

var App = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    getInitialState () {
        return {
            category: undefined,
            categoryMenuVisible: false,
            columns: 3,
            logos: json.items,
            tag: undefined,
            tagCloudVisible: false
        };
    },

    componentWillMount: function () {
        var category = Storage.getItem('category'),
            columns  = Storage.getItem('columns');

        this.setState({
            category: category && this.state.category !== category ? category : this.state.category,
            columns: columns && this.state.columns !== columns ? columns : this.state.columns
        });
    },

    componentDidMount: function () {
        document.body.addEventListener('keydown', function (e) {
            var intKey = (window.Event) ? e.which : e.keyCode;

            if ((intKey === 189 || intKey === 109) && this.state.columns > 1) {
                this._changeColumns(this.state.columns - 1);
            }

            if ((intKey === 187 || intKey === 107) && this.state.columns < 5) {
                this._changeColumns(this.state.columns + 1);
            }
            if (intKey === 27) {
                if (this.state.tagCloudVisible) {
                    this._toggleTagCloudVisibility();
                }

                if (this.state.categoryMenuVisible) {
                    this._toggleCategoryMenuVisibility();
                }
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

    _onClickChangeColumns (e) {
        e.preventDefault();
        var el  = e.currentTarget,
            col = +el.dataset.column;

        this._changeColumns(this.state.columns + col);
    },

    _changeCategory (value) {
        this.setState({
            category: value,
            tag: undefined,
            search: undefined
        });
        Storage.setItem('category', value);
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
    },

    _onClickShowTags (e) {
        if (e) {
            e.preventDefault();
        }

        if (this.state.tag) {
            this.setState({
                tag: undefined
            });
        }
        else {
            this._toggleTagCloudVisibility();
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
            tag,
            tagCloudVisible: false,
            category: '',
            search: undefined
        });
    },

    _changeColumns (num) {
        this.setState({
            columns: num
        });
        Storage.setItem('columns', num);
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

        this.setState({
            category: '',
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
    },

    render () {
        var state   = this.state,
            hidden = false,
            db = state.logos,
            logos   = [],
            visible = 0;

        if (location.hash === '#latest' || !state.category) {
            db = _.chain(json.items).sortByOrder(['added', 'name'], ['desc', 'asc']).take(50).value();
        }

        db.forEach(function (d, i) {
            if (state.search) {
                hidden = d.name.toLowerCase().indexOf(state.search) === -1;
            }
            else if (state.tag) {
                hidden = d.tags.indexOf(state.tag) === -1;
            }
            else if (state.category && state.category !== 'everybody') {
                hidden = d.categories.indexOf(state.category) === -1;
            }

            d.files.forEach(function (f, j) {
                logos.push(<Logo key={i + '-' + j} info={d} image={f} hidden={hidden} onClickTag={this._onClickTag}/>);

                if (!hidden) {
                    visible++;
                }
            }, this);
        }, this);

        logos.push(<li key="nothing" className="nothing">Nothing Found</li>);

        return (
            <div className="app">
                <Isvg src="../media/icons.svg" uniquifyIDs={false}/>

                <div className="container">
                    <Header state={{
                        logos: state.logos,
                        category: state.category,
                        categoryMenuVisible: state.categoryMenuVisible,
                        columns: state.columns,
                        search: state.search,
                        tag: state.tag,
                        tagCloudVisible: state.tagCloudVisible
                    }} visible={visible} onClickChangeColumns={this._onClickChangeColumns}
                            onSearch={this._searchLogos} changeCategory={this._changeCategory}
                            toggleCategoryMenu={this._toggleCategoryMenuVisibility}
                            onClickShowTagCloud={this._onClickShowTags} changeTag={this._changeTag}
                        />
                    <main>
                        <ul className={'logos col-' + state.columns + (!visible ? ' empty' : '')}>
                            {logos}
                        </ul>
                    </main>
                    <Footer />
                </div>
                <a href="#" onClick={this._scrollTop}
                   className={'scroll-top' + (state.scrollable ? ' visible' : '')}><Icon id="caret-up"/></a>
            </div>
        );
    }
});

module.exports = App;