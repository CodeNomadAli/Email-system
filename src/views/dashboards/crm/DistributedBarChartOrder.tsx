'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Vars
type DistributedBarChartOrderProps = {
  lastWeekAttendance: {
    day1: { percentage: string; createdAt: string }
    day2: { percentage: string; createdAt: string }
    day3: { percentage: string; createdAt: string }
    day4: { percentage: string; createdAt: string }
    day5: { percentage: string; createdAt: string }
    day6: { percentage: string; createdAt: string }
    day7: { percentage: string; createdAt: string }
    attendance7Days: number
  }
}

const DistributedBarChartOrder = ({ lastWeekAttendance }: DistributedBarChartOrderProps) => {
  const series = [
    {
      data: [
        parseFloat(lastWeekAttendance?.day1?.percentage || '0'),
        parseFloat(lastWeekAttendance?.day2?.percentage || '0'),
        parseFloat(lastWeekAttendance?.day3?.percentage || '0'),
        parseFloat(lastWeekAttendance?.day4?.percentage || '0'),
        parseFloat(lastWeekAttendance?.day5?.percentage || '0'),
        parseFloat(lastWeekAttendance?.day6?.percentage || '0'),
        parseFloat(lastWeekAttendance?.day7?.percentage || '0')
      ]
    }
  ]

  const theme = useTheme()

  // Vars
  const actionSelectedColor = 'var(--mui-palette-action-selected)'

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    tooltip: { enabled: false },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: ['var(--mui-palette-primary-main)'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 3,
        horizontal: false,
        columnWidth: '32%',
        colors: {
          backgroundBarRadius: 5,
          backgroundBarColors: [
            actionSelectedColor,
            actionSelectedColor,
            actionSelectedColor,
            actionSelectedColor,
            actionSelectedColor
          ]
        }
      }
    },
    grid: {
      show: false,
      padding: {
        left: -3,
        right: 5,
        top: 15,
        bottom: 18
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: false,
      max: 100
    },
    responsive: [
      {
        breakpoint: 1350,
        options: {
          plotOptions: {
            bar: { columnWidth: '45%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          plotOptions: {
            bar: { columnWidth: '20%' }
          }
        }
      },
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: { columnWidth: '15%' }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader title='Attendance' subheader='Last Week' className='pbe-0' />
      <CardContent className='flex flex-col'>
        <AppReactApexCharts type='bar' height={84} width='100%' options={options} series={series} />
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h6' color='text.primary'>
            {lastWeekAttendance.attendance7Days}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default DistributedBarChartOrder
