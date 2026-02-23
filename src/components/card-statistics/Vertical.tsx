// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import classnames from 'classnames'

// Type Import
import type { CardStatsVerticalProps } from '@/types/pages/widgetTypes'

// Component Import
import CustomAvatar from '@core/components/mui/Avatar'

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // Props
  const { title, avatarIcon, avatarColor, avatarSize, avatarSkin, count } = props

  return (
    <Card>
      <CardContent className='flex flex-col gap-y-3 items-start'>
        <CustomAvatar variant='rounded' skin={avatarSkin} size={avatarSize} color={avatarColor}>
          <i className={classnames(avatarIcon, 'text-[28px]')} />
        </CustomAvatar>
        <div className='flex flex-col gap-y-1'>
          <Typography variant='h5'>{title}</Typography>
          <Typography color='text.primary'>{count}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical
