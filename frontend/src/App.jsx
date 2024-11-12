import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useEffect, Suspense } from 'react';
import { lazyWithPreload } from 'react-lazy-with-preload';
// import Home from './pages/HomeView';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Profile from './pages/Profile';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

const Home = lazyWithPreload(() => import('./pages/HomeView'));
const Login = lazyWithPreload(() => import('./pages/Login'));
const Register = lazyWithPreload(() => import('./pages/Register'));
const Profile = lazyWithPreload(() => import('./pages/Profile'));
const Gdpr = lazyWithPreload(() => import('./pages/GdprView'));

Home.preload();
Login.preload();
Register.preload();
Home.preload();
Gdpr.preload();

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
        {
          element: (
            <Suspense fallback={<>Loading...</>}>
              <Login />
            </Suspense>
          ),
          path: '/',
        },
        {
          element: (
            <Suspense fallback={<>Loading...</>}>
              <Home />
            </Suspense>
          ),
          path: '/blogs',
        },
        {
          element: (
            <Suspense fallback={<>Loading...</>}>
              <Register />
            </Suspense>
          ),
          path: '/register',
        },
        {
          element: (
            <Suspense fallback={<>Loading...</>}>
              <Profile />
            </Suspense>
          ),
          path: '/profile',
        },
        {
          element: (
            <Suspense fallback={<>Loading...</>}>
              <Gdpr />
            </Suspense>
          ),
          path: '/gdpr',
        },
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
