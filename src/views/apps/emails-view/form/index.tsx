'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  IconButton,
  Autocomplete,
  Chip
} from '@mui/material'

const dummyUsers = [
  { id: '1', fullName: 'Ahmed Khan' },
  { id: '2', fullName: 'Sara Malik' },
  { id: '3', fullName: 'Ali Hassan' },
  { id: '4', fullName: 'Fatima Noor' },
  { id: '5', fullName: 'Zain Abbas' }
]

const dummyEmails = [
  'info@company.com',
  'support@company.com',
  'hr@company.com',
  'billing@company.com',
  'sales@company.com',
  'admin@company.com',
  'team@company.com'
]

interface Assignment {
  userId: string | null
  emails: string[]
}

export default function AssignEmailsForm() {
  const [assignments, setAssignments] = useState<Assignment[]>([{ userId: null, emails: [] }])

  const canAddMore = () => {
    const last = assignments[assignments.length - 1]
    return last.userId !== null && last.emails.length > 0
  }

  const addRow = () => {
    if (assignments.length >= 10 || !canAddMore()) return
    setAssignments([...assignments, { userId: null, emails: [] }])
  }

  const removeRow = (index: number) => {
    if (assignments.length === 1) return
    setAssignments(assignments.filter((_, i) => i !== index))
  }

  const updateUser = (index: number, value: { id: string; fullName: string } | null) => {
    const newAss = [...assignments]
    newAss[index].userId = value?.id ?? null
    setAssignments(newAss)
  }

  const updateEmails = (index: number, value: string[]) => {
    const newAss = [...assignments]
    newAss[index].emails = value
    setAssignments(newAss)
  }

  const handleSubmit = () => {
    const payload = assignments.filter(a => a.userId && a.emails.length > 0)
    console.log('Submit:', payload)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Assign Emails to Users" />
          <CardContent>
            {assignments.map((ass, i) => (
              <Grid container spacing={3} key={i} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} sm={5}>
                  <Autocomplete
                    options={dummyUsers}
                    getOptionLabel={o => o.fullName}
                    value={dummyUsers.find(u => u.id === ass.userId) ?? null}
                    onChange={(_, val) => updateUser(i, val)}
                    renderInput={p => <TextField {...p} label="Select User" />}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    options={dummyEmails}
                    value={ass.emails}
                    onChange={(_, val) => updateEmails(i, val)}
                    renderInput={p => <TextField {...p} label="Select Emails" />}
                    renderTags={(value, getTagProps) =>
                      value.map((option, idx) => (
                        <Chip label={option} {...getTagProps({ idx })} size="small" />
                      ))
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={1}>
                  {i === assignments.length - 1 ? (
                    <IconButton 
                      onClick={addRow} 
                      disabled={assignments.length >= 10 || !canAddMore()}
                    >
                      <i className="tabler-plus" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => removeRow(i)} color="error">
                      <i className="tabler-trash" />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}

            <Grid sx={{ mt: 4, textAlign: 'right' }}>
              <Button variant="contained" onClick={handleSubmit}>
                Save
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
