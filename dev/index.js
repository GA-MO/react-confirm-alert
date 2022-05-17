import React from 'react'
import { createRoot } from 'react-dom/client'
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

  render () {
    return (
      <div className='main-container'>
        <section className='section1'>
          <div className='center'>
            <div className='title'>React confirm alert 3</div>
            <br />
            <br />
            <a className='button' onClick={this.submit}>
              Show confirm
            </a>
            <a className='button outline' onClick={this.handleClickCustomUI}>
              Show confirm Custom UI
            </a>
          </div>
        </section>
      </div>
    )
  }
}

const rootEl = document.getElementById('root')
const root = createRoot(rootEl)
root.render(<App />)
