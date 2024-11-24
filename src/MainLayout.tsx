import { Outlet } from 'react-router-dom';
import Headers from './components/header/header';
import Footers from './components/footer/Footer';
import './App.css';

const MainLayout = () => {
  return (
    <>
      <Headers />
      <div className="app-container">
        <div className="content">
          <Outlet />
        </div>
      </div>
      <Footers />
    </>
  );
};
export default MainLayout;
