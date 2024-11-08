import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import BlogsList from '../components/BlogsList';
import { Container } from 'react-bootstrap';

export default function HomeView() {
  const [blogs, setBlogs] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/blogs');
      const result = await response.json();
      setBlogs(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <NavBar onPostCreated={fetchData} />
      <Container>
        <main>
          <h1 className="title-home">Upptäckarens dagbok</h1>
          <h2 className="sub-title-home">
            För dig som älskar äventyr och nya upptäckter!
          </h2>
          <BlogsList blogs={blogs} currentUserId={1} onDataChange={fetchData} />
        </main>
      </Container>
      <Footer />
    </>
  );
}
