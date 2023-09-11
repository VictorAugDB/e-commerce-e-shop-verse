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
      <div className="space-y-6 text-center">
        <RadixAlertDialog.Title className="text-xl">
          Are you absolutely sure?
        </RadixAlertDialog.Title>
        <RadixAlertDialog.Description className="font-medium">
          {description}
        </RadixAlertDialog.Description>
        <div className="flex flex-col-reverse flex-wrap justify-center gap-4 sm:flex-row">
          <RadixAlertDialog.Cancel className="h-12 flex-1" asChild>
            <Button variant="light" className="block">
              Cancel
            </Button>
          </RadixAlertDialog.Cancel>
          <RadixAlertDialog.Action
            className="h-12 flex-1"
            data-testid="action-button"
            asChild
          >
            {actionButton}
          </RadixAlertDialog.Action>
        </div>
      </div>
    </AlertDialog>
  )
}
