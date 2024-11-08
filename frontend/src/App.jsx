import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom';
import Home from './pages/HomeView';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

export default function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <Login />, path: '/' },
        { element: <Home />, path: '/blogs' },
        { element: <Register />, path: '/register' },
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
