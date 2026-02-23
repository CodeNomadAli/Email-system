'use client'

import { useState, useEffect, useCallback } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'

import { Backdrop } from '@mui/material'

import CircularProgress from '@mui/material/CircularProgress'

import RouteDriectory from './Route-Driectory'
import FileManager from './File-Render'
import type { File, Folder } from '@/types'
import DynamicDialog from '@/components/DynamicDialog'
import NewFolderModal from './NewFolderModal'
import { useFileUpload } from '@/libs/hooks/useDragDropUploadPDF'

const FormLayouts = () => {
  const [fileManagerFiles, setFileManagerFiles] = useState<File[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid') // State for grid/list view
  const [openNewFolderModal, setOpenNewFolderModal] = useState(false)
  const [activeDir, setActiveDir] = useState<Folder>()
  const uploadFile = useFileUpload()
  const [isLoading, setIsLoading] = useState(false)

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'grid' | 'list') => {
    if (newView) setViewMode(newView)
  }

  const fetchFolderFiles = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/hub/filemanager?folderId=' + (activeDir?.id ?? ''))
      const { data, status, error } = await response.json()

      if (status === 200) {
        setFileManagerFiles(data.files)
        setFolders([...data.folders])

        return
      }

      throw new Error('Failed to fetch files', error)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [activeDir?.id])

  useEffect(() => {
    fetchFolderFiles()
  }, [activeDir, fetchFolderFiles])

  const handleFileUpload = async (files: FileList) => {
    try {
      setIsLoading(true)
      await Promise.all(
        Array.from(files).map(async file => {
          const formData = new FormData()

          formData.append('file', file)
          formData.append('destination', 'filemanager')
          formData.append('fileSize', file.size.toString())
          formData.append('fileName', file.name)
          formData.append('allowedFileType', 'application/pdf')
          formData.append('folderId', activeDir?.id ?? '')

          const uploadedFile = await uploadFile(formData, file)

          if (uploadedFile) {
            setFileManagerFiles(prevFiles => [...prevFiles, uploadedFile])
          }
        })
      )
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography
          variant='h5'
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Recent Processed
        </Typography>
        {/* {files.length >= 0 ? (
          <MediaPreview files={files} acceptTypes='pdf' quickActionButton={recentMediaQuickActionButton} />
        ) : ( */}
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='body1'>No Recent Files</Typography>
          </CardContent>
        </Card>
        {/* )} */}
      </Grid>

      <Grid item xs={6}>
        <RouteDriectory activeDir={activeDir} setActiveDir={setActiveDir} />
      </Grid>
      <Grid item xs={6}>
        <Box display='flex' justifyContent='flex-end' alignItems='center' gap={2}>
          <Button variant='contained' color='primary' onClick={() => setOpenNewFolderModal(true)}>
            <i className='tabler-folder-plus' style={{ fontSize: '1.5rem', marginRight: 8 }}></i>
            Folder
          </Button>

          <DynamicDialog open={openNewFolderModal} maxWidth={'sm'} fullWidth={true} setOpen={setOpenNewFolderModal}>
            <NewFolderModal setDialogOpen={setOpenNewFolderModal} setFolders={setFolders} activeDir={activeDir} />
          </DynamicDialog>

          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              const input = document.createElement('input')

              input.type = 'file'
              input.multiple = true
              input.style.display = 'none'
              input.accept = '.pdf'
              input.max = '10'

              input.onchange = event => {
                const files = (event.target as HTMLInputElement).files

                if (files) {
                  handleFileUpload(files)
                }
              }

              input.click()
            }}
          >
            <i className='tabler-file-upload' style={{ fontSize: '1.5rem', marginRight: 8 }}></i>
            Upload
          </Button>

          <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange} aria-label='View mode'>
            <ToggleButton value='grid' aria-label='Grid view'>
              <i className='tabler-grid-dots' style={{ fontSize: '1.5rem' }}></i>
            </ToggleButton>
            <ToggleButton value='list' aria-label='List view'>
              <i className='tabler-list' style={{ fontSize: '1.5rem' }}></i>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <FileManager
          folders={folders}
          files={fileManagerFiles}
          viewMode={viewMode}
          setFolders={setFolders}
          setFiles={setFileManagerFiles}
          setActiveDir={setActiveDir}
        />
      </Grid>

      <Backdrop open={isLoading} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <CircularProgress />
      </Backdrop>
    </Grid>
  )
}

export default FormLayouts
