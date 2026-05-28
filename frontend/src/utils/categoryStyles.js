const categoryColors = {
  'Product Updates': '#e85d04',
  'Case Studies': '#7b2cbf',
  'AI SEO Tips': '#f77f00',
  'Industry News': '#0077b6',
  Technology: '#2563eb',
  Design: '#7c3aed',
  Business: '#059669',
  Lifestyle: '#db2777',
};

export const getCategoryColor = (category) => categoryColors[category] || '#6b7280';

export const formatBlogDate = (dateString) => {
  if (!dateString) return '';

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
    .format(parsed)
    .toUpperCase();
};

export const defaultBlogImage =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';
