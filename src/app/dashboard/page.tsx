"use client";

import { ID, Models } from "appwrite";
import { FormEvent, useEffect, useState } from "react";
import { account, database } from "../appwrite";

export default function Dashboard() {
  const [post, setPost] = useState<string>("");
  const [user, setUser] = useState<Models.User<Models.Preferences>>();
  const [posts, setPosts] = useState<Models.Document[]>([]);

  async function checkAuth() {
    try {
      const user = await account.get();
      setUser(user);
    } catch (err) {
      console.error(err);
      window.location.href = "/";
    }
  }

  async function fetchPosts() {
    if (!user) return;

    try {
      const posts = await database.listDocuments("mydatabase", "posts");

      setPosts(posts.documents.reverse());
    } catch (err) {
      console.error(err);
      alert("Error fetching posts");
    }
  }

  async function logout() {
    await account.deleteSession("current");
    window.location.href = "/";
  }

  async function createPost(e: FormEvent) {
    e.preventDefault();

    if (!user) return alert("You must be logged in to create a post.");
    if (!post) return alert("You cannot create an empty post.");

    try {
      await database.createDocument("mydatabase", "posts", ID.unique(), {
        from: user.email,
        content: post,
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("There was an error creating your post.");
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return (
    <div className="max-w-2xl w-full mx-auto mt-5 flex flex-col">
      <form onSubmit={createPost} className="flex gap-5">
        <input
          type="text"
          className="border border-black px-3"
          placeholder="What's happening..."
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <button
          type="submit"
          className="border border-black bg-black text-white px-5"
        >
          Create Post
        </button>
        <button
          type="button"
          onClick={logout}
          className="border border-black bg-black text-white px-5"
        >
          Logout
        </button>
      </form>

      <div>
        {posts.map((post) => (
          <div className="mt-3">
            <div className="font-bold">{post.from}</div>
            <div>{post.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
