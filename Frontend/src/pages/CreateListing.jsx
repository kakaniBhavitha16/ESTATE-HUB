import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(
        'https://estate-hub-4ypa.onrender.com/api/listing/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        }
      );
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate('/');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-4 max-w-6xl mx-auto'>
      <h1 className='text-2xl sm:text-3xl font-semibold text-center my-6'>
        Create a Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-6 md:flex-row md:gap-8'
      >
        {/* LEFT SIDE */}
        <div className='flex flex-col gap-5 w-full md:w-1/2'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg w-full'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg w-full h-28 resize-none'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg w-full'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className='flex flex-wrap gap-4'>
            {[
              ['sale', 'Sell'],
              ['rent', 'Rent'],
              ['parking', 'Parking spot'],
              ['furnished', 'Furnished'],
              ['offer', 'Offer'],
            ].map(([id, label]) => (
              <div className='flex items-center gap-2' key={id}>
                <input
                  type='checkbox'
                  id={id}
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={
                    id === 'sale' || id === 'rent'
                      ? formData.type === id
                      : formData[id]
                  }
                />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className='flex flex-wrap gap-4'>
            {[
              ['bedrooms', 'Beds'],
              ['bathrooms', 'Baths'],
              ['regularPrice', 'Regular price'],
            ].map(([id, label]) => (
              <div key={id} className='flex flex-col sm:flex-row items-center gap-2'>
                <input
                  type='number'
                  id={id}
                  min='1'
                  required
                  className='p-3 border rounded-lg w-32'
                  onChange={handleChange}
                  value={formData[id]}
                />
                <p>{label}</p>
              </div>
            ))}
            {formData.offer && (
              <div className='flex flex-col sm:flex-row items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  required
                  className='p-3 border rounded-lg w-32'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p>Discounted Price</p>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-4 w-full md:w-1/2'>
          <p className='font-semibold'>
            Images:{' '}
            <span className='font-normal text-gray-600'>
              (Max 6 – first will be cover)
            </span>
          </p>
          <div className='flex flex-col sm:flex-row gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded hover:shadow-md disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {imageUploadError && (
            <p className='text-red-700 text-sm'>{imageUploadError}</p>
          )}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between items-center p-3 border rounded'
              >
                <img
                  src={url}
                  alt='listing'
                  className='w-20 h-20 object-cover rounded'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='text-red-700 hover:underline'
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-70 uppercase'
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
