
// MUI Imports

import Grid from '@mui/material/Grid'

// Component Imports
// import { lastDayOfDecade } from 'date-fns'

// import DistributedBarChartOrder from '@views/dashboards/crm/DistributedBarChartOrder'

// import LineAreaYearlySalesChart from '@views/dashboards/crm/LineAreaYearlySalesChart'
import CardStatVertical from '@/components/card-statistics/Vertical'

// import BarChartRevenueGrowth from '@views/dashboards/crm/BarChartRevenueGrowth'
// import EarningReportsWithTabs from '@views/dashboards/crm/EarningReportsWithTabs'
// import RadarSalesChart from '@views/dashboards/crm/RadarSalesChart'
// import SalesByCountries from '@views/dashboards/crm/SalesByCountries'
// import ProjectStatus from '@views/dashboards/crm/ProjectStatus'
// import ActiveProjects from '@views/dashboards/crm/ActiveProjects'

// import LastTransaction from '@views/dashboards/crm/LastTransaction'
// import ActivityTimeline from '@views/dashboards/crm/ActivityTimeline'

// Server Action Imports
// import { getServerMode } from '@core/utils/serverHelpers'

//states


const DashboardCRM = () => {
  // Vars

  // const serverMode = getServerMode()


  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <CardStatVertical
          title='Registered DDB Locations'
          avatarColor='error'
          avatarIcon='tabler-location'
          avatarSkin='light'
          avatarSize={44}
          chipColor='error'
          chipVariant='tonal'
        />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4} lg={2}>
        <CardStatVertical
          title="Today's Checked-in Employees"
          avatarColor='success'
          avatarIcon='tabler-calendar-event'
          avatarSkin='light'
          avatarSize={44}
          chipColor='success'
          chipVariant='tonal'
          count={dashboardStats.todayAttendanceCount}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <DistributedBarChartOrder lastWeekAttendance={dashboardStats.lastWeekAttendance} />
      </Grid> */}
      {/* <Grid item xs={12} sm={6} md={4} lg={2}>
        <LineAreaYearlySalesChart />
      </Grid>
      <Grid item xs={12} md={8} lg={4}>
        <BarChartRevenueGrowth />
      </Grid>
      <Grid item xs={12} lg={8}>
        <EarningReportsWithTabs />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <RadarSalesChart />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <SalesByCountries />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <ProjectStatus />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <ActiveProjects />
      </Grid> */}
      {/* <Grid item xs={12} md={6}>
        <LastTransaction serverMode={serverMode} />
      </Grid> */}
      {/* <Grid item xs={12} md={6}>
        <ActivityTimeline />
      </Grid> */}
    </Grid>
  )
}

export default DashboardCRM
