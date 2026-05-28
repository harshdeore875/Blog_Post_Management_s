import TextField from '@mui/material/TextField';

function InputField({ label, error, helperText, ...props }) {
  return (
    <TextField
      fullWidth
      label={label}
      error={Boolean(error)}
      helperText={helperText}
      margin="normal"
      {...props}
    />
  );
}

export default InputField;
