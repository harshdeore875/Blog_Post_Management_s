import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box component="footer" sx={{ mt: 5, py: 3, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        Copyright 2026 Blog Management System. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
