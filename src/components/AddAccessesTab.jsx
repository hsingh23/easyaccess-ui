
import React, { useState, useCallback, useEffect } from 'react';
import { Download, Upload, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMutation } from 'react-query';
import CustomDropdown from './CustomDropdown';
import AccessCard from './AccessCard';
import { getUsers, getAccessItems, makeRequests } from '../services/api';

const AddAccessesTab = () => {
  const [defaultUsers, setDefaultUsers] = useState([]);
  const [selectedAccesses, setSelectedAccesses] = useState([]);
  const [businessJustification, setBusinessJustification] = useState("I'm a member of team X working on project Y and need this to do my job.");
  const [customJustifications, setCustomJustifications] = useState({});
  const [notes, setNotes] = useState({});
  const [userOptions, setUserOptions] = useState([]);
  const [accessOptions, setAccessOptions] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingAccesses, setIsLoadingAccesses] = useState(false);

  const makeRequestsMutation = useMutation(makeRequests, {
    onSuccess: (data) => {
      toast.success('Requests submitted successfully');
      setSelectedAccesses([]);
      setCustomJustifications({});
      setNotes({});
    },
    onError: (error) => {
      toast.error('Error submitting requests');
    },
  });

  const debouncedSearchUsers = useCallback(
    (inputValue) => {
      setIsLoadingUsers(true);
      getUsers(inputValue).then(users => {
        setUserOptions(users);
        setIsLoadingUsers(false);
      });
    },
    []
  );

  const debouncedSearchAccesses = useCallback(
    (inputValue) => {
      setIsLoadingAccesses(true);
      getAccessItems(inputValue).then(accesses => {
        setAccessOptions(accesses);
        setIsLoadingAccesses(false);
      });
    },
    []
  );

  useEffect(() => {
    debouncedSearchUsers('');
    debouncedSearchAccesses('');
  }, []);

  const handleAddAccess = (access) => {
    setSelectedAccesses(prev => [...prev, { ...access, users: [...defaultUsers] }]);
  };

  const handleUserChange = (accessId, users) => {
    setSelectedAccesses(prevAccesses => 
      prevAccesses.map(access => 
        access.id === accessId ? { ...access, users } : access
      )
    );
  };

  const applyDefaultUsersToAll = () => {
    setSelectedAccesses(prevAccesses => 
      prevAccesses.map(access => ({ ...access, users: [...defaultUsers] }))
    );
  };

  const handleSubmit = () => {
    const requests = selectedAccesses.flatMap(access => ({
      access: access,
      users: access.users,
      businessJustification: customJustifications[access.id] || businessJustification,
      note: notes[access.id] || ''
    }));
    makeRequestsMutation.mutate(requests);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result);
          setDefaultUsers(importedData.defaultUsers || []);
          setSelectedAccesses(importedData.selectedAccesses || []);
          setBusinessJustification(importedData.businessJustification || '');
          setCustomJustifications(importedData.customJustifications || {});
          setNotes(importedData.notes || {});
          toast.success('Data imported successfully');
        } catch (error) {
          toast.error('Error importing data');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const dataToExport = {
      defaultUsers,
      selectedAccesses,
      businessJustification,
      customJustifications,
      notes
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'access_requests.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2">
        <button className="px-4 py-2 bg-gray-200 rounded flex items-center" onClick={handleExport}>
          <Download className="mr-2" size={16} />
          Export
        </button>
        <label className="px-4 py-2 bg-gray-200 rounded flex items-center cursor-pointer">
          <Upload className="mr-2" size={16} />
          Import
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Default Users</label>
        <div className="flex items-center space-x-2">
          <CustomDropdown
            options={userOptions}
            value={defaultUsers}
            onChange={setDefaultUsers}
            placeholder="Select default users..."
            isMulti={true}
            isLoading={isLoadingUsers}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
            onClick={applyDefaultUsersToAll}
          >
            <UserPlus className="mr-2" size={16} />
            Apply to All
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Add Access</label>
        <CustomDropdown
          options={accessOptions}
          value={null}
          onChange={handleAddAccess}
          placeholder="Search for access to add..."
          isMulti={false}
          isLoading={isLoadingAccesses}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Business Justification</label>
        <textarea
          value={businessJustification}
          onChange={(e) => setBusinessJustification(e.target.value)}
          placeholder="Enter business justification..."
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>
      <div className="border rounded-lg p-4 max-h-96 overflow-auto">
        {selectedAccesses.map(access => (
          <AccessCard
            key={access.id}
            access={access}
            customJustification={customJustifications[access.id]}
            setCustomJustification={(value) => setCustomJustifications({...customJustifications, [access.id]: value})}
            note={notes[access.id]}
            setNote={(value) => setNotes({...notes, [access.id]: value})}
            onRemove={() => setSelectedAccesses(selectedAccesses.filter(a => a.id !== access.id))}
            users={access.users}
            onUserChange={(users) => handleUserChange(access.id, users)}
            allUsers={userOptions}
          />
        ))}
      </div>
      <button
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={selectedAccesses.length === 0 || !businessJustification || makeRequestsMutation.isLoading}
      >
        {makeRequestsMutation.isLoading ? 'Submitting...' : 'Submit Requests'}
      </button>
    </div>
  );
};

export default AddAccessesTab;