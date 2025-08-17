import React, { useState } from 'react';
import { X, Copy, Check, UserPlus } from 'lucide-react';

const InviteSidebar = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('email'); // 'email' ou 'link'
  const [emailInput, setEmailInput] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [message, setMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Link compartilhável simulado
  const shareableLink = 'https://uproom.app/invite/abc123def456';

  const handleAddEmail = () => {
    if (emailInput.trim() && isValidEmail(emailInput.trim())) {
      if (!emailList.includes(emailInput.trim())) {
        setEmailList([...emailList, emailInput.trim()]);
        setEmailInput('');
      }
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmailList(emailList.filter(email => email !== emailToRemove));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddEmail();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleSendInvites = async () => {
    setIsSubmitting(true);
    
    // Simular envio de convites
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setEmailList([]);
    setMessage('');
    setIsSubmitting(false);
    
    // Fechar sidebar após envio
    onClose();
  };

  return (
    <div className="h-full bg-transparent border border-neutral-700 rounded-lg overflow-hidden">
      <div className="h-full bg-transparent flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">Invite Users</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-neutral-700 flex-shrink-0">
          <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg w-full">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'email'
                  ? 'bg-neutral-700 text-white'
                  : 'bg-transparent text-neutral-400 hover:text-gray-300'
              }`}
            >
              Email Invite
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'link'
                  ? 'bg-neutral-700 text-white'
                  : 'bg-transparent text-neutral-400 hover:text-gray-300'
              }`}
            >
              Share Link
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'email' ? (
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email Addresses</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter email address"
                    className="flex-1 bg-neutral-900 border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleAddEmail}
                    disabled={!emailInput.trim() || !isValidEmail(emailInput.trim())}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Email List */}
              {emailList.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Recipients ({emailList.length})</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {emailList.map((email, index) => (
                      <div key={index} className="flex items-center justify-between bg-neutral-900 border border-neutral-600 rounded-lg px-3 py-2">
                        <span className="text-white text-sm">{email}</span>
                        <button
                          onClick={() => handleRemoveEmail(email)}
                          className="text-neutral-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Custom Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message to your invitation..."
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm resize-none"
                />
              </div>

              {/* Features */}
              <div className="space-y-3 text-sm text-neutral-300">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Recipients will receive an email invitation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>They can join your team instantly</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Track invitation status in real-time</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Share Link Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Shareable Invitation Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 bg-neutral-900 border border-neutral-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                      linkCopied
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Link Info */}
              <div className="bg-neutral-900 border border-neutral-600 rounded-lg p-4">
                <h3 className="text-white font-medium text-sm mb-2">Link Details</h3>
                <div className="space-y-2 text-sm text-neutral-300">
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span className="text-white">7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max uses:</span>
                    <span className="text-white">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="text-white">Just now</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 text-sm text-neutral-300">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Share via any messaging platform</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>No email address required</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Instant team access upon signup</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'email' && (
          <div className="flex items-center justify-between p-4 border-t border-neutral-700 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 font-medium hover:bg-neutral-800 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSendInvites}
              disabled={emailList.length === 0 || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Send Invites ({emailList.length})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteSidebar;