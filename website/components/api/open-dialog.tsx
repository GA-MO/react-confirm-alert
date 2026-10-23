'use client'
import { DialogLayout, openDialog } from 'react-confirm-alert'

const plans = ['Free', 'Pro', 'Team']

export const pickPlan = () =>
  openDialog<string>({
    render: ({ close }) => (
      <DialogLayout
        title="Pick a plan"
        message="You can change it at any time."
        actions={plans.map((plan) => ({
          label: plan,
          onClick: () => close(plan),
        }))}
      />
    ),
  }).result
