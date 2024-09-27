import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Modal from './components/Modal';
import AddAccessesTab from './components/AddAccessesTab';
import TrackRequestsTab from './components/TrackRequestsTab';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const button = document.getElementById('access-management-button');
    if (button) {
      const handleClick = () => setIsOpen(prev => !prev);
      button.addEventListener('click', handleClick);
      return () => button.removeEventListener('click', handleClick);
    }
  }, []);

  return (
    <>
      <button
        id="access-management-button"
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
        }}
        onClick={() => setIsOpen(true)}
      >
        Access Management
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Access Management</h2>
        <Tabs>
          <TabList>
            <Tab>Add Accesses</Tab>
            <Tab>Track My Requests</Tab>
          </TabList>
          <TabPanel>
            <AddAccessesTab />
          </TabPanel>
          <TabPanel>
            <TrackRequestsTab />
          </TabPanel>
        </Tabs>
      </Modal>
    </>
  );
}

export default App;