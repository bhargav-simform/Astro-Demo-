import { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button 
      onClick={() => setCount(count + 1)}
      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
    >
      Count: {count}
    </button>
  );
}
