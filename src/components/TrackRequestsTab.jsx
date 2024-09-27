// File: src/components/TrackRequestsTab.jsx
import React from 'react';
import { useQuery } from 'react-query';
import { Loader2, Clipboard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getMyRequests } from '../services/api';

const TrackRequestsTab = () => {
  const { data: requests, isLoading } = useQuery('myRequests', getMyRequests);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      {requests?.map((request) => (
        <div key={request.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{request.access.name}</h3>
              <p className="text-sm text-gray-600">{request.access.description}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              request.status === 'approved' ? 'bg-green-100 text-green-800' :
              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          <p className="text-sm mb-2">Requested by: {request.user}</p>
          <p className="text-sm mb-2">Requested: {new Date(request.requestedAt).toLocaleString()}</p>
          <div className="flex items-center">
            <span className="text-sm mr-2">Working Group:</span>
            <button
              className="px-2 py-1 bg-gray-200 rounded text-sm flex items-center"
              onClick={() => {
                navigator.clipboard.writeText(request.workingGroup.join(', '));
                toast.success('Working group copied to clipboard');
              }}
            >
              <Clipboard className="h-4 w-4 mr-1" />
              Copy
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackRequestsTab;