import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import BlogsList from '../components/BlogsList'
import { Container } from 'react-bootstrap'

export default function HomeView() {
  return (
    <>
      <NavBar />
      <Container>
        <main>
          <h1 className="title-home">Upptäckarens dagbok</h1>
          <h2 className="sub-title-home">
            För dig som älskar äventyr och nya upptäckter!
          </h2>
          <BlogsList />
        </main>
      </Container>
      <Footer />
    </>
  )
}
