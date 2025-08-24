import React from 'react';
import { X, Search } from 'lucide-react';
import { usersData } from '../../data/usersData';

const EmployeeListSidebar = ({ isOpen, onClose, onSelectEmployee }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  if (!isOpen) return null;

  // Filter employees based on search term
  const filteredEmployees = usersData.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityColor = (availability) => {
    switch (availability?.toLowerCase()) {
      case 'available':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'in meeting':
        return 'bg-red-500';
      case 'focus':
        return 'bg-purple-500';
      case 'break':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-gray-500';
      case 'emergency':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (availability) => {
    switch (availability) {
      case 'Available': return { text: 'text-green-400', bg: 'bg-green-500/10' };
      case 'In meeting': return { text: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'Break': return { text: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'Focus': return { text: 'text-purple-400', bg: 'bg-purple-500/10' };
      case 'Emergency': return { text: 'text-red-400', bg: 'bg-red-500/10' };
      case 'Away': return { text: 'text-orange-400', bg: 'bg-orange-500/10' };
      case 'Offline': return { text: 'text-gray-400', bg: 'bg-gray-500/10' };
      default: return { text: 'text-green-400', bg: 'bg-green-500/10' };
    }
  };

  return (
    <div className="h-full bg-transparent border border-neutral-700 rounded-lg overflow-hidden">
      <div className="h-full bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">Select Team Member</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* Employee List */}
        <div className="flex-1">
          {filteredEmployees.length === 0 ? (
            <div className="p-4 text-center text-neutral-400">
              No employees found matching your search.
            </div>
          ) : (
            <div className="p-2">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => onSelectEmployee(employee)}
                  className="flex items-center p-3 hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors mb-1"
                >
                  {/* Avatar with status indicator */}
                  <div className="relative mr-3">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-800 ${getAvailabilityColor(employee.availability)}`}
                    ></div>
                  </div>

                  {/* Employee Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-white truncate">
                        {employee.name}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400 truncate mb-2">
                      {employee.title} • {employee.department}
                    </p>
                    
                    {/* Status Badge */}
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(employee.availability).text} ${getStatusColor(employee.availability).bg}`}>
                      <span>{employee.availability}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-700">
          <span className="text-sm text-neutral-400">
            {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} found
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300  font-medium hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListSidebar;