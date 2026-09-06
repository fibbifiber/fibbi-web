import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CATALOG } from '../data/catalog';
import { trackEvent } from '../lib/supabase';

const CartCtx = createContext(null);
const LS_KEY = 'fibbi_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState('cart'); // 'cart' | 'contact' | 'checking' | 'oos'

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    document.body.classList.toggle('cart-open', open);
  }, [open]);

  const add = (id) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      return found
        ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { id, qty: 1 }];
    });
    trackEvent('add_to_cart', { sku: id, price: CATALOG[id]?.price });
  };

  const inc = (id) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));

  const dec = (id) =>
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.qty * (CATALOG[i.id]?.price || 0), 0),
    [items]
  );

  const openCart = () => {
    setPanel('cart');
    setOpen(true);
  };
  const closeCart = () => setOpen(false);

  const checkout = () => {
    trackEvent('checkout_attempt', {
      subtotal,
      items: items.map((i) => ({ sku: i.id, qty: i.qty })),
    });
    setPanel('contact');
  };

  const runStockCheck = () => {
    setPanel('checking');
    setTimeout(() => {
      setPanel('oos');
      trackEvent('oos_shown', { subtotal });
    }, 2800);
  };

  const value = {
    items,
    count,
    subtotal,
    open,
    panel,
    add,
    inc,
    dec,
    openCart,
    closeCart,
    checkout,
    runStockCheck,
    backToCart: () => setPanel('cart'),
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);
