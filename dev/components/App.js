import React, { Component } from 'react';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';

export default class App extends React.Component {

  submit = () => {
    confirmAlert({
      title: 'Confirm to submit',                        // Title dialog
      message: 'Are you sure to do this.',               // Message dialog
      confirmLabel: 'Confirm',                           // Text button confirm
      cancelLabel: 'Cancel',                             // Text button cancel
      onConfirm: () => alert('Action after Confirm'),    // Action after Confirm
      onCancel: () => alert('Action after Cancel'),      // Action after Cancel
    })
  };

  render() {
    return (
      <div className="main-container">
        <section className="section1">
          <div className="center">
            <div className="title">React confirm alert</div>
            <br/>
            <br/>
            <a href="javascript:;" className="button" onClick={this.submit}>Show confirm</a>
          </div>
        </section>
      </div>
    );
  }
}