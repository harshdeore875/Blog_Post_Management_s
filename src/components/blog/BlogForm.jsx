import { yupResolver } from '@hookform/resolvers/yup';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Box, Divider, MenuItem, Paper, Stack, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import Button from '../common/Button.jsx';
import InputField from '../common/InputField.jsx';
import styles from './BlogForm.module.css';

const categories = ['Technology', 'Design', 'Business', 'Lifestyle', 'Marketing'];
const statuses = ['Published', 'Draft'];

const schema = yup.object({
  title: yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  content: yup.string().required('Content is required').min(50, 'Content must be at least 50 characters'),
  author: yup.string().required('Author is required'),
  email: yup.string().required('Email is required').email('Enter a valid email address'),
  category: yup.string().required('Category is required'),
  status: yup.string().required('Status is required'),
  tags: yup.string(),
  image: yup.string().url('Enter a valid image URL').nullable().transform((value) => value || ''),
});

const defaultValues = {
  title: '',
  description: '',
  content: '',
  author: '',
  email: '',
  category: '',
  status: 'Draft',
  tags: '',
  image: '',
};

function BlogForm({
  initialValues,
  submitLabel = 'Publish Post',
  formTitle = 'Create New Post',
  formSubtitle = 'Fill in the details to publish your blog post',
  onSubmit,
  onCancel,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      tags: Array.isArray(initialValues?.tags) ? initialValues.tags.join(', ') : initialValues?.tags || '',
    },
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = (values) => {
    const payload = {
      ...values,
      tags: values.tags
        ? values.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
      image: typeof values.image === 'string' ? values.image : initialValues?.image,
    };
    return onSubmit(payload);
  };

  return (
    <Box className={styles.formPage}>
      <Paper variant="outlined" className={styles.formIntro}>
        <span className={styles.iconWrap}>
          <EditNoteIcon />
        </span>
        <Typography variant="h6">{formTitle}</Typography>
        <Typography variant="body2" color="text.secondary">
          {formSubtitle}
        </Typography>
      </Paper>

      <Paper variant="outlined" className={styles.formCard}>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <Typography variant="subtitle2" className={styles.sectionTitle}>
            Basic Information
          </Typography>
          <div className={styles.twoColumn}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Title"
                  placeholder="Enter post title"
                  error={errors.title}
                  helperText={errors.title?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Author Name"
                  placeholder="Enter author name"
                  error={errors.author}
                  helperText={errors.author?.message}
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputField
                label="Email Address"
                placeholder="author@example.com"
                error={errors.email}
                helperText={errors.email?.message}
                {...field}
              />
            )}
          />

          <Divider className={styles.divider} />
          <Typography variant="subtitle2" className={styles.sectionTitle}>
            Classification
          </Typography>
          <div className={styles.twoColumn}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <InputField select label="Category" error={errors.category} helperText={errors.category?.message} {...field}>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </InputField>
              )}
            />
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <InputField label="Tags" placeholder="Comma-separated tags" helperText="Separate tags with commas" {...field} />
              )}
            />
          </div>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <InputField select label="Status" error={errors.status} helperText={errors.status?.message} {...field}>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </InputField>
            )}
          />

          <Divider className={styles.divider} />
          <Typography variant="subtitle2" className={styles.sectionTitle}>
            Media
          </Typography>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <InputField
                label="Thumbnail URL"
                placeholder="https://example.com/image.jpg"
                error={errors.image}
                helperText={errors.image?.message}
                {...field}
              />
            )}
          />

          <Divider className={styles.divider} />
          <Typography variant="subtitle2" className={styles.sectionTitle}>
            Content
          </Typography>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <InputField
                label="Short Description"
                placeholder="Brief summary of the post"
                multiline
                minRows={2}
                error={errors.description}
                helperText={errors.description?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <InputField
                label="Post Content"
                placeholder="Write your full blog post content here"
                multiline
                minRows={8}
                error={errors.content}
                helperText={errors.content?.message || 'Write your full blog post content here'}
                {...field}
              />
            )}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={1.5} className={styles.actions}>
            <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {submitLabel}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default BlogForm;
