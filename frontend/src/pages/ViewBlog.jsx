import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import { Box, Card, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/common/Button.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { blogApi } from '../services/blogApi.js';

function ViewBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    blogApi
      .viewBlogById(id)
      .then((data) => {
        setBlog(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleShare = async () => {
    const shareData = { title: blog.title, text: blog.description, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.info('Link copied to clipboard');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!blog) return <Typography>Blog not found.</Typography>;

  return (
    <Card variant="outlined">
      <CardMedia component="img" height="320" image={blog.image} alt={blog.title} />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h4">{blog.title}</Typography>
              <Typography color="text.secondary">
                {blog.author} · {blog.category} · {blog.createdDate}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button startIcon={<ShareIcon />} onClick={handleShare}>
                Share
              </Button>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {blog.tags.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </Stack>
          <Typography variant="h6">{blog.description}</Typography>
          <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>{blog.content}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ViewBlog;
