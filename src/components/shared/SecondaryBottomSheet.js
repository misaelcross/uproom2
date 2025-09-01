import React, { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { X, ChevronUp, Send, FileText, ThumbsUp } from 'lucide-react';
import useNudgeStore from '../../store/nudgeStore';
import { getStatusColors, formatMentionName } from '../../utils/mentionUtils';
import { usersData } from '../../data/usersData';

const SecondaryBottomSheet = () => {
  const { 
    isLeftPanelOpen, 
    selectedNudgeId, 
    nudges, 
    hasNewNudge, 
    newNudgeId,
    closeLeftPanel, 
    markAsRead,
    setSelectedNudge,
    clearNewNudgeNotification
  } = useNudgeStore();

  const [replyText, setReplyText] = useState('');
  const [showReschedule, setShowReschedule] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [currentPage, setCurrentPage] = useState('nudges');

  // Função para renderizar texto com menções
  const renderTextWithMentions = (text, isPreview = false) => {
    if (!text) return text;
    
    const mentionRegex = /@([\w\s]+?)(?=\s|$|[.,!?])/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const mentionName = match[1].trim();
      const user = usersData.find(u => 
        u.name.toLowerCase().includes(mentionName.toLowerCase()) ||
        mentionName.toLowerCase().includes(u.name.toLowerCase())
      );
      
      if (user) {
        if (isPreview) {
          // Para preview, texto formatado unificado
          parts.push(`@${formatMentionName(user.name)}`);
        } else {
          // Para visualização completa, com cores e interações
          const colors = getStatusColors(user.availability);
          parts.push(
            <span
              key={match.index}
              className={`inline-block px-2 py-1 rounded font-semibold text-xs cursor-pointer transition-colors hover:opacity-80 ${colors.text} ${colors.bg}`}
            >
              @{formatMentionName(user.name)}
            </span>
          );
        }
      } else {
        if (isPreview) {
          parts.push(`@${mentionName}`);
        } else {
          parts.push(
            <span key={match.index} className="inline-block px-2 py-1 rounded bg-gray-500/10 text-gray-400 font-semibold text-xs">
              @{mentionName}
            </span>
          );
        }
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // Detectar a página atual baseada no DOM
  useEffect(() => {
    const detectCurrentPage = () => {
      // Detectar baseado no atributo data-current-page do sidebar
      const sidebar = document.querySelector('[data-current-page]');
      if (sidebar) {
        const page = sidebar.getAttribute('data-current-page');
        setCurrentPage(page || 'nudges');
      }
    };

    // Detectar imediatamente
    detectCurrentPage();
    
    // Usar MutationObserver para detectar mudanças no DOM
    const observer = new MutationObserver(() => {
      detectCurrentPage();
    });
    
    // Observar mudanças no body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-current-page']
    });
    
    return () => observer.disconnect();
  }, []);

  // Calcular posição baseada na página atual
  const getRightPosition = () => {
    switch (currentPage) {
      case 'todos':
        return 'right-[320px]'; // Para a página de todos com coluna direita de 320px
      case 'nudges':
        return 'right-[386px]'; // Para a página de nudges com coluna direita de 350px + padding
      default:
        return 'right-[386px]';
    }
  };

  // Determinar qual nudge mostrar
  const currentNudge = selectedNudgeId 
    ? nudges.find(n => n.id === selectedNudgeId)
    : newNudgeId 
    ? nudges.find(n => n.id === newNudgeId)
    : null;

  // Determinar se deve mostrar (painel aberto OU nova nudge em modo compactado)
  const shouldShow = isLeftPanelOpen || hasNewNudge;
  const isCompactMode = hasNewNudge && !isLeftPanelOpen;

  // Calcular altura dinâmica baseada no conteúdo
  const calculateDynamicHeight = () => {
    if (!shouldShow) return 60;
    if (isCompactMode) return 60;
    return 700; // altura padrão para modo expandido
  };

  // Animação do container
  const containerAnimation = useSpring({
    height: calculateDynamicHeight(),
    opacity: shouldShow ? 1 : 0,
    transform: shouldShow ? 'translateY(0%)' : 'translateY(100%)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    config: { tension: 300, friction: 30 }
  });

  // Função para expandir do modo compactado
  const expandFromCompact = () => {
    if (newNudgeId) {
      setSelectedNudge(newNudgeId);
      clearNewNudgeNotification();
      markAsRead(newNudgeId);
    }
  };

  // Função para enviar resposta
  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };

  // Função para reagendar
  const handleReschedule = () => {
    if (selectedDate && selectedTimeRange) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowReschedule(false);
        setSelectedDate('');
        setSelectedTimeRange('');
      }, 2000);
    }
  };

  if (!shouldShow || !currentNudge) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 ${getRightPosition()} z-40`}>
      <animated.div
        style={{
          ...containerAnimation,
          width: '400px'
        }}
        className="bg-neutral-800 border border-neutral-700 shadow-2xl overflow-hidden rounded-tl-2xl rounded-tr-2xl"
      >
        <div className="p-4 flex flex-col h-full">
          {isCompactMode ? (
            /* Modo Compactado - Nova Nudge */
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={expandFromCompact}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={currentNudge.senderAvatar}
                    alt={currentNudge.senderName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium">{currentNudge.senderName}</h3>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ChevronUp className="h-5 w-5 text-neutral-500" />
              </div>
            </div>
          ) : (
            /* Modo Expandido - Visualização Completa */
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentNudge.senderAvatar}
                    alt={currentNudge.senderName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-white">{currentNudge.senderName}</h2>
                    <p className="text-sm text-neutral-400">{currentNudge.senderTitle}</p>
                  </div>
                </div>
                <button
                  onClick={closeLeftPanel}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Scrollable Content */}
                <div className="flex-1 pb-4" data-simplebar>
                  <div className="space-y-6">
                    {/* Message Description with Left Border */}
                    <div className="border border-neutral-600 p-4 rounded-lg">
                      <p className="text-white text-sm leading-relaxed">{renderTextWithMentions(currentNudge.message)}</p>
                    </div>

                    {/* Attachments */}
                    {currentNudge.attachments && currentNudge.attachments.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-white text-sm font-medium">Attachments</h4>
                        <div className="space-y-2">
                          {currentNudge.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 p-3 rounded-lg border border-neutral-700 hover:bg-neutral-700 transition-colors cursor-pointer"
                            >
                              <FileText className="h-5 w-5 text-neutral-400" />
                              <span className="text-white text-sm flex-1">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Replies Section */}
                    <div className="space-y-4">
                      <h4 className="text-white text-sm font-medium border-b border-neutral-700 pb-2">Replies</h4>
                      <div className="space-y-3">
                         {currentNudge.replies && currentNudge.replies.map((reply, index) => {
                           const isFromMe = reply.senderName === 'You';
                           return (
                             <div key={reply.id}>
                               <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-xs px-3 py-2 border border-neutral-700 ${
                                   isFromMe 
                                     ? 'bg-neutral-800 rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                                     : 'bg-neutral-900 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                                 }`}>
                                   <p className="text-white text-sm">{renderTextWithMentions(reply.message)}</p>
                                   <p className="text-xs text-neutral-400 mt-1">{new Date(reply.timestamp).toLocaleTimeString()}</p>
                                 </div>
                               </div>
                             </div>
                           );
                         })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer - Always at Bottom */}
                <div className="border-t border-neutral-700 bg-neutral-800">
                  {/* Action Buttons */}
                  <div className="pt-4 pb-3">
                    <button className="w-full flex items-center justify-center space-x-2 h-12 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-lg transition-colors">
                       <ThumbsUp className="h-5 w-5 text-white" />
                       <span className="text-white font-medium">Add to my To-Do</span>
                     </button>
                  </div>
                  
                  {/* Reply Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 bg-transparent border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        replyText.trim()
                          ? 'bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600'
                          : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </animated.div>
    </div>
  );
};

export default SecondaryBottomSheet;