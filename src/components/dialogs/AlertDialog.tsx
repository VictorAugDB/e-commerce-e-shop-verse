import * as RadixAlertDialog from '@radix-ui/react-alert-dialog'
import React, { ReactNode, useState } from 'react'

type DialogProps = {
  button: ReactNode
  children: ReactNode
}

export default function AlertDialog({ button, children }: DialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <RadixAlertDialog.Root open={open} onOpenChange={setOpen}>
      <RadixAlertDialog.Trigger
        data-testid="open-remove-product-dialog"
        asChild
      >
        {button}
      </RadixAlertDialog.Trigger>
      <RadixAlertDialog.Portal>
        <RadixAlertDialog.Overlay
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-[rgba(0,0,0,0.2)] data-[state=closed]:animate-contentOverlayCLose data-[state=open]:animate-overlayShow"
        />
        <RadixAlertDialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] !font-sans shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=closed]:animate-contentOverlayCLose data-[state=open]:animate-contentShow">
          {children}
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  )
}
