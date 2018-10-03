import React from 'react';

export default class Download extends React.Component {
  render() {
    return (
      <div>
        <h1>Download</h1>
        <div className="ui teal segment">
          <h4>Generating Result...</h4>
          <i className="icon notched circle loading large"></i>
          Your files are being generated.  For large datasets this may take
          some time.
        </div>
        <iframe src={this.props.location.state.endpoint}
                className="hidden"></iframe>
      </div>
    );
  }
}
