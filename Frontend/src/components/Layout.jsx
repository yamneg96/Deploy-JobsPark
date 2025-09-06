import { useState, useEffect } from 'react';
import { Menu, X, Twitter, Briefcase, CircleDollarSign, User, Linkedin, LogOut } from 'lucide-react';
import { FaSpinner, FaRegistered } from 'react-icons/fa';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { logout as logoutService } from '../services/auth';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout, loading, userRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.error('Logout error:', err);
    }
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  // ⚠️ Renders a loading spinner while the user state is being fetched.
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        {/* Using FaSpinner for a spinning animation */}
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  };

  const UserImage = ({ user, userRole }) => (
    <img src={user.image} alt={`${userRole} picture`} className="w-6 h-6 rounded-full mr-1 justify-baseline" />
  );

  const navLinks = user
    ? (userRole === 'client' ? ([
        { href: `/${user.role}-profile`, label: 'Profile', icon: UserImage },
        { href: '/payment', label: 'Payment', icon: CircleDollarSign },
        { href: '#', label: 'Logout', icon: LogOut, onClick: handleLogout },
      ]) : ([
        { href: `/${user.role}-profile`, label: 'Profile', icon: UserImage },
        { href: '/payment', label: 'Payment', icon: CircleDollarSign },
        { href: '#', label: 'Logout', icon: LogOut, onClick: handleLogout },]
      ))
    : [
        { href: '/login', label: 'Login', icon: User },
        { href: '/register', label: 'Register', icon: FaRegistered },
        { href: '/payment', label: 'Payment', icon: CircleDollarSign },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-2 rounded-lg">
                <Briefcase className="h-6 w-6" />
              </div>
              <span>JobsPark</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-4">
              {navLinks.map(({ href, label, icon: Icon, onClick }) => (
                <Link
                  key={href}
                  to={href === '#' ? location.pathname : href}
                  onClick={onClick || null}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
                    location.pathname === href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon user={user} userRole={userRole} className="h-4 w-4 mr-1" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6 cursor-pointer" /> : <Menu className="h-6 w-6 cursor-pointer" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white px-4 py-3 space-y-2">
            {navLinks.map(({ href, label, icon: Icon, onClick }) => (
              <Link
                key={href}
                to={href === '#' ? location.pathname : href}
                onClick={() => {
                  if (onClick) onClick();
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                  location.pathname === href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon user={user} userRole={userRole} className="h-4 w-4 inline-block mr-1" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2 flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="logo">
                <Briefcase className="h-20 w-20" />
              </div>
              <span className="text-5xl font-bold text-white">JobsPark</span>
            </div>
            <p className="text-gray-400 max-w-xs">
              Connect skilled professionals with amazing opportunities. Whether you're looking for
              work or need expert help, JobSpark makes it happen.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-3">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/register" className="hover:underline">
                  Register
                </a>
              </li>
              <li>
                <a href="/login" className="hover:underline">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Why JobsPark
                </a>
              </li>
              <li>
                <a href="mailto:yamlaknegash96@gmail.com" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Resources
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  Support
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Us */}
            <div>
              <h3 className="font-semibold text-white mb-2">Contact Us</h3>
              <p className="text-gray-400 text-sm">
                Email:{' '}
                <a href="mailto:contact@ethronics.org" className="hover:underline">
                  contact@ethronics.org
                </a>
              </p>
              <p className="text-gray-400 text-sm">Phone: (251) 978-467-467</p>
              <p className="text-gray-400 text-sm">Address: 9th floor AMG, Mebrat hail, Adama</p>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-semibold text-white mb-2">Follow Us</h3>
              <div className="flex space-x-4 mt-2 justify-baseline">
                <a href="https://x.com" aria-label="X" className="hover:text-white">
                  <Twitter />
                </a>
                <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-white">
                  <Linkedin />
                </a>
                <a
                  href="https://github.com/Ethronics/Jobs-park-Platform"
                  aria-label="GitHub"
                  className="hover:text-white"
                >
                  <img src="./github.svg" alt="github-icon" className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}