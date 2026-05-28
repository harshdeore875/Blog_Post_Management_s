import { Parser } from 'json2csv';

const csvFields = [
  { label: 'Title', value: 'title' },
  { label: 'Description', value: 'description' },
  { label: 'Author', value: 'author' },
  { label: 'Category', value: 'category' },
  { label: 'Created Date', value: 'createdDate' },
];

export const generateBlogsCsv = (blogs) => {
  const formattedBlogs = blogs.map((blog) => ({
    title: blog.title,
    description: blog.description,
    author: blog.author,
    category: blog.category,
    createdDate: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US') : '',
  }));

  const parser = new Parser({ fields: csvFields });

  return parser.parse(formattedBlogs);
};
