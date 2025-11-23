// Mock data for dashboard
const mockData = {
  stats: [
    { id: 1, title: 'Total Projects', value: 15, change: '+5', icon: '📊' },
    { id: 2, title: 'Total Task', value: 10, change: '+2', icon: '📋' },
    { id: 3, title: 'In Reviews', value: 23, change: '+12', icon: '👁️' },
    { id: 4, title: 'Completed Tasks', value: 50, change: '+15', icon: '✅' }
  ],

  tasks: [
    { id: 1, name: 'Prepare Q2 report', project: 'Fintech Project', projectColor: 'bg-blue-500', due: '12 Mar 2024', completed: false },
    { id: 2, name: 'Finalize homepage design', project: 'Brodo Redesign', projectColor: 'bg-purple-500', due: '12 Mar 2024', completed: false },
    { id: 3, name: 'Review onboarding checklist', project: 'HR Setup', projectColor: 'bg-cyan-500', due: '12 Mar 2024', completed: false },
    { id: 4, name: 'Finalize homepage design', project: 'Lucas Projects', projectColor: 'bg-indigo-500', due: '12 Mar 2024', completed: false },
    { id: 5, name: 'Finalize homepage design', project: 'All in One Project', projectColor: 'bg-pink-500', due: '12 Mar 2024', completed: false }
  ],

  projects: [
    { 
      id: 1, 
      name: 'Fintech Project', 
      status: 'In Progress', 
      statusColor: 'text-blue-400 border-blue-400/20 bg-blue-400/10', 
      progress: 70, 
      total: 20, 
      done: 14, 
      due: '12 Mar 2024', 
      owner: 'Michael M', 
      ownerImg: 'https://i.pravatar.cc/150?u=1',
      description: 'A comprehensive fintech platform for managing financial transactions and analytics.',
      tags: ['Finance', 'Analytics', 'Dashboard'],
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-03-01T14:30:00.000Z'
    },
    { 
      id: 2, 
      name: 'Brodo Redesign', 
      status: 'Completed', 
      statusColor: 'text-green-400 border-green-400/20 bg-green-400/10', 
      progress: 100, 
      total: 25, 
      done: 25, 
      due: '16 Mar 2024', 
      owner: 'Jhon Cena', 
      ownerImg: 'https://i.pravatar.cc/150?u=2',
      description: 'Complete redesign of the Brodo e-commerce platform with modern UI/UX.',
      tags: ['Design', 'E-commerce', 'UI/UX'],
      createdAt: '2024-01-20T09:00:00.000Z',
      updatedAt: '2024-03-10T16:45:00.000Z'
    },
    { 
      id: 3, 
      name: 'HR Setup', 
      status: 'On Hold', 
      statusColor: 'text-gray-400 border-gray-400/20 bg-gray-400/10', 
      progress: 40, 
      total: 20, 
      done: 8, 
      due: '18 May 2024', 
      owner: 'Dawne Jay', 
      ownerImg: 'https://i.pravatar.cc/150?u=3',
      description: 'Setting up HR management system for employee onboarding and tracking.',
      tags: ['HR', 'Management', 'Internal'],
      createdAt: '2024-02-01T11:00:00.000Z',
      updatedAt: '2024-02-28T10:15:00.000Z'
    }
  ],

  performance: {
    overall: 86,
    change: '+15%',
    period: 'vs last Week',
    data: [
      { day: 'Mon', value: 40, label: '+82%' },
      { day: 'Tue', value: 60, label: '+51%' },
      { day: 'Wed', value: 85, label: '+86%', active: true },
      { day: 'Thu', value: 45, label: '+45%' },
      { day: 'Fri', value: 70, label: '+82%' }
    ]
  },

  summary: {
    tasksDueToday: 4,
    overdueTasks: 2,
    upcomingDeadlines: 8
  }
};

module.exports = mockData;
