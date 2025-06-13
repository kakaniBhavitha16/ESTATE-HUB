import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(
          `https://estate-hub-9hrv.onrender.com/api/user/${listing.userRef}`
        );
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-4 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-xl mx-auto'>
          <p className='text-sm sm:text-base text-gray-700'>
            Contact <span className='font-semibold text-slate-700'>{landlord.username}</span> for{' '}
            <span className='font-semibold text-slate-700'>{listing.name.toLowerCase()}</span>
          </p>

          <textarea
            name='message'
            id='message'
            rows='4'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm sm:text-base resize-none'
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center py-3 px-6 rounded-lg hover:opacity-95 text-sm sm:text-base uppercase transition-all duration-200'
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
