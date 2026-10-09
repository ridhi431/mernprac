// src/components/sections/SkillsForm.jsx
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const SkillsForm = () => {
  const { data, updateSection } = usePortfolio();
  const [input, setInput] = useState('');

  const addSkill = () => {
    const s = input.trim();
    if (s && !data.skills.includes(s)) {
      updateSection('skills', [...data.skills, s]);
    }
    setInput('');
  };

  const removeSkill = (s) =>
    updateSection('skills', data.skills.filter((x) => x !== s));

  return (
    <div className="flex flex-col gap-4">
      <div className="join w-full">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill();
            }
          }}
          className="input input-bordered join-item w-full"
          placeholder="Type a skill and press Enter"
        />
        <button type="button" onClick={addSkill} className="btn btn-primary join-item">Add</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.skills.length === 0 && (
          <p className="text-sm opacity-60">No skills added yet.</p>
        )}
        {data.skills.map((s) => (
          <span key={s} className="badge badge-lg badge-primary gap-2">
            {s}
            <button type="button" onClick={() => removeSkill(s)} aria-label={`remove ${s}`}>✕</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;