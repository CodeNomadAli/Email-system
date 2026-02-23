import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

import type { File } from '@/types'

export default function SingleListFile({
  file,
  handleMenuClick
}: {
  file: File
  handleMenuClick: (e: React.MouseEvent<HTMLButtonElement>, file: File) => void
}) {
  return (
    <ListItem style={{ display: 'flex', alignItems: 'center' }}>
      <i
        className={`tabler-file`}
        style={{
          fontSize: '5rem',
          color: '#757575',
          marginRight: '16px'
        }}
      ></i>
      <ListItemText primary={file.name} />

      <Tooltip title='Options' arrow>
        <IconButton onClick={e => handleMenuClick(e, file)} style={{ marginLeft: 'auto' }}>
          <i className='tabler-dots-vertical' style={{ fontSize: '1.5rem' }}></i>
        </IconButton>
      </Tooltip>
    </ListItem>
  )
}
