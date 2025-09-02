import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Save, 
  Edit3,
  Users,
  User,
  Clock,
  FileText,
  BarChart3,
  CheckSquare,
  X,
  Search,
  Paperclip,
  Link
} from 'lucide-react';
import useNudgeStore from '../../store/nudgeStore';
import PollSurveyModal from './PollSurveyModal';
import GroupSelector from './GroupSelector';
import TodoSelector from './TodoSelector';
import useEscapeKey from '../../hooks/useEscapeKey';

// Usuários fake para pesquisa (mesmo do CreateNudgeView)
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

const DraftDetails = ({ draft, onBack, onEdit }) => {
  // Handle Escape key to close the component view
  useEscapeKey(onBack);

  const { sendDraft, updateDraft, deleteDraft } = useNudgeStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para edição (baseados no CreateNudgeView)
  const [editedMessage, setEditedMessage] = useState(draft.message || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(draft.recipients || []);
  const [selectedGroups, setSelectedGroups] = useState(draft.selectedGroups || []);
  const [selectedTodos, setSelectedTodos] = useState(draft.todos || []);
  const [attachedPoll, setAttachedPoll] = useState(draft.poll || null);
  const [isAnnouncementMode, setIsAnnouncementMode] = useState(draft.isAnnouncement || false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

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
  };

  // Função para remover poll anexado
  const handleRemovePoll = () => {
    setAttachedPoll(null);
  };

  const handleSend = () => {
    sendDraft(draft.id);
    onBack();
  };

  const handleSave = () => {
    if (isEditing) {
      const updatedDraft = {
        ...draft,
        message: editedMessage,
        recipients: selectedUsers,
        selectedGroups: selectedGroups,
        todos: selectedTodos,
        poll: attachedPoll,
        isAnnouncement: isAnnouncementMode,
        updatedAt: new Date()
      };
      updateDraft(draft.id, updatedDraft);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    // Resetar todos os valores para o estado original
    setEditedMessage(draft.message || '');
    setSelectedUsers(draft.recipients || []);
    setSelectedGroups(draft.selectedGroups || []);
    setSelectedTodos(draft.todos || []);
    setAttachedPoll(draft.poll || null);
    setIsAnnouncementMode(draft.isAnnouncement || false);
    setSearchTerm('');
    setIsEditing(false);
  };

  const formatDate = (dateInput) => {
    // Verificar se já é um objeto Date válido
    let date;
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      // Fallback para data atual se não conseguir processar
      date = new Date();
    }
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      date = new Date(); // Usar data atual como fallback
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecipientText = () => {
    if (isEditing) {
      if (isAnnouncementMode && selectedGroups?.length > 0) {
        return `${selectedGroups.length} group${selectedGroups.length > 1 ? 's' : ''}`;
      } else if (selectedUsers?.length > 0) {
        return `${selectedUsers.length} recipient${selectedUsers.length > 1 ? 's' : ''}`;
      }
      return 'No recipients';
    } else {
      if (draft.isAnnouncement && draft.selectedGroups?.length > 0) {
        return `${draft.selectedGroups.length} group${draft.selectedGroups.length > 1 ? 's' : ''}`;
      } else if (draft.recipients?.length > 0) {
        return `${draft.recipients.length} recipient${draft.recipients.length > 1 ? 's' : ''}`;
      }
      return 'No recipients';
    }
  };

  return (
    <div className="h-full flex flex-col bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? 'Edit Draft' : 'Draft Details'}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
            className="flex items-center space-x-2 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                <span className="text-sm">Cancel</span>
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                <span className="text-sm">Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6" data-simplebar>
        {!isEditing ? (
          // Modo de visualização (código original)
          <>
            {/* Draft Info */}
            <div className="bg-neutral-800 border border-neutral-600 border-dashed rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-xs font-medium uppercase tracking-wide">Draft</span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-neutral-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Created: {formatDate(draft.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated: {formatDate(draft.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-3">
              <h3 className="text-white font-medium flex items-center space-x-2">
                {draft.isAnnouncement ? (
                  <Users className="w-4 h-4 text-neutral-400" />
                ) : (
                  <User className="w-4 h-4 text-neutral-400" />
                )}
                <span>Recipients ({getRecipientText()})</span>
              </h3>
              
              {draft.recipients && draft.recipients.length > 0 && (
                <div className="space-y-2">
                  {draft.recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center space-x-3 p-3 bg-neutral-800 rounded-lg">
                      <img
                        src={recipient.avatar}
                        alt={recipient.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{recipient.name}</div>
                        <div className="text-neutral-400 text-xs">{recipient.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h3 className="text-white font-medium">Message</h3>
              <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-4">
                <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {draft.message || 'No message content'}
                </p>
              </div>
            </div>

            {/* Poll */}
            {draft.poll && (
              <div className="space-y-3">
                <h3 className="text-white font-medium flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-neutral-400" />
                  <span>Attached Poll</span>
                </h3>
                <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">{draft.poll.title}</h4>
                  <div className="space-y-2">
                    {draft.poll.options.map((option, index) => (
                      <div key={index} className="text-neutral-300 text-sm">
                        • {option.text}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                    {draft.poll.isAnonymous && <span>Anonymous</span>}
                    {draft.poll.allowMultipleChoices && <span>Multiple choice</span>}
                    <span className="capitalize">{draft.poll.type}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Todos */}
            {draft.todos && draft.todos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-white font-medium flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-neutral-400" />
                  <span>Attached Todos</span>
                </h3>
                <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-4">
                  <div className="space-y-2">
                    {draft.todos.map((todo) => (
                      <div key={todo.id} className="flex items-center space-x-2">
                        <div className="w-4 h-4 border border-neutral-500 rounded"></div>
                        <span className="text-neutral-300 text-sm">{todo.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Modo de edição (baseado no CreateNudgeView)
          <>
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
                    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 max-h-48" data-simplebar>
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
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
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
                    {attachedPoll.allowMultipleChoices && <span>Multiple choice</span>}
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
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-neutral-700 space-y-3">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full h-12 flex items-center justify-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          >
            <Save className="h-5 w-5" />
            <span className="font-medium">Save changes</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={!draft.message?.trim() && !draft.poll && (!draft.recipients || draft.recipients.length === 0)}
              className={`w-full h-12 flex items-center justify-center space-x-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent ${
                !draft.message?.trim() && !draft.poll && (!draft.recipients || draft.recipients.length === 0)
                  ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                  : 'bg-transparent hover:bg-neutral-800 text-neutral-300 border border-neutral-600 hover:border-neutral-500'
              }`}
            >
              <Save className={`h-5 w-5 ${
                !draft.message?.trim() && !draft.poll && (!draft.recipients || draft.recipients.length === 0) ? 'text-neutral-400' : 'text-neutral-300'
              }`} />
              <span className={`font-medium ${
                !draft.message?.trim() && !draft.poll && (!draft.recipients || draft.recipients.length === 0) ? 'text-neutral-400' : 'text-neutral-300'
              }`}>
                Save draft
              </span>
            </button>

            <button
              onClick={handleSend}
              disabled={(!draft.message?.trim() && !draft.poll) || (!draft.recipients || draft.recipients.length === 0)}
              className={`w-full h-12 flex items-center justify-center space-x-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
                (!draft.message?.trim() && !draft.poll) || (!draft.recipients || draft.recipients.length === 0)
                  ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600'
              }`}
            >
              <Send className={`h-5 w-5 ${
                (!draft.message?.trim() && !draft.poll) || (!draft.recipients || draft.recipients.length === 0) ? 'text-neutral-400' : 'text-white'
              }`} />
              <span className={`font-medium ${
                (!draft.message?.trim() && !draft.poll) || (!draft.recipients || draft.recipients.length === 0) ? 'text-neutral-400' : 'text-white'
              }`}>
                Send Now
              </span>
            </button>
          </>
        )}
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

export default DraftDetails;