// Here all the post should be showed >>>  using Blog_Card for each post
import { useState } from 'react'
import BlogCard from './BlogCard'

export default function BlogsList() {
  const [showBlogCard, setShowBlogCard] = useState(false)
  // Vi kan använda router params för att hämta varje land. Det är en temporary lösning för att se.
  return (
    <>
      <h2>Här visas alla blogginlägg</h2>
      <p>Klicka för att visa en bloggpost</p>
      <button
        className="btn btn-success"
        onClick={() => setShowBlogCard(!showBlogCard)}
      >
        {showBlogCard ? 'Dölj Bloggpost' : 'Visa Bloggpost'}
      </button>
      {showBlogCard && <BlogCard />}
    </>
  )
}
