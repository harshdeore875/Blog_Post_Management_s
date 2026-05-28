import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

function SearchBar({ value, onChange, placeholder = 'Search blogs' }) {
  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchBar;
