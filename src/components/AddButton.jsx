import { useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import Icon from './Icon';

export default function AddButton({ id, className = 'add-btn', children }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  const onClick = () => {
    add(id);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1100);
  };

  return (
    <button className={`${className}${added ? ' added' : ''}`} onClick={onClick}>
      {added ? <><Icon name="check" size="1em" /> Added</> : children}
    </button>
  );
}
