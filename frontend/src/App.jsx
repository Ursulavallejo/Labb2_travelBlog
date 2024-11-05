import {
  createHashRouter,
  // Link,
  Outlet,
  RouterProvider,
} from 'react-router-dom'
import Home from './pages/HomeView'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <Home />, path: '/blogs' },
        { element: <Login />, path: '/' },
        { element: <Register />, path: '/register' },
      ],
      element: (
        <>
          <main>
            <Outlet />
          </main>
        </>
      ),
    },
  ])

  return <RouterProvider router={router} />
}
// return (
//   <>
{
  /* NAVBar and FOOTER goes on HOME VIEW */
}
{
  /* <main>
        <h1>
          HERE WE NEED A ROUTER !! WHEN The user arrive to the page need TO SEE
          LOGIN after create a usser or login GO to HOMEVIEW : Maybe we need a
          temporal button to move from Login to Home view? That way we can see
          all pages we need .... and afterward remove it when the fucnion to log
          in is ready?
        </h1>

        <p>
          When we log in we can see the footer and the Navbar in Home view!!!
          THe NAvbar for sure... but footer maybe we can also show it on the log
          In? We can discuss this.
        </p>
      </main> */
}
{
  /* </>
  ) */
}

export default App
