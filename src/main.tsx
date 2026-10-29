import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/archivo';
import '@fontsource-variable/unbounded';
import '@fontsource-variable/montserrat';
import './styles/materials.css';
import MaterialBoardApp from './MaterialBoardApp';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><MaterialBoardApp /></React.StrictMode>
);
