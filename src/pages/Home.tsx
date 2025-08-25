import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import Modal from '../components/Modal/Modal';
import Form from '../components/Form';
import Flyout from '../components/Flyout/Flyout';
import ThemeSelector from '../components/ThemeSelector/ThemeSelector';
import './Home.scss';
import ControlledForm from '../components/forms/ControlledForm';
import { Outlet } from 'react-router-dom';
import UncontrolledForm from '../components/forms/UncontrolledForm';

export default function Home() {
  const [modal, setModal] = useState<'hook' | 'uncontrolled' | 'controlled' | null>(null);
  const { entries } = useAppSelector((state) => state.form);

  return (
    <div className="home-layout">
      <ThemeSelector />

      <div className="form-actions">
        <button type="button" onClick={() => setModal('uncontrolled')}>
          Open Uncontrolled Form
        </button>
        <button type="button" onClick={() => setModal('controlled')}>
          Open Controlled Form
        </button>
      </div>

      <Form />

      <div className="entries">
        <h2>Submitted Entries</h2>
        {entries.map((entry) => (
          <div key={entry.id} className="entry-card new-entry">
            <img src={entry.photo} alt="User" width="50" height="50" />
            <p>
              <strong>{entry.name}</strong> ({entry.age})
            </p>
            <p>
              {entry.email} • {entry.country}
            </p>
          </div>
        ))}
      </div>

      <Outlet />
      <Flyout />

      <Modal isOpen={modal === 'uncontrolled'} onClose={() => setModal(null)}>
        <UncontrolledForm onClose={() => setModal(null)} />
      </Modal>

      <Modal isOpen={modal === 'controlled'} onClose={() => setModal(null)}>
        <ControlledForm onClose={() => setModal(null)} />
      </Modal>
    </div>
  );
}
