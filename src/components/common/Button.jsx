import MuiButton from '@mui/material/Button';

function Button({ children, variant = 'contained', color = 'primary', ...props }) {
  return (
    <MuiButton variant={variant} color={color} disableElevation {...props}>
      {children}
    </MuiButton>
  );
}

export default Button;
