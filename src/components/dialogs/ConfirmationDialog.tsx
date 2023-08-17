import * as RadixAlertDialog from '@radix-ui/react-alert-dialog'
import { ReactNode } from 'react'

import Button from '@/components/buttons/Button'
import AlertDialog from '@/components/dialogs/AlertDialog'

type ConfirmationDialogProps = {
  openButton: ReactNode
  actionButton: ReactNode
  description: string
}

export function ConfirmationDialog({
  openButton,
  actionButton,
  description,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog button={openButton}>
      <div className="space-y-6">
        <RadixAlertDialog.Title className="text-xl">
          Are you absolutely sure?
        </RadixAlertDialog.Title>
        <RadixAlertDialog.Description className="font-medium">
          {description}
        </RadixAlertDialog.Description>
        <div className="flex flex-wrap justify-center gap-4">
          <RadixAlertDialog.Cancel asChild>
            <Button variant="light">Cancel</Button>
          </RadixAlertDialog.Cancel>
          <RadixAlertDialog.Action data-testid="action-button" asChild>
            {actionButton}
          </RadixAlertDialog.Action>
        </div>
      </div>
    </AlertDialog>
  )
}
