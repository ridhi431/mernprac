// src/components/sections/ContactForm.jsx
import { usePortfolio } from '../../context/PortfolioContext';

const ContactForm = () => {
  const { data, updateSection } = usePortfolio();
  const contact = data.contact;

  const handleChange = (e) =>
    updateSection('contact', { ...contact, [e.target.name]: e.target.value });

  return (
    <div className="flex flex-col gap-4">
      <input name="email" type="email" value={contact.email} onChange={handleChange}
        className="input input-bordered w-full" placeholder="Email *" />
      <input name="github" value={contact.github} onChange={handleChange}
        className="input input-bordered w-full" placeholder="GitHub URL" />
      <input name="linkedin" value={contact.linkedin} onChange={handleChange}
        className="input input-bordered w-full" placeholder="LinkedIn URL" />
    </div>
  );
};

export default ContactForm;