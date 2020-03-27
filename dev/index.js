import React from 'react'
import ReactDOM from 'react-dom'
import { confirmAlert } from 'react-confirm-alert'
import '../src/react-confirm-alert.css'

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
    })
  }

    handleClickCustomUI = () => {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='custom-ui'>
              <h1>Are you sure?</h1>
              <p>You want to delete this file?</p>
              <button onClick={onClose}>No</button>
              <button onClick={onClose}>Yes, Delete it!</button>
            </div>
          )
        }
      })
    }

  openDialog1 = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>This is dialog #1</h1>
            <p>Close dialog?</p>
            <button onClick={onClose}>Yes</button>
            <button onClick={this.openDialog2}>No, open another one!</button>
          </div>
        )
      }
    })
  }

  openDialog2 = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>This is dialog #2</h1>
            <p>Close dialog?</p>
            <button onClick={onClose}>Yes</button>
          </div>
        )
      }
    })
  }

  render () {
    return (
      <div className='main-container'>
        <section className='section1'>
          <div className='center'>
            <div className='title'>React confirm alert 2</div>
            <br />
            <br />
            <a href='javascript:;' className='button' onClick={this.submit}>
              Show confirm
            </a>
            <a href='javascript:;' className='button outline' onClick={this.handleClickCustomUI}>
              Show confirm Custom UI
            </a>
            <a href='javascript:;' className='button outline' onClick={this.openDialog1}>
              Nested modals
            </a>
          </div>
        </section>
      </div>
    )
  }
}

const rootEl = document.getElementById('root')
ReactDOM.render(<App />, rootEl)
