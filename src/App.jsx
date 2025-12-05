import React from 'react';

const appBackground = {
  minHeight: '100vh',
  background: '#ff1bb7ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const textStyle = {
  color: '#fff',
  fontFamily: 'sans-serif',
  fontSize: '1rem',
  fontWeight: '200',
  textAlign: 'center',
};

export default function App() {
  return (
    <div style={appBackground}>
      <div style={textStyle}>
        Oh hey!<br />Under construction...
      </div>
    </div>
  );
}
