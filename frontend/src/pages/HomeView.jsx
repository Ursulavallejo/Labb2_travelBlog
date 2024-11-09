import { useEffect, useState, useContext } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import BlogsList from '../components/BlogsList';
import { Container } from 'react-bootstrap';
import { UserContext } from '../Context/UserContext';

export default function HomeView() {
  const [blogs, setBlogs] = useState([]);
  const { ID } = useContext(UserContext);

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
      <header className="hero">
        <div className="hero__block1">
          <img src="http://unsplash.it/800/800" alt="RandomImage1" />
        </div>
        <div className="hero__block2">
          <img src="http://unsplash.it/1000/800" alt="RandomImage2" />
        </div>
        <div className="hero__title">
          <h1 className="title-home">Upptäckarens dagbok</h1>
        </div>
      </header>
      <Container>
        <h2 className="sub-title-home">
          För dig som älskar äventyr och nya upptäckter!
        </h2>
        <main>
          <BlogsList
            blogs={blogs}
            currentUserId={ID}
            onDataChange={fetchData}
          />
        </main>
      </Container>
      <Footer />
    </>
  );
}
