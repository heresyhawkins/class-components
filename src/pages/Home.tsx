import { Outlet } from 'react-router-dom';
import Form from '../components/Form';
import Flyout from '../components/Flyout/Flyout';
import ThemeSelector from '../components/ThemeSelector/ThemeSelector';
import './Home.scss';

export default function Home() {
  return (
    <div className="home-layout">
      <ThemeSelector />
      <Form />
      <Outlet />
      <Flyout />
    </div>
  );
}
