import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Typography } from '@mui/material';

function Unauthorized() {
  return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <LockOutlinedIcon color="disabled" sx={{ fontSize: 56, mb: 1 }} />
      <Typography variant="h4" sx={{ mb: 1 }}>
        Unauthorized
      </Typography>
      <Typography color="text.secondary">You do not have permission to view this page.</Typography>
    </Box>
  );
}

export default Unauthorized;
