import React, { Component } from 'react';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';

export default class App extends React.Component {

  submit = () => {
    confirmAlert({
      title: 'Hi mondit',
      message: 'Fuck you i noob 5555',
      onConfirm: () => alert('Confirm fuck you mondit'),
      onCancel: () => alert('Cancel fuck you mondit'),
    })
  };

  render() {
    return (
      <div className="container">
        <button onClick={this.submit}>Show confirm alert</button>
      </div>
    );
  }
}