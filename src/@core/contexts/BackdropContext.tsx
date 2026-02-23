'use client'

import type { ReactNode } from 'react'
import React, { createContext, useState } from 'react'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

// Backdrop context type
interface BackdropContextType {
  show: () => void
  hide: () => void
}

// Create the context
const BackdropContext = createContext<BackdropContextType | null>(null)

// Global controller (exported for helper functions)
export const BackdropController: BackdropContextType = {
  show: () => {},
  hide: () => {}
}

// Provider props type
interface BackdropProviderProps {
  children: ReactNode
}

// Backdrop Provider Component
export const BackdropProvider: React.FC<BackdropProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false)

  // Update global controller functions
  BackdropController.show = () => setOpen(true)
  BackdropController.hide = () => setOpen(false)

  return (
    <BackdropContext.Provider value={BackdropController}>
      {children}
      <Backdrop open={open} sx={{ color: '#fff', zIndex: 1300 }}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </BackdropContext.Provider>
  )
}
