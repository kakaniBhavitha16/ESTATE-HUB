import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => setFileUploadError(true),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `https://estate-hub-4ypa.onrender.com/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `https://estate-hub-4ypa.onrender.com/api/user/delete/${currentUser._id}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(
        'https://estate-hub-4ypa.onrender.com/api/auth/signout'
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(
        `https://estate-hub-4ypa.onrender.com/api/user/listings/${currentUser._id}`
      );
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `https://estate-hub-4ypa.onrender.com/api/listing/delete/${listingId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-4 max-w-7xl mx-auto w-full'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col md:flex-row gap-6 md:items-start items-center md:justify-between md:gap-10 w-full'
      >
        {/* Profile Picture Upload */}
        <div className='flex flex-col items-center gap-2 md:w-1/3'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt='profile'
            className='rounded-full h-24 w-24 md:h-28 md:w-28 object-cover cursor-pointer'
          />
          <p className='text-sm text-center'>
            {fileUploadError ? (
              <span className='text-red-700'>
                Error uploading image (max 2 MB)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700'>Uploaded!</span>
            ) : (
              ''
            )}
          </p>
        </div>

        {/* User Info Inputs */}
        <div className='flex flex-col gap-4 md:w-2/3 w-full'>
          <input
            type='text'
            placeholder='Username'
            defaultValue={currentUser.username}
            id='username'
            className='border p-3 rounded-lg w-full'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='Email'
            id='email'
            defaultValue={currentUser.email}
            className='border p-3 rounded-lg w-full'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            onChange={handleChange}
            id='password'
            className='border p-3 rounded-lg w-full'
          />
          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              disabled={loading}
              className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 w-full'
            >
              {loading ? 'Loading...' : 'Update'}
            </button>
            <Link
              className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 w-full'
              to={'/create-listing'}
            >
              Create Listing
            </Link>
          </div>
        </div>
      </form>

      <div className='flex justify-between mt-6 flex-wrap gap-4 text-sm sm:text-base'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      <p className='text-red-700 mt-5'>{error && error}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User updated successfully!'}
      </p>

      <button
        onClick={handleShowListings}
        className='text-green-700 w-full mt-4 underline'
      >
        Show Listings
      </button>
      <p className='text-red-700 mt-2'>
        {showListingsError && 'Error showing listings'}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3'>
          <h1 className='text-center text-2xl font-semibold col-span-full'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-20 w-20 object-cover rounded'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline flex-1 truncate'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col gap-1 text-sm text-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
