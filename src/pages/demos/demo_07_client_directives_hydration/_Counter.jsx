import { useState, useEffect } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      {hydrated && (
        <div style={{ color: '#16a34a', marginTop: '0.5rem', fontWeight: 500 }}>
          JS loaded! (Hydrated)
        </div>
      )}
    </div>
  );
}
