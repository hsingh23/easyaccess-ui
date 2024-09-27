// File: src/services/api.js
// Mock API implementation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const users = [
  { id: 'harshsingh', name: 'Harsh Singh' },
  { id: 'williamthrom', name: 'William Throm' },
  { id: 'allisonwei', name: 'Allison Wei' },
  { id: 'johndoe', name: 'John Doe' },
  { id: 'janedoe', name: 'Jane Doe' },
];

const accessItems = [
  { id: 'SUPER_1', name: 'Super Access 1', description: 'Grants super user privileges', type: 'Entitlement', requiresTraining: true },
  { id: 'SUPER_2', name: 'Super Access 2', description: 'Grants additional super user privileges', type: 'Entitlement', requiresProdAccount: true },
  { id: 'PHDP_1', name: 'PHDP Role 1', description: 'Provides access to PHDP systems', type: 'Role' },
  { id: 'PHDP_2', name: 'PHDP Role 2', description: 'Provides extended access to PHDP systems', type: 'Role', requiresTraining: true },
];

export const getUsers = async (query) => {
  await delay(500);
  return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
};

export const getAccessItems = async (query) => {
  await delay(500);
  return accessItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) || 
    item.description.toLowerCase().includes(query.toLowerCase())
  );
};

export const makeRequests = async (requests) => {
  await delay(1000);
  return requests.map(request => ({
    ...request,
    status: Math.random() > 0.2 ? 'success' : 'failure',
    failureReason: 'Random failure for demonstration',
  }));
};

export const getMyRequests = async () => {
  await delay(500);
  return [
    { id: '1', user: 'Harsh Singh', access: { name: 'Super Access 1', description: 'Grants super user privileges' }, requestedAt: new Date(Date.now() - 86400000).toISOString(), status: 'approved', workingGroup: ['John Doe', 'Jane Doe', 'Bob Smith'] },
    { id: '2', user: 'William Throm', access: { name: 'PHDP Role 1', description: 'Provides access to PHDP systems' }, requestedAt: new Date(Date.now() - 172800000).toISOString(), status: 'pending', workingGroup: ['Alice Johnson', 'Charlie Brown', 'Diana Prince'] },
    { id: '3', user: 'Allison Wei', access: { name: 'Super Access 2', description: 'Grants additional super user privileges' }, requestedAt: new Date(Date.now() - 259200000).toISOString(), status: 'rejected', workingGroup: ['Bruce Wayne', 'Clark Kent', 'Lois Lane'] },
  ];
};
