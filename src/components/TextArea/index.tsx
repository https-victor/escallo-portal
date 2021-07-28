import { TextField } from '@material-ui/core';

export default function TextArea({ id, name, formValue, onChange, error, helperText, label }: any): any {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      name={name}
      label={label}
      id={id}
      value={formValue}
      onChange={onChange}
      error={error}
      helperText={helperText}
    />
  );
}
