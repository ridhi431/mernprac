
// src/pages/Profile.jsx
import { useEffect, useState,useRef} from 'react';
import axios from 'axios';

const Profile = () => {

    const fileRef = useRef(null);

  // Crop to a square and shrink to 256x256, so the saved image stays small
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
          canvas.getContext('2d').drawImage(img, sx, sy, min, min, 0, 0, size, size);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // lets the user pick the same file again later
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please choose an image file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 5 MB.' });
      return;
    }

    try {
      const dataUrl = await resizeImage(file);
      setForm((f) => ({ ...f, photo: dataUrl }));
      setMessage({ type: '', text: '' });
    } catch {
      setMessage({ type: 'error', text: 'Could not read that image.' });
    }
  };

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [form, setForm] = useState({ name: '', bio: '', photo: '' });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load the saved profile when the page opens
  useEffect(() => {
    axios
      .get('/api/users/me', { headers })
      .then((res) => {
        const u = res.data;
        setForm({ name: u.name || '', bio: u.bio || '', photo: u.photo || '' });
        setEmail(u.email || '');
      })
      .catch((err) =>
        setMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to load profile',
        })
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await axios.put('/api/users/me', form, { headers });
      setForm({
        name: res.data.name || '',
        bio: res.data.bio || '',
        photo: res.data.photo || '',
      });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      // Tell the navbar to refresh its avatar
      window.dispatchEvent(new Event('profile-updated'));
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-1">My Profile</h1>
      <p className="opacity-70 mb-6">Update your name, bio and photo.</p>

      <form onSubmit={handleSave} className="card bg-base-100 border border-base-300 shadow">
        <div className="card-body gap-5">
          {/* Photo preview */}
                   {/* Photo: click to upload */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group rounded-full shrink-0"
              aria-label="Change photo"
            >
              <div className="avatar placeholder">
                <div className="w-24 rounded-full bg-base-300 ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center overflow-hidden">
                  {form.photo ? (
                    <img src={form.photo} alt="profile" />
                  ) : (
                    <span className="text-4xl">{form.name?.[0]?.toUpperCase() || '👤'}</span>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                Upload photo
              </button>
              {form.photo && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, photo: '' }))}
                  className="btn btn-ghost btn-sm text-error"
                >
                  Remove photo
                </button>
              )}
              <p className="text-xs opacity-60">JPG or PNG, up to 5 MB.</p>
            </div>
          </div>

          <label className="form-control w-full">
            <span className="label-text mb-1">Full name *</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Your name"
              required
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1">Email</span>
            <input
              value={email}
              disabled
              className="input input-bordered w-full"
            />
            <span className="label-text-alt opacity-60 mt-1">Email can't be changed.</span>
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1">Bio</span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={4}
              placeholder="Tell us a little about yourself"
            />
          </label>

          {message.text && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} text-sm`}>
              {message.text}
            </div>
          )}

          <div className="card-actions justify-end">
            <button type="submit" disabled={saving || !form.name.trim()} className="btn btn-primary">
              {saving ? <span className="loading loading-spinner loading-sm" /> : 'Save changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;