# react-confirm-alert
##### react component confirm dialog.
[Live demo](https://ga-mo.github.io/react-confirm-alert/demo/)

[![react-confirm-alert.jpg](https://s22.postimg.org/4qalkjh0x/react_confirm_alert.jpg)](https://ga-mo.github.io/react-confirm-alert/demo/)
## Getting started

#### Install with NPM:
```
$ npm install react-confirm-alert --save
```

#### Use with function:
```js
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

class App extends React.Component {

  submit = () => {
    confirmAlert({
      title: 'Confirm to submit',                        // Title dialog
      message: 'Are you sure to do this.',               // Message dialog
      childrenElement: () => <div>Custom UI</div>,       // Custom UI or Component
      confirmLabel: 'Confirm',                           // Text button confirm
      cancelLabel: 'Cancel',                             // Text button cancel
      onConfirm: () => alert('Action after Confirm'),    // Action after Confirm
      onCancel: () => alert('Action after Cancel'),      // Action after Cancel
    })
  };

  render() {
    return (
      <div className="container">
        <button onClick={this.submit}>Confirm dialog</button>
      </div>
    );
  }
}
```

#### Use with component:
```js
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

class App extends React.Component {
  state = {
    showDialog: false,
  }
  render() {
    return (
      <div>
        {
          this.state.showDialog &&
          <ReactConfirmAlert
            title="Confirm to submit"
            message="Are you sure to do this."
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            onConfirm={() => alert('Action after Confirm')}
            onCancel={() => alert('Action after Cancel')}
          />
        }
      </div>
    );
  }
}
```