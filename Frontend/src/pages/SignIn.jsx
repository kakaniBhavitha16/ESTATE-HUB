import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('https://estatehub-d6kx.onrender.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-lg mx-auto'>
        {/* Main Card */}
        <div className='bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden'>
          {/* Header Section */}
          <div className='px-8 pt-8 pb-6 text-center bg-gradient-to-b from-white/50 to-transparent'>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-3'>
              Welcome Back
            </h1>
            <p className='text-slate-500 text-base'>Sign in to your account</p>
          </div>

          {/* Form Section */}
          <div className='px-8 pb-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email Input */}
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-semibold text-slate-700 block ml-1'>
                  Email Address
                </label>
                <input
                  type='email'
                  placeholder='Enter your email address'
                  className='w-full px-5 py-4 rounded-2xl border-2 border-slate-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 placeholder:text-slate-400 text-slate-700 font-medium shadow-sm'
                  id='email'
                  onChange={handleChange}
                />
              </div>

              {/* Password Input */}
              <div className='space-y-2'>
                <label htmlFor='password' className='text-sm font-semibold text-slate-700 block ml-1'>
                  Password
                </label>
                <input
                  type='password'
                  placeholder='Enter your password'
                  className='w-full px-5 py-4 rounded-2xl border-2 border-slate-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 placeholder:text-slate-400 text-slate-700 font-medium shadow-sm'
                  id='password'
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div className='pt-2'>
                <button
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 text-white py-4 px-6 rounded-2xl font-bold text-lg tracking-wide hover:from-slate-700 hover:via-slate-600 hover:to-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0'
                >
                  {loading ? (
                    <div className='flex items-center justify-center'>
                      <svg className='animate-spin -ml-1 mr-3 h-6 w-6 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* OAuth Divider */}
              <div className='relative py-4'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t-2 border-slate-200/60'></div>
                </div>
                <div className='relative flex justify-center'>
                  <span className='px-6 py-2 bg-white/80 backdrop-blur-sm text-slate-500 text-sm font-medium rounded-full border border-slate-200/60'>
                    or continue with
                  </span>
                </div>
              </div>
              
              {/* OAuth Component */}
              <div className='flex justify-center'>
                <OAuth />
              </div>
            </form>

            {/* Sign Up Link */}
            <div className='mt-8 pt-6 border-t border-slate-200/60 text-center'>
              <p className='text-slate-600 text-base'>
                Don't have an account?{' '}
                <Link 
                  to={'/sign-up'} 
                  className='font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline decoration-2 underline-offset-2 hover:decoration-blue-700'
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mt-6 p-4 bg-red-50/80 backdrop-blur-sm border-2 border-red-200/60 rounded-2xl'>
                <div className='flex items-center justify-center'>
                  <svg className='w-5 h-5 text-red-500 mr-3' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                  </svg>
                  <p className='text-red-700 text-sm font-semibold'>{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}