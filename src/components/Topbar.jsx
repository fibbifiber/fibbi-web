import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Icon from './Icon';

const links = [
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/journal', 'Journal'],
  ['/science', 'The Science'],
  ['/story', 'Our Story'],
  ['/play', 'Play'],
];

export default function Topbar() {
  const { count, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  return (
    <>
      <header className="topbar">
        <Link className="logo" to="/">
          fibbi<span className="spark">*</span>
        </Link>
        <nav className="nav" aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="top-actions">
          <button className="cart-btn" onClick={openCart}>
            <Icon name="cart" size="1.05em" /> Cart
            {count > 0 && (
              <span key={count} className="cart-count bump" style={{ display: 'flex' }}>
                {count}
              </span>
            )}
          </button>
          <Link className="btn btn-primary btn-sm" to="/shop">
            Shop
          </Link>
          <button
            className={`burger${open ? ' open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div className={`m-menu${open ? ' open' : ''}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              tabIndex={open ? 0 : -1}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="m-menu-foot">
          <Link className="btn btn-primary" to="/shop" tabIndex={open ? 0 : -1}>
            Shop the Range
          </Link>
          <span className="m-menu-note">free shipping above ₹499 · COD available</span>
        </div>
      </div>
    </>
  );
}
