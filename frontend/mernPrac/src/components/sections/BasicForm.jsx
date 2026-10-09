// src/components/sections/BasicForm.jsx
import { usePortfolio } from '../../context/PortfolioContext';

const BasicForm = () => {
  const { data, updateSection } = usePortfolio();
  const basic = data.basic;

  const handleChange = (e) =>
    updateSection('basic', { ...basic, [e.target.name]: e.target.value });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="avatar placeholder">
          <div className="w-20 rounded-full bg-base-300 ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center">
            {basic.photo ? (
              <img src={basic.photo} alt="preview" onError={(e) => (e.currentTarget.style.display = 'none')} />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
        </div>
        <input name="photo" value={basic.photo} onChange={handleChange}
          className="input input-bordered w-full" placeholder="Photo URL" />
      </div>

      <input name="name" value={basic.name} onChange={handleChange}
        className="input input-bordered w-full" placeholder="Full name *" />
      <input name="title" value={basic.title} onChange={handleChange}
        className="input input-bordered w-full" placeholder="Title (e.g. Full Stack Developer) *" />
      <textarea name="bio" value={basic.bio} onChange={handleChange}
        className="textarea textarea-bordered w-full" rows={4} placeholder="Short bio" />
    </div>
  );
};

export default BasicForm;