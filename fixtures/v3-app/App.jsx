import React from 'react'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// README "Options" example
const options = {
  title: 'Title',
  message: 'Message',
  buttons: [
    {
      label: 'Yes',
      onClick: () => alert('Click Yes')
    },
    {
      label: 'No',
      onClick: () => alert('Click No')
    }
  ],
  closeOnEscape: true,
  closeOnClickOutside: true,
  keyCodeForClose: [8, 32],
  willUnmount: () => {},
  afterClose: () => {},
  onClickOutside: () => {},
  onKeypress: () => {},
  onKeypressEscape: () => {},
  overlayClassName: "overlay-custom-class-name"
};

// README "Use with function" example
class App extends React.Component {
  submit = () => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => alert('Click Yes')
        },
        {
          label: 'No',
          onClick: () => alert('Click No')
        }
      ]
    });
  };

  // README "Custom UI Component" example
  custom = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this file?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                this.handleClickDelete();
                onClose();
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      }
    });
  };

  handleClickDelete = () => {}

  render() {
    return (
      <div className='container'>
        <button onClick={this.submit}>Confirm dialog</button>
        <button onClick={() => confirmAlert(options)}>Options dialog</button>
        <button onClick={this.custom}>Custom dialog</button>
      </div>
    );
  }
}

export default App
