import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center rounded-b-2xl">
      <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-300 transition">
        CommunityForum
      </Link>

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden text-white focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="hidden lg:flex space-x-6">
        {user ? (
          <>
            <Link
              to="/"
              className={`hover:text-blue-400 transition ${
                isActive('/') ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to={`/profile/${user.id}`}
              className={`hover:text-blue-400 transition ${
                isActive(`/profile/${user.id}`) ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`hover:text-blue-400 transition ${
                isActive('/login') ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`hover:text-blue-400 transition ${
                isActive('/signup') ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Signup
            </Link>
          </>
        )}
      </div>

      {user && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-full text-sm font-medium"
        >
          Logout
        </button>
      )}

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 right-6 w-48 bg-gray-800 p-4 rounded-lg shadow-lg">
          {user ? (
            <>
              <Link
                to="/"
                className={`block py-2 px-4 hover:text-blue-400 transition ${
                  isActive('/') ? 'text-blue-400 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to={`/profile/${user.id}`}
                className={`block py-2 px-4 hover:text-blue-400 transition ${
                  isActive(`/profile/${user.id}`) ? 'text-blue-400 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`block py-2 px-4 hover:text-blue-400 transition ${
                  isActive('/login') ? 'text-blue-400 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`block py-2 px-4 hover:text-blue-400 transition ${
                  isActive('/signup') ? 'text-blue-400 font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
