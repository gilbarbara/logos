import React from 'react';
import PureRender from 'react-pure-render/function';

class Icon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    id: React.PropTypes.string.isRequired
  };

  shouldComponentUpdate = PureRender;

  render() {
    return (
      <svg
        className="icon" role="img"
        dangerouslySetInnerHTML={{ __html: '<use xlink:href="#' + this.props.id + '"></use>' }} />
    );
  }
}

export default Icon;
