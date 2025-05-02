import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { User, Forum } from '../Types/types';
import toast from 'react-hot-toast';

export default function ForumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [forum, setForum] = useState<Forum | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchForum = async () => {
      const res = await axios.get(`http://localhost:5000/api/forums/forums/${id}`);
      setForum(res.data);
    };

    fetchForum();
  }, [id]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
        toast.success('You must be logged in to comment');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/forums/${id}`,
        { content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setForum((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, res.data],
            }
          : prev
      );

      setCommentContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setForum((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.filter((c) => c.id !== commentId),
            }
          : prev
      );
      toast.success('Comment deleted Successfuly!');
    } catch (err) {
      console.error(err);
      toast.error('Comment deleted Failed!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {forum ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{forum.title}</h1>
          <p className="mb-4">{forum.description}</p>

          {forum.tags.length > 0 && (
            <div className="mb-4">
              {forum.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-500 mb-6">
            Posted by <span className="font-medium">{forum.user.name}</span> on{' '}
            {new Date(forum.createdAt).toLocaleDateString()}
          </div>

          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          {forum.comments.length === 0 && <p>No comments yet.</p>}
          {forum.comments.map((comment) => (
            <div key={comment.id} className="mb-4 p-3 bg-gray-100 rounded">
              <div className="text-sm text-gray-600 mb-1">
                {comment.user.name} on {new Date(comment.createdAt).toLocaleDateString()}
              </div>
              <p className="mb-2">{comment.content}</p>

              {comment.user.id === user?.id && (
                <button
                  onClick={() => {
                    setCommentToDelete(comment.id);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          <form onSubmit={handleSubmitComment} className="mt-6">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full border p-2 rounded mb-2"
              placeholder="Write a comment..."
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post Comment
            </button>
          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this comment?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="mr-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (commentToDelete !== null) {
                    handleDeleteComment(commentToDelete);
                  }
                  setShowDeleteModal(false);
                  setCommentToDelete(null);
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
