import type { Dispatch, SetStateAction } from 'react'
import React, { useEffect, useState } from 'react'

import { Box, Card, Breadcrumbs, Typography, Link, Icon, IconButton } from '@mui/material'

import type { Folder } from '@/types'
import { useSettings } from '@/@core/hooks/useSettings'

interface RouteDirectoryProps {
  activeDir: Folder | undefined
  setActiveDir: Dispatch<SetStateAction<Folder | undefined>>
}



const DirectoryPath: React.FC<RouteDirectoryProps> = ({ activeDir, setActiveDir}) => {
  const [directoryFolders, setDirectoryFolders] = useState<Folder[]>([
    { id: '', name: 'Home', userId: 'home_directory', parentId: '', createdAt: '' }
  ]) // Initialize with "Home"

  const { settings } = useSettings()
  
  const handleBreadcrumbClick = (event: React.MouseEvent, index: number, folder: Folder) => {
    event.preventDefault()
    

    setActiveDir(folder)

    setDirectoryFolders(prevPath => prevPath.slice(0, index + 1))
  }

  useEffect(() => {
    if (activeDir?.name) {
      setDirectoryFolders(prevPath => {
        const newPath = [...prevPath]
        const lastItem = prevPath[prevPath.length - 1]

        if (activeDir.id !== lastItem.id && activeDir.userId !== 'home_directory') {
          newPath.push(activeDir)
        }
      
        return newPath
      })
    }
  }, [activeDir])

  

  const moveWithArrow = () => {
    if (directoryFolders.length > 1) {
      const lastFolder = directoryFolders[directoryFolders.length - 2]

      setActiveDir(lastFolder)
      setDirectoryFolders(directoryFolders.slice(0, -1))
    }
  }

  return (
    <Box
      sx={{
        display: 'flex'
      }}
    >
      {/* Breadcrumb Card */}
      <Card
        sx={{
          padding: '0.7rem ',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '8px',
          flexGrow: 1,
          maxWidth: '80%'
        }}
      >
        {directoryFolders.length > 1 && (
          <IconButton
            onClick={() => moveWithArrow()}
            sx={{
              border: 1,
              boxSizing: 'border-box',
              padding: '4px',
              fontSize: '16px',
              minWidth: '22px',
              minHeight: '22px',
              fontWeight: 'bold',
              '&:hover': {
                color: settings.primaryColor,
                background: 'rgba(0, 0, 0, 0.04)'
              },
              marginRight: '8px',
              borderRadius: '50%'
            }}
          >
            <Icon className='tabler-arrow-left' fontSize='inherit' />
          </IconButton>
        )}
        <Breadcrumbs
          separator={<Icon className='tabler-chevron-right' />}
          aria-label='breadcrumb'
          sx={{
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {directoryFolders.map((folder, index) => [
            index !== directoryFolders.length - 1 ? (
              <Link
                key={index}
                underline='hover'
                color='inherit'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' }
                }}
                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                  handleBreadcrumbClick(event, index, folder)
                }
              >
                {index === 0 ? <Icon className='tabler-home' sx={{ marginRight: 0.5 }} /> : folder.name}
              </Link>
            ) : (
              <Typography key={index} color='text.primary' sx={{ display: 'flex', alignItems: 'center' }}>
                {index === 0 ? (
                  <>
                    <Icon className='tabler-home' sx={{ marginRight: 0.5 }} />
                  </>
                ) : (
                  folder.name
                )}
              </Typography>
            )
          ])}
        </Breadcrumbs>
      </Card>
    </Box>
  )
}

export default DirectoryPath
