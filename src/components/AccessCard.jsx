
// File: src/components/AccessCard.jsx

import React, { useState } from 'react';
import { AlertTriangle, FileText, Plus, X } from 'lucide-react';
import Modal from './Modal';
import CustomDropdown from './CustomDropdown';

const AccessCard = ({ 
  access, 
  customJustification, 
  setCustomJustification, 
  note, 
  setNote, 
  onRemove,
  users,
  onUserChange,
  allUsers
}) => {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isJustificationDialogOpen, setIsJustificationDialogOpen] = useState(false);
  const [tempNote, setTempNote] = useState(note);
  const [tempJustification, setTempJustification] = useState(customJustification);

  return (
    <div className="border rounded-lg p-4 mb-4 relative">
      <h3 className="font-bold text-lg pr-20">{access.name}</h3>
      <p className="text-gray-600">{access.description}</p>
      {(access.requiresTraining || access.requiresProdAccount) && (
        <div className="absolute top-2 right-2 text-red-500">
          <AlertTriangle size={16} />
        </div>
      )}
      <div className="absolute top-2 right-8 space-x-2">
        <button className="p-1 hover:bg-gray-100 rounded" onClick={() => setIsNoteDialogOpen(true)} title="Add Note">
          <FileText size={16} />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded" onClick={() => setIsJustificationDialogOpen(true)} title="Add Custom Justification">
          <Plus size={16} />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded" onClick={onRemove} title="Remove Access">
          <X size={16} />
        </button>
      </div>
      {access.requiresTraining && (
        <p className="text-red-500 text-sm mt-2">Requires training</p>
      )}
      {access.requiresProdAccount && (
        <p className="text-red-500 text-sm mt-2">Requires production account</p>
      )}
      {note && (
        <div className="mt-2">
          <span className="font-semibold">Note:</span>
          <p className="text-sm">{note}</p>
        </div>
      )}
      {customJustification && (
        <div className="mt-2">
          <span className="font-semibold">Custom Justification:</span>
          <p className="text-sm">{customJustification}</p>
        </div>
      )}
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Users for this access</label>
        <CustomDropdown
          options={allUsers}
          value={users}
          onChange={onUserChange}
          placeholder="Select users..."
          isMulti={true}
        />
      </div>
      <Modal isOpen={isNoteDialogOpen} onClose={() => setIsNoteDialogOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add Note</h2>
        <textarea
          value={tempNote}
          onChange={(e) => setTempNote(e.target.value)}
          placeholder="Enter note..."
          className="w-full p-2 border rounded"
          rows={4}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsNoteDialogOpen(false)}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => {
            setNote(tempNote);
            setIsNoteDialogOpen(false);
          }}>Save Note</button>
        </div>
      </Modal>
      <Modal isOpen={isJustificationDialogOpen} onClose={() => setIsJustificationDialogOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add Custom Justification</h2>
        <textarea
          value={tempJustification}
          onChange={(e) => setTempJustification(e.target.value)}
          placeholder="Enter custom justification..."
          className="w-full p-2 border rounded"
          rows={4}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsJustificationDialogOpen(false)}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => {
            setCustomJustification(tempJustification);
            setIsJustificationDialogOpen(false);
          }}>Save Justification</button>
        </div>
      </Modal>
    </div>
  );
};

export default AccessCard;