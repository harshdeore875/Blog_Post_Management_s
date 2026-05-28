import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { defaultBlogImage, formatBlogDate, getCategoryColor } from '../../utils/categoryStyles.js';
import styles from './ArticleCard.module.css';

function ArticleCard({
  blog,
  onDelete,
  onPublish,
  canEditBlog,
  canDeleteBlog,
}) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const showActions = canEditBlog?.(blog) || canDeleteBlog?.(blog);

  const closeMenu = () => setMenuAnchor(null);

  const categoryColor = getCategoryColor(blog.category);
  const imageSrc = blog.image || defaultBlogImage;
  const displayDate = formatBlogDate(blog.createdDate) || blog.createdDate;

  return (
    <article className={styles.card}>
      <Link to={`/blog/view/${blog.id}`} className={styles.imageLink}>
        <img src={imageSrc} alt={blog.title} className={styles.image} loading="lazy" />
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category} style={{ color: categoryColor }}>
            {blog.category}
          </span>
          <span className={styles.date}>{displayDate}</span>
        </div>

        <Link to={`/blog/view/${blog.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{blog.title}</h3>
        </Link>

        <p className={styles.author}>By {blog.author}</p>

        {blog.status === 'Draft' ? <span className={styles.draftBadge}>Draft</span> : null}
      </div>

      {showActions ? (
        <>
          <IconButton
            className={styles.menuButton}
            size="small"
            onClick={(event) => setMenuAnchor(event.currentTarget)}
            aria-label="Article actions"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
            <MenuItem
              onClick={() => {
                navigate(`/blog/view/${blog.id}`);
                closeMenu();
              }}
            >
              View
            </MenuItem>
            {canEditBlog?.(blog) ? (
              <MenuItem
                onClick={() => {
                  navigate(`/blog/edit/${blog.id}`);
                  closeMenu();
                }}
              >
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Edit
              </MenuItem>
            ) : null}
            {blog.status === 'Draft' && canEditBlog?.(blog) ? (
              <MenuItem
                onClick={() => {
                  onPublish(blog);
                  closeMenu();
                }}
              >
                <PublishIcon fontSize="small" sx={{ mr: 1 }} />
                Publish
              </MenuItem>
            ) : null}
            {canDeleteBlog?.(blog) ? (
              <MenuItem
                onClick={() => {
                  onDelete(blog);
                  closeMenu();
                }}
              >
                Delete
              </MenuItem>
            ) : null}
          </Menu>
        </>
      ) : null}
    </article>
  );
}

export default ArticleCard;
