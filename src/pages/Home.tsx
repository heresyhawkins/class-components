import './Home.scss';
import { Outlet } from 'react-router-dom';
import Form from '../components/Form/Form';

export default function Home() {
  return (
    <div className="home-layout">
      <Form />
      <Outlet />
    </div>
  );
}
