import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import BlogsList from '../components/BlogsList'
// TO USE REACTboostrap
export default function HomeView() {
  return (
    <>
      <NavBar />
      <main>
        <h1>TRAVEL BLOG</h1>
        <BlogsList />
      </main>
      <Footer />
    </>
  )
}
