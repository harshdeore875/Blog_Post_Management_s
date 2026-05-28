import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import { adminApi } from '../../services/adminApi.js';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleRoleChange = async (userId, role) => {
    try {
      const updatedUser = await adminApi.updateUserRole(userId, role);
      setUsers((current) => current.map((user) => (user._id === userId ? updatedUser : user)));
      toast.success('User role updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteUser(deleteConfirm.userId);
      setUsers((current) => current.filter((user) => user._id !== deleteConfirm.userId));
      toast.success('User deleted successfully');
      setDeleteConfirm({ open: false, userId: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <LoadingSpinner label="Loading users" />;

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        User Management
      </Typography>

      <Box sx={{ mb: 2 }}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search users by name or email" />
      </Box>

      {filteredUsers.length === 0 ? (
        <EmptyState
          title={searchTerm ? 'No users found' : 'No users yet'}
          message={searchTerm ? 'Try adjusting your search criteria.' : 'No users have been registered yet.'}
        />
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Verified</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={user.role}
                      onChange={(event) => handleRoleChange(user._id, event.target.value)}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="author">Author</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>{user.isVerified ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <DeleteIcon
                      sx={{ cursor: 'pointer', color: '#d32f2f' }}
                      onClick={() => setDeleteConfirm({ open: true, userId: user._id })}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirm({ open: false, userId: null })}
      />
    </>
  );
}

export default UserManagement;
