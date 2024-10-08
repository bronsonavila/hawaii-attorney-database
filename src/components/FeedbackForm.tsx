import { Button, DialogActions, DialogContent, Stack, TextField } from '@mui/material'
import { ChangeEvent, FC } from 'react'

interface FeedbackFormProps {
  email: string
  message: string
  name: string
  onCancel: () => void
  onSubmit: () => void
  setEmail: (email: string) => void
  setMessage: (message: string) => void
  setName: (name: string) => void
}

interface FieldProps {
  label: string
  multiline?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  value: string
}

export const FeedbackForm: FC<FeedbackFormProps> = ({
  email,
  message,
  name,
  onCancel,
  onSubmit,
  setEmail,
  setMessage,
  setName
}) => (
  <>
    <DialogContent sx={{ width: { md: 400, lg: 500 } }}>
      <Stack spacing={2}>
        <Field label="Name" value={name} onChange={event => setName(event.target.value)} />

        <Field label="Email" value={email} onChange={event => setEmail(event.target.value)} />

        <Field label="Message" value={message} onChange={event => setMessage(event.target.value)} multiline required />
      </Stack>
    </DialogContent>

    <DialogActions>
      <Button onClick={onCancel} size="small">
        Cancel
      </Button>

      <Button disabled={!message} onClick={onSubmit} size="small" variant="contained">
        Submit
      </Button>
    </DialogActions>
  </>
)

const Field: FC<FieldProps> = ({ label, multiline = false, onChange, required = false, value }) => (
  <TextField
    fullWidth
    label={label}
    multiline={multiline}
    onChange={onChange}
    required={required}
    rows={multiline ? 8 : undefined}
    size="small"
    slotProps={{ input: { style: { fontSize: 14 } }, inputLabel: { style: { fontSize: 14 } } }}
    value={value}
  />
)
