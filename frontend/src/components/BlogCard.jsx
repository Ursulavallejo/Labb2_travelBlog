import { useState } from "react";
import CommentModal from "./CommentModal";
export default function BlogCard() {
  const [showCommentModal, setShowCommentModal] = useState(false);
  // Modal bootstrap kommer hit
  return (
    <div>
      <h3>En blog om ett land</h3>
      <p>Det här är en kort beskrivning av bloggen.</p>
      <button
        className='btn btn-primary'
        onClick={() => setShowCommentModal(!showCommentModal)}>
        {showCommentModal ? "Dölj Kommentarer" : "Visa Kommentarer"}
      </button>
      {showCommentModal && <CommentModal />}
    </div>
  );
}
