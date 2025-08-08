import React, { useState, useMemo } from 'react';
import { 
  Search,
  Send,
  Paperclip,
  Link,
  X,
  BarChart3,
  Users,
  User,
  CheckSquare,
  Save
} from 'lucide-react';
import PollSurveyModal from './PollSurveyModal';
import GroupSelector from './GroupSelector';
import TodoSelector from './TodoSelector';
import useNudgeStore from '../../store/nudgeStore';

// Usuários fake para pesquisa
const searchableUsers = [
  { id: 101, name: "Ana Silva", title: "Designer", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" },
  { id: 102, name: "Carlos Santos", title: "Developer", avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "away" },
  { id: 103, name: "Maria Costa", title: "Product Manager", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" },
  { id: 104, name: "João Oliveira", title: "Backend Dev", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "offline" },
  { id: 105, name: "Fernanda Lima", title: "Data Scientist", avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" },
  { id: 106, name: "Pedro Alves", title: "DevOps", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "away" },
  { id: 107, name: "Lucia Ferreira", title: "QA Engineer", avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" },
  { id: 108, name: "Rafael Souza", title: "Security", avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop", status: "online" }
];

const CreateNudgeView = ({ onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [attachedPoll, setAttachedPoll] = useState(null);
  const [isAnnouncementMode, setIsAnnouncementMode] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedTodos, setSelectedTodos] = useState([]);

  // Hook do store de nudges
  const { saveDraft } = useNudgeStore();
  // Filtrar usuários baseado na pesquisa
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return searchableUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Função para adicionar usuário da pesquisa
  const addUserFromSearch = (user) => {
    const isAlreadySelected = selectedUsers.find(u => u.id === user.id);
    if (!isAlreadySelected) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm(''); // Limpar pesquisa após adicionar
  };

  // Função para remover usuário selecionado
  const removeSelectedUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  // Função para criar poll/survey
  const handleCreatePoll = (pollData) => {
    setAttachedPoll(pollData);
    console.log('Poll created:', pollData);
  };

  // Função para remover poll anexado
  const handleRemovePoll = () => {
    setAttachedPoll(null);
  };

  // Função para enviar nudge
  const handleSendNudge = () => {
    const hasRecipients = isAnnouncementMode ? selectedGroups.length > 0 : selectedUsers.length > 0;
    
    if ((message.trim() || attachedPoll) && hasRecipients) {
      const nudgeData = {
        selectedUsers: isAnnouncementMode ? [] : selectedUsers,
        selectedGroups: isAnnouncementMode ? selectedGroups : [],
        selectedTodos,
        message,
        attachedPoll,
        type: attachedPoll ? 'poll' : isAnnouncementMode ? 'announcement' : 'message',
        isAnnouncement: isAnnouncementMode,
        timestamp: new Date().toISOString()
      };
      console.log('Sending nudge:', nudgeData);
      // Aqui você pode adicionar a lógica para enviar o nudge
      // Limpar formulário após envio
      setSelectedUsers([]);
      setSelectedGroups([]);
      setSelectedTodos([]);
      setMessage('');
      setSearchTerm('');
      setAttachedPoll(null);
      setIsAnnouncementMode(false);
      if (onCancel) onCancel();
    }
  };

  // Função para salvar como rascunho
  const handleSaveAsDraft = () => {
    const hasContent = message.trim() || attachedPoll || selectedUsers.length > 0 || selectedGroups.length > 0 || selectedTodos.length > 0;
    
    if (hasContent) {
      const draftData = {
        selectedUsers: isAnnouncementMode ? [] : selectedUsers,
        selectedGroups: isAnnouncementMode ? selectedGroups : [],
        selectedTodos,
        message,
        attachedPoll,
        type: attachedPoll ? 'poll' : isAnnouncementMode ? 'announcement' : 'message',
        isAnnouncement: isAnnouncementMode,
        title: message.trim() ? message.substring(0, 50) + (message.length > 50 ? '...' : '') : 'Untitled Draft'
      };
      
      saveDraft(draftData);
      console.log('Draft saved:', draftData);
      
      // Limpar formulário após salvar rascunho
      setSelectedUsers([]);
      setSelectedGroups([]);
      setSelectedTodos([]);
      setMessage('');
      setSearchTerm('');
      setAttachedPoll(null);
      setIsAnnouncementMode(false);
      if (onCancel) onCancel();
    }
  };

  return (
    <div className="h-full flex flex-col border border-neutral-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-700">
        <h2 className="text-xl font-semibold text-neutral-300">Create Nudge</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5 text-neutral-400" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Mode Toggle */}
        <div className="flex items-center space-x-2 bg-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setIsAnnouncementMode(false)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              !isAnnouncementMode 
                ? 'bg-neutral-700 text-white' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">Individual</span>
          </button>
          <button
            onClick={() => setIsAnnouncementMode(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isAnnouncementMode 
                ? 'bg-neutral-700 text-white' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Announcement</span>
          </button>
        </div>

        {/* Conditional Content Based on Mode */}
        {isAnnouncementMode ? (
          /* Group Selector for Announcements */
          <GroupSelector
            selectedGroups={selectedGroups}
            onGroupsChange={setSelectedGroups}
          />
        ) : (
          /* Individual User Search */
          <>
            {/* Search */}
            <div className="relative">
          <input
            type="text"
            placeholder="Search for team member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
          
          {/* Search Results */}
          {filteredUsers.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => addUserFromSearch(user)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-neutral-700 transition-colors text-left"
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

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400">Selected Recipients:</label>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-2 bg-neutral-700 rounded-lg px-3 py-2"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-white text-sm">{user.name}</span>
                  <button
                    onClick={() => removeSelectedUser(user.id)}
                    className="text-neutral-400 hover:text-neutral-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
            )}
          </>
        )}

        {/* Message Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-400">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
            rows={4}
          />

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button className="flex items-center justify-center space-x-2 h-9 bg-transparent border border-neutral-500 hover:bg-neutral-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent">
              <Paperclip className="h-4 w-4 text-neutral-400" />
              <span className="text-neutral-400 text-sm">Files</span>
            </button>
            <button className="flex items-center justify-center space-x-2 h-9 bg-transparent border border-neutral-500 hover:bg-neutral-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <Link className="h-4 w-4 text-neutral-400" />
              <span className="text-neutral-400 text-sm">Links</span>
            </button>
            <button 
              onClick={() => setIsPollModalOpen(true)}
              className="flex items-center justify-center space-x-2 h-9 bg-transparent border border-neutral-500 hover:bg-neutral-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            >
              <BarChart3 className="h-4 w-4 text-neutral-400" />
              <span className="text-neutral-400 text-sm">Poll</span>
            </button>
          </div>

          {/* Attached Poll Preview */}
          {attachedPoll && (
            <div className="bg-neutral-700 border border-neutral-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    {attachedPoll.type === 'poll' ? 'Poll' : 'Survey'} Attached
                  </span>
                </div>
                <button
                  onClick={handleRemovePoll}
                  className="p-1 hover:bg-neutral-600 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
              <h4 className="text-white font-medium mb-2">{attachedPoll.title}</h4>
              {attachedPoll.description && (
                <p className="text-neutral-300 text-sm mb-2">{attachedPoll.description}</p>
              )}
              <div className="space-y-1">
                {attachedPoll.options.map((option, index) => (
                  <div key={index} className="text-neutral-400 text-sm">
                    • {option.text}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                {attachedPoll.isAnonymous && <span>Anonymous</span>}
                {attachedPoll.allowMultipleChoices && <span>Multiple choices</span>}
                <span>Send to: {attachedPoll.targetAudience}</span>
              </div>
            </div>
          )}
        </div>

        {/* Todo Selector */}
        <TodoSelector
          selectedTodos={selectedTodos}
          onTodosChange={setSelectedTodos}
        />
      </div>

      {/* Footer with Send Button */}
      <div className="p-6 border-t border-neutral-700 space-y-3">
        {/* Save as Draft Button */}
        <button
          onClick={handleSaveAsDraft}
          disabled={!message.trim() && !attachedPoll && selectedUsers.length === 0 && selectedGroups.length === 0 && selectedTodos.length === 0}
          className={`w-full h-12 flex items-center justify-center space-x-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent ${
            !message.trim() && !attachedPoll && selectedUsers.length === 0 && selectedGroups.length === 0 && selectedTodos.length === 0
              ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
              : 'bg-transparent hover:bg-neutral-800 text-neutral-300 border border-neutral-600 hover:border-neutral-500'
          }`}
        >
          <Save className={`h-5 w-5 ${
            !message.trim() && !attachedPoll && selectedUsers.length === 0 && selectedGroups.length === 0 && selectedTodos.length === 0 ? 'text-neutral-400' : 'text-neutral-300'
          }`} />
          <span className={`font-medium ${
            !message.trim() && !attachedPoll && selectedUsers.length === 0 && selectedGroups.length === 0 && selectedTodos.length === 0 ? 'text-neutral-400' : 'text-neutral-300'
          }`}>
            Save as Draft
          </span>
        </button>

        {/* Send Button */}
        <button
          onClick={handleSendNudge}
          disabled={(!message.trim() && !attachedPoll) || (isAnnouncementMode ? selectedGroups.length === 0 : selectedUsers.length === 0)}
          className={`w-full h-12 flex items-center justify-center space-x-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
            (!message.trim() && !attachedPoll) || (isAnnouncementMode ? selectedGroups.length === 0 : selectedUsers.length === 0)
              ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600'
          }`}
        >
          <Send className={`h-5 w-5 ${
            (!message.trim() && !attachedPoll) || (isAnnouncementMode ? selectedGroups.length === 0 : selectedUsers.length === 0) ? 'text-neutral-400' : 'text-white'
          }`} />
          <span className={`font-medium ${
            (!message.trim() && !attachedPoll) || (isAnnouncementMode ? selectedGroups.length === 0 : selectedUsers.length === 0) ? 'text-neutral-400' : 'text-white'
          }`}>
            {isAnnouncementMode ? 'Send Announcement' : 'Send Nudge'}
          </span>
        </button>
      </div>

      {/* Poll/Survey Modal */}
      <PollSurveyModal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        onCreatePoll={handleCreatePoll}
      />
    </div>
  );
};

export default CreateNudgeView;