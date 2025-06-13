import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await fetch('https://estate-hub-4ypa.onrender.com/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate user with backend');
      }

      const userData = await response.json();
      dispatch(signInSuccess(userData));
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error.message);
      alert('Google sign-in failed. Please try again.');
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 w-full text-white p-3 rounded-lg uppercase hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-red-500'
    >
      Continue with Google
    </button>
  );
}
