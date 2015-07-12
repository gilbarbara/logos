var React  = require('react'),
    Header = require('./components/Header'),
    Footer = require('./components/Footer'),
    Loader = require('./components/Loader'),
    Logo   = require('./components/Logo'),
    json   = require('../logos.json');

var App = React.createClass({
    getInitialState () {
        return {
            logos: json.items
        };
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
                    <Header logos={state.logos}/>
                    <main>

                        <ul className="logos">
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
