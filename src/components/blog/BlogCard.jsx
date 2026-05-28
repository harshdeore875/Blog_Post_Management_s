import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Card, CardActions, CardContent, Chip, IconButton, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function BlogCard({ blog, onDelete }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.2}>
          <Typography variant="h6">{blog.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {blog.author} · {blog.createdDate}
          </Typography>
          <Chip label={blog.category} size="small" sx={{ width: 'fit-content' }} />
          <Typography variant="body2">{blog.description}</Typography>
        </Stack>
      </CardContent>
      <CardActions>
        <IconButton component={Link} to={`/blog/view/${blog.id}`} aria-label="View blog">
          <VisibilityIcon />
        </IconButton>
        <IconButton component={Link} to={`/blog/edit/${blog.id}`} aria-label="Edit blog">
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => onDelete(blog)} aria-label="Delete blog">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default BlogCard;
