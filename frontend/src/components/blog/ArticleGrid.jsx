import { Skeleton } from '@mui/material';
import ArticleCard from './ArticleCard.jsx';
import styles from './ArticleGrid.module.css';

function ArticleGrid({
  blogs,
  loading,
  onDelete,
  onPublish,
  canEditBlog,
  canDeleteBlog,
}) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={320} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {blogs.map((blog) => (
        <ArticleCard
          key={blog.id}
          blog={blog}
          onDelete={onDelete}
          onPublish={onPublish}
          canEditBlog={canEditBlog}
          canDeleteBlog={canDeleteBlog}
        />
      ))}
    </div>
  );
}

export default ArticleGrid;
