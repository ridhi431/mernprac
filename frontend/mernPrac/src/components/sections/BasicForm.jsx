
import { useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const BasicForm = () => {
  const { data, updateSection } = usePortfolio();
  const basic = data.basic;
  const fileRef = useRef(null);

  const handleChange = (e) =>
    updateSection('basic', {
      ...basic,
      [e.target.name]: e.target.value,
    });

  // Image ko center se square crop karke 256x256 resize karo
  const resizeImage = (file, size = 256) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;

          const min = Math.min(img.width, img.height);
          const sx = (img.width - min) / 2;
          const sy = (img.height - min) / 2;

          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas is unavailable'));
            return;
          }

          ctx.drawImage(
            img,
            sx, sy, min, min,
            0, 0, size, size
          );

          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };

        img.onerror = () =>
          reject(new Error('Could not load image'));

        img.src = reader.result;
      };

      reader.onerror = () =>
        reject(new Error('Could not read image'));

      reader.readAsDataURL(file);
    });

  // File select hone par automatically resize karo
  const handleFile = async (e) => {
    const file = e.target.files?.[0];

    // Same file dobara select karne ke liye
    e.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB.');
      return;
    }

    try {
      const photo = await resizeImage(file);

      updateSection('basic', {
        ...basic,
        photo,
      });
    } catch {
      alert('Could not process this image.');
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Photo upload and preview */}
      <div className="flex items-center gap-4">

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative group rounded-full shrink-0"
          aria-label="Change profile photo"
        >
          <div className="avatar placeholder">
            <div className="w-20 rounded-full bg-base-300 ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center overflow-hidden">
              {basic.photo ? (
                <img
                  src={basic.photo}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </div>
          </div>

          <div className="absolute inset-0 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            📷 Change
          </div>
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="btn btn-outline btn-sm"
          >
            Upload Photo
          </button>

          {basic.photo && (
            <button
              type="button"
              onClick={() =>
                updateSection('basic', {
                  ...basic,
                  photo: '',
                })
              }
              className="btn btn-ghost btn-sm text-error"
            >
              Remove Photo
            </button>
          )}

          <p className="text-xs opacity-60">
            JPG, PNG or other browser-supported image. Max 5 MB.
          </p>
        </div>
      </div>

      <input
        name="name"
        value={basic.name}
        onChange={handleChange}
        className="input input-bordered w-full"
        placeholder="Full name *"
      />

      <input
        name="title"
        value={basic.title}
        onChange={handleChange}
        className="input input-bordered w-full"
        placeholder="Title (e.g. Full Stack Developer) *"
      />

      <textarea
        name="bio"
        value={basic.bio}
        onChange={handleChange}
        className="textarea textarea-bordered w-full"
        rows={4}
        placeholder="Short bio"
      />

    </div>
  );
};

export default BasicForm;
