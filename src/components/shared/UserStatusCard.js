import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import SimpleBar from 'simplebar-react';

const UserStatusCard = ({ 
  user, 
  currentStatus, 
  statusMessage, 
  onStatusChange, 
  onStatusMessageChange,
  statusDropdownOpen,
  setStatusDropdownOpen,
  selectedStatusOption,
  setSelectedStatusOption,
  showStatusError,
  setShowStatusError,
  selectStatus,
  setNewStatus,
  cancelStatusChange
}) => {
  const dropdownRef = useRef(null);

  // Status options
  const statusOptions = [
    { name: 'Available', color: 'bg-green-500', textColor: 'text-green-400', bgColor: 'bg-green-500/10' },
    { name: 'Focus', color: 'bg-purple-500', textColor: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { name: 'Meeting', color: 'bg-blue-500', textColor: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { name: 'Emergency', color: 'bg-red-500', textColor: 'text-red-400', bgColor: 'bg-red-500/10' },
    { name: 'Break', color: 'bg-yellow-500', textColor: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { name: 'Away', color: 'bg-orange-500', textColor: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { name: 'Offline', color: 'bg-gray-500', textColor: 'text-gray-400', bgColor: 'bg-gray-500/10' }
  ];

  // Estado local para os ícones de apps
  const [appIcons, setAppIcons] = useState(() => {
    const icons = [
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg',
      '/github-mark-white.svg'
    ];
    const shuffled = icons.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
  });

  // Estado local temporário para o campo de texto do dropdown
  const [tempStatusMessage, setTempStatusMessage] = useState('');

  // Função para randomizar ícones
  const randomizeAppIcons = () => {
    const icons = [
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg',
      '/github-mark-white.svg'
    ];
    const shuffled = icons.sort(() => 0.5 - Math.random());
    setAppIcons(shuffled.slice(0, Math.floor(Math.random() * 2) + 2));
  };

  const currentStatusOption = statusOptions.find(option => option.name === currentStatus) || statusOptions[0];

  const handleCardClick = () => {
    if (statusDropdownOpen) {
      // Se esta fechando o dropdown, resetar a selecao
      setSelectedStatusOption(null);
      setTempStatusMessage('');
      setShowStatusError(false);
    } else {
      // Se esta abrindo o dropdown, definir o status atual como selecionado
      const currentStatusObj = statusOptions.find(s => s.name === currentStatus);
      setSelectedStatusOption(currentStatusObj);
      // Inicializar o campo temporário vazio para mostrar apenas o placeholder
      setTempStatusMessage('');
    }
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const handleSetStatus = () => {
    // Randomizar ícones antes de definir o status
    randomizeAppIcons();
    // Atualizar a descrição real com o valor temporário
    onStatusMessageChange(tempStatusMessage);
    // Chamar a função setNewStatus do pai
    setNewStatus(tempStatusMessage);
    // Limpar o campo temporário após salvar
    setTempStatusMessage('');
  };

  return (
    <div className="relative">
      {/* Clickable Status Card */}
      <button
        onClick={handleCardClick}
        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800 transition-colors text-left"
      >
        {/* Status Message */}
        <div className="mb-3">
          <p className="text-white text-sm truncate">
            {statusMessage || 'Planning Q4 product roadmap and features'}
          </p>
        </div>

        {/* Status Badge and Apps */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${
              currentStatusOption.textColor
            } ${
              currentStatusOption.bgColor
            }`}>
              <span>{currentStatus}</span>
            </div>

            {/* App Icons */}
            <div className="flex items-center gap-1">
              {appIcons.slice(0, 2).map((iconUrl, index) => (
                <img 
                  key={index}
                  src={iconUrl} 
                  alt="App icon" 
                  className="w-4 h-4 object-contain opacity-70"
                />
              ))}
              {appIcons.length > 2 && (
                <span className="text-neutral-400 text-xs font-medium">
                  +{appIcons.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Toggle indicator */}
          <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            currentStatusOption.color.replace('bg-', 'bg-')
          }`}>
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              currentStatus === 'Offline' ? 'translate-x-1' : 'translate-x-5'
            }`} />
          </div>
        </div>
      </button>

      {/* Status Dropdown Menu */}
       {statusDropdownOpen && (
         <div className="absolute bottom-full left-0 right-0 mb-2 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl z-50">
          <div className="p-4">
            {/* Status Options */}
            <div className="pb-1">
              {statusOptions.map((status) => (
                <button
                  key={status.name}
                  onClick={() => selectStatus(status)}
                  className={`w-full flex items-center justify-between p-2 hover:bg-neutral-700 transition-colors rounded-lg ${
                    selectedStatusOption?.name === status.name ? 'bg-neutral-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${status.color}`}></div>
                    <span className="text-sm text-white">{status.name}</span>
                  </div>
                  {selectedStatusOption?.name === status.name && (
                    <Check className={`w-4 h-4 ${status.textColor}`} />
                  )}
                </button>
              ))}
            </div>

            {/* Status Message Input */}
            <div className="py-2">
              <div className={`bg-neutral-800 border rounded-lg transition-colors ${
                showStatusError 
                  ? 'border-red-500' 
                  : 'border-neutral-700 focus-within:border-neutral-600'
              }`}>
                <SimpleBar style={{ maxHeight: '120px' }}>
                  <textarea
                    value={tempStatusMessage}
                    onChange={(e) => {
                      setTempStatusMessage(e.target.value);
                      if (showStatusError && e.target.value.trim().length >= 3) {
                        setShowStatusError(false);
                      }
                    }}
                    placeholder="Give more details..."
                    className="w-full bg-transparent p-3 text-sm text-white placeholder-neutral-400 resize-none focus:outline-none min-h-[40px] border-none"
                    rows="1"
                    style={{
                      height: 'auto',
                      minHeight: '40px'
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                </SimpleBar>
              </div>
              {showStatusError && (
                <p className="text-red-400 text-xs mt-1">
                  Please enter at least 3 characters to set the status.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex space-x-2">
              <button 
                onClick={cancelStatusChange}
                className="flex-1 border border-neutral-600 text-neutral-300 font-medium py-2 px-4 rounded-lg hover:border-neutral-500 hover:text-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSetStatus}
                disabled={!selectedStatusOption || tempStatusMessage.trim().length < 3}
                className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors ${
                  selectedStatusOption && tempStatusMessage.trim().length >= 3
                    ? 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-600'
                    : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                }`}
              >
                Set Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatusCard;