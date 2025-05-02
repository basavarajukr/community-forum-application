import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setForums, addForum, updateForum, deleteForum, setLoading, setError } from '../store/slices/forumSlice';
import { RootState } from '../store';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import toast from 'react-hot-toast';

type Forum = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  tags: { id: number; name: string }[];
  user: { id: number; name: string; email: string };
};

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { forums, loading, error } = useSelector((state: RootState) => state.forum);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [editingForumId, setEditingForumId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'create' | 'edit' | 'delete'>('create');
  const [forumToDelete, setForumToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get('http://localhost:5000/api/forums/forums');
        dispatch(setForums(res.data));
      } catch (err) {
        dispatch(setError('Failed to fetch forums'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchForums();

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }
  }, [dispatch]);

  const handleCreate = async () => {
    try {
      dispatch(setLoading(true));
      const newForum = {
        title,
        description,
        tags: tags.split(',').map((tag) => tag.trim()),
      };
      const res = await axios.post('http://localhost:5000/api/forums/forums', newForum, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      dispatch(addForum(res.data));
      closeModal();
      toast.success('Forum creation successful!');
    } catch (err) {
      dispatch(setError('Failed to create forum'));
      toast.error('Failed to create forum');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdate = async (forumId: number) => {
    try {
      dispatch(setLoading(true));
      const updatedForum = {
        title,
        description,
        tags: tags.split(',').map((tag) => tag.trim()),
      };
      const res = await axios.put(`http://localhost:5000/api/forums/forums/${forumId}`, updatedForum, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      dispatch(updateForum(res.data));
      closeModal();
      toast.success('Forum updation successful!');
    } catch (err) {
      dispatch(setError('Failed to update forum'));
      toast.error('Failed to update forum');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (forumId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/forums/forums/${forumId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      dispatch(deleteForum(forumId));
      closeModal();
      toast.success('Forum deletion successful!');
    } catch (err) {
      dispatch(setError('Failed to delete forum'));
      toast.error('Failed to delete forum');
    }
  };

  const openModal = (action: 'create' | 'edit' | 'delete', forumId: number | null = null) => {
    setActionType(action);

    if (action === 'edit' && forumId) {
      const forumToEdit = forums.find((forum) => forum.id === forumId);
      if (forumToEdit) {
        setTitle(forumToEdit.title);
        setDescription(forumToEdit.description);
        setTags(forumToEdit.tags.map((tag) => tag.name).join(', '));
        setEditingForumId(forumId);
      }
    }

    if (action === 'delete') {
      setForumToDelete(forumId);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingForumId(null);
    setTitle('');
    setDescription('');
    setTags('');
    setForumToDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Forums</h1>

      <button
        onClick={() => openModal('create')}
        className="bg-blue-500 text-white p-2 rounded mb-6"
      >
        Create Forum
      </button>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="space-y-6">
        {forums.map((forum: Forum) => (
          <div key={forum.id} className="bg-white p-6 rounded-lg shadow mb-6">
            <Link to={`/forum/${forum.id}`} className="text-xl font-semibold mb-2 block hover:text-blue-600">
              {forum.title}
            </Link>

            <p className="text-gray-700 mb-4">{forum.description}</p>

            {forum.tags.length > 0 && (
              <div className="mb-2">
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

            <div className="text-sm text-gray-500">
              Posted by <span className="font-medium">{forum.user.name}</span> on{' '}
              {new Date(forum.createdAt).toLocaleDateString()}
            </div>

            {forum.user.id === currentUserId && (
              <div className="mt-2">
                <button
                  onClick={() => openModal('edit', forum.id)}
                  className="text-blue-500 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => openModal('delete', forum.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              {actionType === 'create' ? 'Create Forum' : actionType === 'edit' ? 'Edit Forum' : 'Confirm Delete'}
            </h2>

            {actionType === 'create' || actionType === 'edit' ? (
              <>
                <input
                  type="text"
                  placeholder="Forum Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full p-2 mb-4 border rounded"
                />
                <textarea
                  placeholder="Forum Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full p-2 mb-4 border rounded"
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="block w-full p-2 mb-4 border rounded"
                />
                <button
                  onClick={() =>
                    actionType === 'edit'
                      ? handleUpdate(editingForumId as number)
                      : handleCreate()
                  }
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  {actionType === 'edit' ? 'Update Forum' : 'Create Forum'}
                </button>
              </>
            ) : (
              <>
                <p>Are you sure you want to delete this forum?</p>
                <button
                  onClick={() => handleDelete(forumToDelete as number)}
                  className="bg-red-500 text-white p-2 rounded mt-4"
                >
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white p-2 rounded mt-4 ml-4"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
