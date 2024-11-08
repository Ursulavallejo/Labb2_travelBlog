import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/HomeView';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      offset: 80,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const router = createHashRouter([
    {
      children: [
        { element: <Login />, path: '/' },
        { element: <Home />, path: '/blogs' },
        { element: <Register />, path: '/register' },
        { element: <Profile />, path: '/profile' },
      ],
      element: (
        <>
          <Outlet />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
