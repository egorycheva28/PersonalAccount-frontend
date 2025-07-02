import './App.css';
import React from 'react';
import RoutesPage from './Router';
import { BrowserRouter } from "react-router-dom";
import './i18n';
import Flag from './components/flag/flag';
import Menu from './components/menu/menu';

function App() {
  return (
    <div className="App">
      <div color="container">
        <BrowserRouter>
          {/*<Menu />*/}
          <Flag />
          <RoutesPage />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
