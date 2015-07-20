var React  = require('react'),
    Header = require('./components/Header'),
    Footer = require('./components/Footer'),
    Loader = require('./components/Loader'),
    Logo   = require('./components/Logo'),
    json   = require('../logos.json');

var App = React.createClass({
    getInitialState () {
        return {
            logos: json.items,
            columns: 3
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

        var el  = e.currentTarget;

        console.log(el);
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
            logos = [];

        state.logos.forEach(function (d, i) {
            d.files.forEach(function (f, j) {
                logos.push(<Logo key={i + '-' + j} info={{
                    name: d.name,
                    shortname: d.shortname,
                    url: d.url,
                    image: f
                }}/>);
            });
        });

        return (
            <div className="app">
                <div className="container">
                    <Header logos={state.logos} columns={state.columns}
                            onClickChangeColumns={this._onClickChangeColumns}
                            onClickTag={this._onClickTag}/>
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
