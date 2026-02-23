import React, { useState } from 'react'

import { Grid, List, Box, Menu, MenuItem } from '@mui/material'

import { useSettings } from '@/@core/hooks/useSettings'

import type { Folder, File } from '@/types'
import SingleGridFolder from './SingleGridFolder'
import SingleGridFile from './SingleGridFile'
import SingleListFile from './SingleListFile'
import SingleListFolder from './SingleListFolder'
import DynamicDialog from '@/components/DynamicDialog'
import RenameFileFolder from './RenameFileFolder'
import ConfirmationDialog from '@/@layouts/components/ConfirmationDialog'

interface FileManagerProps {
  viewMode: 'grid' | 'list'
  folders: Folder[]
  files: File[]
  setFiles: (files: any) => void
  setFolders: (folders: any) => void
  setActiveDir: (folder: Folder | undefined) => void
}

const FileManager = ({ viewMode, folders, files, setActiveDir, setFiles, setFolders }: FileManagerProps) => {
  const { settings } = useSettings()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<Folder | File | null>(null)
  const [renameTitle, setRenameTitle] = useState('')
  const [openRenameModal, setOpenRenameModal] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFolderMenuClick = (event: React.MouseEvent<HTMLElement>, item: Folder) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, item: Folder | File) => {
    setAnchorEl(event.currentTarget)

    setSelectedItem(item)
  }

  const updateFileFolderName = (fileFolderName: string, type = 'folder') => {
    if (!selectedItem) return

    if (type === 'folder') {
      const updatedFolders = folders.map(folder => {
        if (folder.id === selectedItem.id) {
          return { ...folder, name: fileFolderName }
        }

        return folder
      })

      setFolders(updatedFolders)

      return
    }

    const updatedFiles = files.map(file => {
      if (file.id === selectedItem.id) {
        return { ...file, name: fileFolderName }
      }

      return file
    })

    setFiles(updatedFiles)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const initRenameAction = () => {
    setRenameTitle(selectedItem && 'mimeType' in selectedItem && selectedItem ? 'Rename File' : 'Rename Folder')
    setOpenRenameModal(true)
    handleCloseMenu()
  }

  const initDeleteAction = () => {
    setOpenConfirmDialog(true)

    handleCloseMenu()
  }

  const deleteFileOrFolder = async () => {
    if (!selectedItem) return

    try {
      setIsLoading(true)
      const itemType = selectedItem && 'mimeType' in selectedItem ? 'file' : 'folder'

      const req = await fetch(`/api/hub/filemanager/${itemType}?${itemType}Id=${selectedItem.id}`, {
        method: 'DELETE'
      })

      if (req.ok) {
        if (itemType === 'folder') {
          setFolders(folders.filter(folder => folder.id !== selectedItem.id))
        } else {
          setFiles(files.filter(file => file.id !== selectedItem.id))
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(true)
      setOpenConfirmDialog(false)
    }
  }

  return (
    <Box p={2}>
      {viewMode === 'grid' ? (
        <Grid container spacing={2}>
          {folders.map(folder => (
            <SingleGridFolder
              key={folder.id}
              folder={folder}
              setActiveDir={setActiveDir}
              handleMenuClick={handleFolderMenuClick}
            />
          ))}
          {files.map(file => (
            <SingleGridFile key={file.id} file={file} handleMenuClick={handleMenuClick} />
          ))}
        </Grid>
      ) : (
        <List>
          {folders.map(folder => (
            <SingleListFolder
              key={folder.id}
              folder={folder}
              setActiveDir={setActiveDir}
              handleMenuClick={handleFolderMenuClick}
            />
          ))}
          {files.map(file => (
            <SingleListFile key={file.id} file={file} handleMenuClick={handleMenuClick} />
          ))}
        </List>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={initRenameAction}>Rename</MenuItem>
        <MenuItem onClick={initDeleteAction} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      <DynamicDialog fullWidth open={openRenameModal} setOpen={setOpenRenameModal}>
        {selectedItem && (
          <RenameFileFolder
            title={renameTitle}
            folderFile={selectedItem}
            setDialogOpen={setOpenRenameModal}
            updateState={updateFileFolderName}
          />
        )}
      </DynamicDialog>

      <DynamicDialog fullWidth setOpen={setOpenConfirmDialog} open={openConfirmDialog}>
        <ConfirmationDialog
          open={openConfirmDialog}
          IsLoading={isLoading}
          setOpen={setOpenConfirmDialog}
          title='Confirm Deletion'
          description={`Are you sure you want to delete ${selectedItem?.name} ${
            selectedItem && 'mimeType' in selectedItem ? 'file' : 'folder'
          } ?`}
          onConfirm={deleteFileOrFolder}
        />
      </DynamicDialog>
    </Box>
  )
}

export default FileManager
