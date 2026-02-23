import React from 'react'

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

import type { Folder } from '@/types'
import { useSettings } from '@/@core/hooks/useSettings'

interface SingleListFolderProps {
  folder: Folder
  handleMenuClick: (e: React.MouseEvent<HTMLButtonElement>, file: Folder) => void
  setActiveDir: (folder: Folder | undefined) => void
}

// const theme = useTheme()

export default function SingleListFolder({ folder, handleMenuClick, setActiveDir }: SingleListFolderProps) {
  const { settings } = useSettings()

  return (
    <ListItem
      key={folder.id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'grap',
        '&:hover': {
          backgroundColor: '#c5c2c2',
          color: '#fff',
          '.hover-visible': {
            opacity: 1,
            visibility: 'visible',
            color: '#fff'
          },
          '.folder-name': {
            color: '#fff'
          }
        }
      }}
    >
      {/* Folder Icon */}
      <div style={{ cursor: 'pointer' }} onClick={() => setActiveDir(folder)}>
        <i
          className='tabler-folder'
          style={{
            fontSize: '5rem',
            color: settings.primaryColor,
            marginRight: '16px'
          }}
        ></i>
      </div>

      {/* Folder Name */}
      <ListItemText className='folder-name' primary={folder.name} />

      {/* Options Menu */}
      <Tooltip title='Options' arrow>
        <IconButton
          onClick={e => {
            e.stopPropagation() // Prevent ListItem's onClick from firing
            handleMenuClick(e, folder)
          }}
          sx={{
            marginLeft: 'auto',
            '&:hover': {
              backgroundColor: settings.primaryColor
            }
          }}
        >
          <i className='tabler-dots-vertical' />
        </IconButton>
      </Tooltip>
    </ListItem>
  )
}
