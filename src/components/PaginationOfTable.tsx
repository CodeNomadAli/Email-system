// import React from 'react'

// import { Grid, Button, Pagination, Select, MenuItem } from '@mui/material'

// const PaginationOfTable: React.FC<{
//   table: any
//   pagination: { pageIndex: number; pageSize: number }
//   setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>
//   totalPages: number
// }> = ({ table, pagination, setPagination, totalPages }) => {
//   return (
//     <Grid item xs={12} className='text-end mt-2'>
//       <Grid style={{ display: 'inline-flex', alignItems: 'center' }}>
//         <Button
//           onClick={() => {
//             table.firstPage()
//             setPagination(prev => ({ ...prev, pageIndex: 0 }))
//           }}
//           variant='outlined'
//           color='primary'
//           disabled={pagination.pageIndex === 0}
//           sx={{
//             borderColor: 'grey.500',
//             color: 'grey.500',
//             '&:hover': {
//               borderColor: 'grey.500',
//               color: 'grey.500'
//             }
//           }}
//         >
//           {'<<'}
//         </Button>
//         <Pagination
//           count={totalPages}
//           page={pagination.pageIndex + 1}
//           onChange={(_, page) => {
//             setPagination(prev => ({ ...prev, pageIndex: page - 1 }))
//           }}
//           shape={'rounded'}
//           color='primary'
//           variant='outlined'
//         />
//         <Button
//           onClick={() => {
//             table.setPageIndex(totalPages - 1)
//             setPagination(prev => ({ ...prev, pageIndex: totalPages - 1 }))
//           }}
//           variant='outlined'
//           color='primary'
//           disabled={pagination.pageIndex === totalPages - 1 || totalPages === undefined}
//           sx={{
//             borderColor: 'grey.500',
//             color: 'grey.500',
//             '&:hover': {
//               borderColor: 'grey.500',
//               color: 'grey.500'
//             }
//           }}
//         >
//           {'>>'}
//         </Button>
//         <Select
//           color='primary'
//           variant='outlined'
//           size='small'
//           value={table.getState().pagination.pageSize}
//           className='border-rounded px-3 ml-2'
//           onChange={e => {
//             const newPageSize = Number(e.target.value)

//             setPagination({ pageIndex: 0, pageSize: newPageSize })
//             table.setPageSize(newPageSize)
//             table.setPageIndex(0)
//           }}
//         >
//           {[50, 100, 200].map(pageSize => (
//             <MenuItem key={pageSize} value={pageSize}>
//               {pageSize}
//             </MenuItem>
//           ))}
//         </Select>
//       </Grid>
//     </Grid>
//   )
// }

// export default PaginationOfTable
