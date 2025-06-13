import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='max-w-6xl mx-auto p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        {/* Left: Logo */}
        <div className='flex items-center justify-between w-full sm:w-auto'>
          <Link to='/' className='flex items-center'>
            <img src='./logo.png' alt='logo' className='w-9 h-9 mr-2' />
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
              <span className='text-slate-500'>Estate</span>
              <span className='text-slate-700'>Hub</span>
            </h1>
          </Link>

          {/* Profile icon on small screen (placed to the right) */}
          <div className='sm:hidden'>
            <Link to='/profile'>
              {currentUser ? (
                <img
                  className='rounded-full h-7 w-7 object-cover'
                  src={currentUser.avatar}
                  alt='profile'
                />
              ) : (
                <span className='text-slate-700 underline ml-3'>Sign in</span>
              )}
            </Link>
          </div>
        </div>

        {/* Center: Search bar */}
        <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-2 rounded-lg flex items-center w-full sm:w-auto'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-full sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit'>
            <FaSearch className='text-slate-600' />
          </button>
        </form>

        {/* Right: Nav links and profile on larger screens */}
        <ul className='hidden sm:flex gap-10 items-center'>
          <Link to='/'>
            <li className='text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='text-slate-700 hover:underline'>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-slate-700 hover:underline'>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
