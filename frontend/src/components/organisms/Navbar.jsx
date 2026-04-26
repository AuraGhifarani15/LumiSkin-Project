import { Link } from 'react-router-dom';
import Button from '../atoms/Button';

const Navbar = () => {
  const navLinks = [
    { label: 'Beranda', href: '#home' },
    { label: 'Fitur', href: '#features' },
    { label: 'Cara Kerja', href: '#how-it-works' },
  ];

  return (
    <nav className="w-full bg-white border-b border-neutral-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-medium text-neutral-900 no-underline">
          Lumi<span className="text-primary">Skin</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors duration-200 no-underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <Link to="/register">
          <Button size="sm">Daftar Gratis</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
