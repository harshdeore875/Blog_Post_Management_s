import HomeIcon from '@mui/icons-material/Home';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

function NotFound() {
  return (
    <Box sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button component={Link} to="/" startIcon={<HomeIcon />}>
        Back to Blog List
      </Button>
    </Box>
  );
}

export default NotFound;
