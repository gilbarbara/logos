var React    = require('react/addons'),
    ScaleLog = require('../utils/scaleLog'),
    config   = require('../config');

var Header = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        logos: React.PropTypes.array.isRequired
    },

    componentWillMount () {
        let tags  = {},
            sizer = {
                min: 1,
                max: 0
            };

        if (config.features.tags) {
            this.props.logos.forEach(function (d) {
                d.tags.forEach(function (t) {
                    if (!tags.hasOwnProperty(t)) {
                        tags[t] = 0;
                    }
                    tags[t]++;
                });
            });

            tags = this.sortObject(tags);

            tags.forEach((t) => {
                if (t.value < sizer.min) {
                    sizer.min = t.value;
                }
                if (t.value > sizer.max) {
                    sizer.max = t.value;
                }
            });

            this.setState({
                tags: tags,
                scale: new ScaleLog(sizer)
            });
        }
    },

    sortObject (obj) {
        var arr = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                arr.push({
                    key: prop,
                    value: obj[prop]
                });
            }
        }
        /*arr.sort(function (a, b) {
         return b.value - a.value;
         });*/
        arr.sort(function (a, b) {
            return a.key.toLowerCase().localeCompare(b.key.toLowerCase());
        }); //use this to sort as strings

        return arr;
    },

    render () {
        var state = this.state,
            tags;

        if (config.features.tags) {
            tags = (
                <div className="tag-cloud">
                    {state.tags.map((d, i) => {
                        return (<a key={i} href="#"
                                   style={{ fontSize: state.scale.value(d.value)}}>{d.key + ' (' + d.value + ')'}</a>
                        );
                    })}
                </div>
            );
        }

        return (
            <header>
                <img src="media/svg-porn.svg" className="logo"/>

                <h3>A collection of svg logos for developers.</h3>
                {tags}
            </header>
        );
    }

});

module.exports = Header;
