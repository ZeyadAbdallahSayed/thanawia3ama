import React, { useState, useEffect } from 'react';
import { ScaleLoader } from "react-spinners";
import App from '../App';

const LoadingPage = () => {
  const [loading, setLoading] = useState(true); // Set initial to true

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  return (
    <>
      {loading ? (
        <div className='flex justify-center items-center h-screen bg-[#146e64]'>
          {/* Replace by thanwia 3ama typing style */}
          <ScaleLoader color='#1aad9b' height={150} width={10} />
        </div>
      ) : (
        <App />
      )}
    </>
  );
}

export default LoadingPage;
