import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Send,
  Users,
  User,
  Clock,
  FileText
} from 'lucide-react';
import useNudgeStore from '../../store/nudgeStore';

const DraftCard = ({ draft, onClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { deleteDraft, sendDraft } = useNudgeStore();

  const handleEdit = (e) => {
    e.stopPropagation();
    onClick(draft);
    setShowDropdown(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteDraft(draft.id);
    setShowDropdown(false);
  };

  const handleSend = (e) => {
    e.stopPropagation();
    sendDraft(draft.id);
    setShowDropdown(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getRecipientText = () => {
    if (draft.isAnnouncement && draft.selectedGroups?.length > 0) {
      return `${draft.selectedGroups.length} group${draft.selectedGroups.length > 1 ? 's' : ''}`;
    } else if (draft.selectedUsers?.length > 0) {
      return `${draft.selectedUsers.length} recipient${draft.selectedUsers.length > 1 ? 's' : ''}`;
    }
    return 'No recipients';
  };

  return (
    <div 
      className="bg-neutral-800 border border-neutral-600 border-dashed rounded-lg p-4 cursor-pointer hover:bg-neutral-750 transition-colors relative"
      onClick={() => onClick(draft)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-xs font-medium uppercase tracking-wide">Draft</span>
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {showDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-50 min-w-[150px]">
              <div className="py-1">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleSend}
                  className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send now</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-neutral-800 hover:text-red-300 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white font-medium text-sm mb-2 line-clamp-1">
        {draft.title || 'Untitled Draft'}
      </h3>

      {/* Message Preview */}
      {draft.message && (
        <p className="text-neutral-300 text-sm leading-relaxed mb-3 line-clamp-2">
          {draft.message}
        </p>
      )}

      {/* Recipients */}
      <div className="flex items-center space-x-2 mb-3">
        {draft.isAnnouncement ? (
          <Users className="w-4 h-4 text-neutral-400" />
        ) : (
          <User className="w-4 h-4 text-neutral-400" />
        )}
        <span className="text-neutral-400 text-xs">
          {getRecipientText()}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Updated {formatDate(draft.updatedAt)}</span>
        </div>
        
        {draft.type && (
          <span className="capitalize">{draft.type}</span>
        )}
      </div>

      {/* Click overlay to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default DraftCard;