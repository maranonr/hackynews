import React from 'react';

const Spinner = () => (
  <div
    style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden"></span>
    </div>
  </div>
);

export default Spinner;
