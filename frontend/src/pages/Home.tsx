// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  content: string;
  author: string;
  createdAt: Timestamp;
}

const Home: React.FC = () => {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  // Fetch posts from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData: Post[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postData);
    });

    return () => unsubscribe();
  }, []);

  // Handle creating a post
  const handlePostSubmit = async () => {
    if (postContent.trim() === "") return;

    try {
      await addDoc(collection(db, "posts"), {
        content: postContent,
        author: auth.currentUser?.email || "Anonymous",
        createdAt: Timestamp.now(),
      });
      setPostContent(""); // Clear the input field after submission
    } catch (err) {
      console.error("Error adding post: ", err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg mt-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Blog Home</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl"
          >
            Logout
          </button>
        </div>

        {/* Post creation form */}
        <div className="mb-6">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your post here..."
            className="w-full p-4 border rounded-xl resize-none h-24"
          />
          <button
            onClick={handlePostSubmit}
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl"
          >
            Create Post
          </button>
        </div>

        {/* Display posts */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-50 p-4 mb-4 rounded-xl shadow-sm"
            >
              <p className="text-gray-800 mb-2">{post.content}</p>
              <p className="text-sm text-gray-500">
                Posted by {post.author} on{" "}
                {post.createdAt.toDate().toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
