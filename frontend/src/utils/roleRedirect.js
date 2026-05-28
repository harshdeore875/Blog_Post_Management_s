export const getRoleHomePath = (role) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'author') return '/author/dashboard';
  return '/blogs';
};
