import React, { useEffect, useState } from 'react';
import { resetClickerPR, getClickerPR } from '../utils/localStorageHelpers';
import { Link } from 'react-router-dom';

const ResetClickerPR = () => {
  const [pr, setPr] = useState(null);
  useEffect(() => {
    resetClickerPR();
    setPr(getClickerPR());
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Clicker PR Reset</h2>
      <p>Clicker PR has been reset to: <strong>{pr}</strong></p>
      <p><Link to="/games">Back to Library</Link></p>
    </div>
  );
};

export default ResetClickerPR;
