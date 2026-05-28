import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { Box, Typography } from '@mui/material';

function EmptyState({ title = 'No blogs found', message = 'Create a new post or adjust your filters.' }) {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <ArticleOutlinedIcon color="disabled" sx={{ fontSize: 56, mb: 1 }} />
      <Typography variant="h6">{title}</Typography>
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}

export default EmptyState;
