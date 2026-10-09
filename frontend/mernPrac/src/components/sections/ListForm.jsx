// src/components/sections/ListForm.jsx
import { usePortfolio } from '../../context/PortfolioContext';

const ListForm = ({ sectionKey, fields, itemLabel, addLabel }) => {
  const { data, updateSection } = usePortfolio();
  const items = data[sectionKey];
  const emptyItem = Object.fromEntries(fields.map((f) => [f.name, '']));

  const update = (i, name, value) =>
    updateSection(
      sectionKey,
      items.map((it, idx) => (idx === i ? { ...it, [name]: value } : it))
    );
  const add = () => updateSection(sectionKey, [...items, emptyItem]);
  const remove = (i) => updateSection(sectionKey, items.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="border border-base-300 rounded-box p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{itemLabel} {i + 1}</span>
            {items.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="btn btn-ghost btn-xs text-error">
                Remove
              </button>
            )}
          </div>

          {fields.map((f) =>
            f.type === 'textarea' ? (
              <textarea key={f.name} value={item[f.name] || ''}
                onChange={(e) => update(i, f.name, e.target.value)}
                className="textarea textarea-bordered w-full" rows={3} placeholder={f.placeholder} />
            ) : (
              <input key={f.name} value={item[f.name] || ''}
                onChange={(e) => update(i, f.name, e.target.value)}
                className="input input-bordered w-full" placeholder={f.placeholder} />
            )
          )}
        </div>
      ))}

      <button type="button" onClick={add} className="btn btn-outline btn-sm self-start">
        + {addLabel}
      </button>
    </div>
  );
};

export default ListForm;