import { useState, useEffect } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return (
    <div>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Count: {count}
      </button>
      {hydrated && (
        <div className="text-green-600 mt-2 font-medium">
          JS loaded! (Hydrated)
        </div>
      )}
    </div>
  );
}
