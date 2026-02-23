// React Imports
import { forwardRef } from 'react'
import type { ReactElement, Ref } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slide from '@mui/material/Slide'
import type { SlideProps } from '@mui/material/Slide'

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

interface DialogTransitionProps {
  open: boolean
  setOpen: (value: boolean) => void
  dialogActions?: (ReactElement | null)[]
  title?: string
  children?: ReactElement
}

const DynamicDialog = ({ title, dialogActions, open, setOpen, children }: DialogTransitionProps) => {
  const handleClose = () => setOpen(false)

  return (
    <>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
        closeAfterTransition={false}
      >
        {title && <DialogTitle id='alert-dialog-slide-title'>{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        {dialogActions && <DialogActions className='dialog-actions-dense'>{dialogActions}</DialogActions>}
      </Dialog>
    </>
  )
}

export default DynamicDialog
