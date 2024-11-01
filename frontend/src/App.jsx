import "./App.css";

import BlogsList from "./pages/BlogsList";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
function App() {
  return (
    <>
      <NavBar />
      <main>
        <h1>TRAVEL BLOG!!</h1>
        <BlogsList />
      </main>
      <Footer />
    </>
  );
}

export default App;
