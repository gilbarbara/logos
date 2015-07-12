var React = require('react/addons');

var Footer = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    render: function () {
        return (
            <footer>
                <iframe src="https://ghbtns.com/github-btn.html?user=gilbarbara&repo=logos&type=star&count=true" frameBorder="0" scrolling="0" width="110px" height="20px"></iframe>
                <iframe src="https://ghbtns.com/github-btn.html?user=gilbarbara&type=follow&count=true" frameBorder="0" scrolling="0" width="160px" height="20px"></iframe>
            </footer>
        );
    }

});

module.exports = Footer;
