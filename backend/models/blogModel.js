import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [50, 'Content must be at least 50 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Published', 'Draft'],
      default: 'Draft',
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
