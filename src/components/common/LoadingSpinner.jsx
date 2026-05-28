import { Box, CircularProgress } from '@mui/material';

function LoadingSpinner({ label = 'Loading' }) {
  return (
    <Box sx={{ display: 'grid', minHeight: 220, placeItems: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress aria-label={label} />
      </Box>
    </Box>
  );
}

export default LoadingSpinner;
