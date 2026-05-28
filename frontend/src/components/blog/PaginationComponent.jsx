import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import styles from './PaginationComponent.module.css';

function PaginationComponent({ count, page, onChange, total = 0, start = 0, end = 0 }) {
  if (total === 0) return null;

  return (
    <Box className={styles.footer}>
      <Typography variant="body2" color="text.secondary">
        Showing {start} to {end} of {total} records
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton size="small" disabled={page === 1} onClick={() => onChange(page - 1)}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        {Array.from({ length: count }).map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              type="button"
              className={page === pageNumber ? styles.activePage : styles.pageButton}
              onClick={() => onChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        <IconButton size="small" disabled={page === count} onClick={() => onChange(page + 1)}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}

export default PaginationComponent;
