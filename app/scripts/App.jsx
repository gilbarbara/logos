var React   = require('react'),
    Isvg    = require('react-inlinesvg'),
    Storage = require('./utils/Storage'),
    Header  = require('./components/Header'),
    Footer  = require('./components/Footer'),
    Loader  = require('./components/Loader'),
    Logo    = require('./components/Logo'),
    Icon    = require('./components/Icon'),
    json    = require('../logos.json');

var App = React.createClass({
    getInitialState () {
        return {
            category: 'everybody',
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
            tag: undefined
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
            category: 'everybody'
        });
    },

    _changeColumns (num) {
        this.setState({
            columns: num
        });
        Storage.setItem('columns', num);
    },

    _filterLogos (tag) {

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
            hidden,
            logos   = [],
            visible = 0;

        state.logos.forEach(function (d, i) {
            if (state.tag) {
                hidden = d.tags.indexOf(state.tag) === -1;
            }
            else {
                hidden = state.category !== 'everybody' && d.categories.indexOf(state.category) === -1;
            }
            d.files.forEach(function (f, j) {
                logos.push(<Logo key={i + '-' + j} info={d} image={f} hidden={hidden} onClickTag={this._onClickTag}/>);

                if (!hidden) {
                    visible++;
                }
            }, this);
        }, this);

        return (
            <div className="app">
                <Isvg src="../media/icons.svg" uniquifyIDs={false}/>

                <div className="container">
                    <Header logos={state.logos} columns={state.columns} visible={visible}
                            onClickChangeColumns={this._onClickChangeColumns}
                            onClickShowTagCloud={this._onClickShowTags} tagCloudVisible={this.state.tagCloudVisible}
                            changeTag={this._changeTag} tag={this.state.tag}
                            toggleCategoryMenu={this._toggleCategoryMenuVisibility}
                            categoryMenuVisible={this.state.categoryMenuVisible}
                            category={state.category} changeCategory={this._changeCategory}/>
                    <main>
                        <ul className={'logos col-' + state.columns}>
                            {logos}
                        </ul>
                    </main>
                    <Footer />
                </div>
                <a href="#" onClick={this._scrollTop} className={'scroll-top' + (this.state.scrollable ? ' visible' : '')}><Icon id="caret-up"/></a>
            </div>
        );
    }
});

module.exports = App;
