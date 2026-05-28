import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Blog from '../models/blogModel.js';

dotenv.config();

const sampleBlogs = [
  {
    title: 'Getting Started with React Hooks',
    description: 'A beginner-friendly introduction to React Hooks.',
    content:
      'React Hooks make it easier to share stateful logic and keep components readable. This post explains why hooks matter, how useState works, and how useEffect helps manage side effects in modern React applications.',
    author: 'Sarah Johnson',
    email: 'sarah@example.com',
    category: 'Technology',
    status: 'Published',
    tags: ['react', 'hooks', 'frontend'],
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-04-15'),
  },
  {
    title: 'Modern UI Design Principles',
    description: 'How to create simple, legible, consistent interfaces.',
    content:
      'Good UI design depends on hierarchy, spacing, alignment, contrast, and predictable interaction patterns. These principles help teams create interfaces that are easier to scan, easier to use, and easier to maintain.',
    author: 'Michael Chen',
    email: 'michael@example.com',
    category: 'Design',
    status: 'Published',
    tags: ['ui', 'design'],
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f5a07d?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date('2026-04-18'),
    updatedAt: new Date('2026-04-18'),
  },
  {
    title: 'Building Scalable Applications',
    description: 'Patterns that help frontend applications grow cleanly.',
    content:
      'Scalable applications rely on clear boundaries, predictable data flow, and reusable components. This article covers practical structure decisions that help frontend codebases stay understandable as features grow.',
    author: 'Emily Davis',
    email: 'emily@example.com',
    category: 'Technology',
    status: 'Draft',
    tags: ['frontend', 'architecture'],
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date('2026-04-20'),
    updatedAt: new Date('2026-04-20'),
  },
  {
    title: 'The Future of Remote Work',
    description: 'A look at distributed teams and async collaboration.',
    content:
      'Remote work succeeds when teams define communication norms and measure outcomes clearly. Strong remote teams invest in documentation, meeting discipline, shared rituals, and trust-building habits.',
    author: 'James Wilson',
    email: 'james@example.com',
    category: 'Business',
    status: 'Published',
    tags: ['remote', 'work'],
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date('2026-04-22'),
    updatedAt: new Date('2026-04-22'),
  },
  {
    title: 'Minimalist Living Guide',
    description: 'Simple practices for reducing clutter.',
    content:
      'Minimalist living is about choosing what deserves space, time, and attention. This guide explores practical ways to simplify your environment, routines, and daily decision-making.',
    author: 'Sarah Johnson',
    email: 'sarah@example.com',
    category: 'Lifestyle',
    status: 'Draft',
    tags: ['minimalism', 'lifestyle'],
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date('2026-04-23'),
    updatedAt: new Date('2026-04-23'),
  },
  {
    title: 'Content Strategy for Small Teams',
    description: 'Make publishing manageable with lightweight systems.',
    content:
      'Small teams need editorial clarity, templates, and a realistic publishing cadence. A lightweight strategy helps teams publish consistently without building a heavy process that slows everyone down.',
    author: 'Priya Nair',
    email: 'priya@example.com',
    category: 'Business',
    status: 'Published',
    tags: ['content', 'strategy'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date('2026-04-25'),
    updatedAt: new Date('2026-04-25'),
  },
];

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Blog.deleteMany();
    await Blog.insertMany(sampleBlogs);
    console.log('Sample blog data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedBlogs();
