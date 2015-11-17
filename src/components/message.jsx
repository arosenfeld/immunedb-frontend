import React from 'react';

class Message extends React.Component {
  render() {
    return (
      <div className={this.props.type + ' ui icon message'}>
        <i className={this.props.icon + ' icon'}></i>
        <div className="content">
          <div className="header">
            {this.props.header}
          </div>
          <p>
            {this.props.message}
          </p>
        </div>
      </div>
    );
  }
}

export default Message;
