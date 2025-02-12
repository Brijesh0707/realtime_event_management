import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';
import * as jwt from 'jwt-decode';

const Homescreen = lazy(() => import('./pages/Home/Homescreen'));
const LoginScreen = lazy(() => import('./pages/Auth/Login'));
const RegisterScreen = lazy(() => import('./pages/Auth/Register'));
const EventCreate = lazy(() => import('./pages/Event/CreateEventScreen'));
const JoinedEventList = lazy(() => import('./pages/Event/JoinedEventList'));


const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');


  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwt.jwtDecode(authToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('authToken');
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }
};

const PublicRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    try {
      const decodedToken = jwt.jwtDecode(authToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('authToken');
        return children;
      }
      return <Navigate to="/" replace />;
    } catch (error) {

      localStorage.removeItem('authToken');
      return children;
    }
  }


  return children;
};

function App() {
  useEffect(() => {
    const checkTokenExpiration = () => {
      const authToken = localStorage.getItem('authToken');
      
      if (authToken) {
        try {
          const decodedToken = jwt.jwtDecode(authToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          localStorage.removeItem('authToken');
        }
      }
    };
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SocketProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homescreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/create"
            element={
              <ProtectedRoute>
                <EventCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/join/list"
            element={
              <ProtectedRoute>
                <JoinedEventList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterScreen />
              </PublicRoute>
            }
          />
          <Route
            path="*"
            element={
              localStorage.getItem('authToken') ? 
                <Navigate to="/" replace /> : 
                <Navigate to="/login" replace />
            }
          />
        </Routes>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 10000,
          }}
        />
      </Suspense>
    </SocketProvider>
  );
}

export default App;