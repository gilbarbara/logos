var React  = require('react'),
    Isvg   = require('react-inlinesvg'),
    Header = require('./components/Header'),
    Footer = require('./components/Footer'),
    Loader = require('./components/Loader'),
    Logo   = require('./components/Logo'),
    json   = require('../logos.json');

var App = React.createClass({
    getInitialState () {
        return {
            columns: 3,
            logos: json.items,
            category: 'anyone'
        };
    },

    componentDidMount: function () {
        this
            .getDOMNode()
            .offsetParent
            .addEventListener('keypress', function (e) {
                var intKey = (window.Event) ? e.which : e.keyCode;

                if (intKey === 45 && this.state.columns > 1) {
                    this._changeColumns(this.state.columns - 1);
                }
                else if ((intKey === 43 || intKey === 61) && this.state.columns < 5) {
                    this._changeColumns(this.state.columns + 1);
                }
            }.bind(this));
    },

    _onClickChangeColumns (e) {
        e.preventDefault();
        var el  = e.currentTarget,
            col = +el.dataset.column;

        this._changeColumns(this.state.columns + col);
    },

    _onClickTag (e) {
        e.preventDefault();

        var el = e.currentTarget;
        console.log(el);
    },

    _selectCategory (value) {
        this.setState({
            category: value
        });
    },

    _changeColumns (num) {
        this.setState({
            columns: num
        });
    },

    _filterLogos (tag) {

    },

    render () {
        var state = this.state,
            hidden,
            logos = [],
            visible = 0;

        state.logos.forEach(function (d, i) {
            hidden =  state.category !== 'anyone' && d.categories.indexOf(state.category) === -1;
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
                            onClickChangeColumns={this._onClickChangeColumns} onClickTag={this._onClickTag}
                            category={state.category} selectCategory={this._selectCategory}/>
                    <main>
                        <ul className={'logos col-' + state.columns}>
                            {logos}
                        </ul>
                    </main>
                    <Footer />
                </div>
            </div>
        );
    }
});

module.exports = App;
