import AppRoutes from './routes/AppRoutes.jsx';
import Navbar from './components/layout/Navbar.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import styles from './App.module.css';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className={styles.appShell}>
        <AppRoutes />
      </main>
    </AuthProvider>
  );
}

export default App;
