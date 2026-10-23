'use client'
import { createContext, useContext } from 'react'
import { alert, DialogHost } from 'react-confirm-alert'

const Plan = createContext('Free')

function PlanName() {
  return <p>You are on the {useContext(Plan)} plan.</p>
}

export function ShowPlan() {
  return (
    <Plan.Provider value="Pro">
      <button onClick={() => alert({ content: <PlanName /> })}>
        Show plan
      </button>
      <DialogHost />
    </Plan.Provider>
  )
}
