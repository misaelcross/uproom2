import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search,
  Filter,
  Plus,
  Check
} from 'lucide-react';
import { usersData } from '../../data/usersData';

const ActionBarNudges = ({ onUserSelect, onSortChange, onCreateNudge }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Sender');
  const sortDropdownRef = useRef(null);

  // Filtrar usuários baseado na pesquisa
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return usersData.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Função para selecionar usuário da busca
  const selectUserFromSearch = (user) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
    setSearchTerm(''); // Limpar pesquisa após selecionar
  };

  // Opções de ordenação para nudges
  const sortOptions = [
    'Sender',
    'Type',
    'Priority'
  ];

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };

    if (sortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortDropdownOpen]);

  const handleSortClick = () => {
    setSortDropdownOpen(!sortDropdownOpen);
  };

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setSortDropdownOpen(false);
    console.log('Sort selected:', option);
    if (onSortChange) {
      onSortChange(option);
    }
  };

  return (
    <div className="w-fit rounded-lg h-20 p-4 flex items-center space-x-3">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-48 bg-transparent border border-neutral-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        
        {/* Search Results Dropdown */}
        {filteredUsers.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => selectUserFromSearch(user)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-neutral-800 transition-colors text-left"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{user.name}</div>
                  <div className="text-neutral-400 text-xs">{user.title}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  user.status === 'online' ? 'bg-green-500' : 
                  user.status === 'away' ? 'bg-orange-500' : 'bg-gray-500'
                }`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort Button with Dropdown */}
      <div className="relative" ref={sortDropdownRef}>
        <button 
          onClick={handleSortClick}
          className="flex items-center space-x-2 px-4 py-2 bg-transparent hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors"
        >
          <Filter className="h-4 w-4 text-neutral-300" />
          <span className="text-neutral-300 text-sm font-medium">Sort</span>
        </button>
        
        {/* Dropdown Menu */}
        {sortDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 min-w-[200px]">
            <div className="py-1">
              {sortOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSortSelect(option)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                    selectedSort === option 
                      ? 'bg-neutral-700 text-white' 
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <span>{option}</span>
                  {selectedSort === option && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Nudge Button */}
      <button 
        onClick={onCreateNudge}
        className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg transition-colors"
      >
        <Plus className="h-4 w-4 text-white" />
        <span className="text-white text-sm font-medium">Create nudge</span>
      </button>
    </div>
  );
};

export default ActionBarNudges;