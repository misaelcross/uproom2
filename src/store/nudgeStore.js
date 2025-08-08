import { create } from 'zustand';

const useNudgeStore = create((set, get) => ({
  nudges: [
    {
      id: 'auto-nudge-1',
      senderId: 'user-2',
      senderName: 'Janice Reid',
      senderTitle: 'Product Manager',
      senderAvatar: 'https://images.pexels.com/photos/1576482/pexels-photo-1576482.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      message: 'Hi! Could you review the document I sent yesterday? I need your feedback by tomorrow morning to finalize the presentation.',
      timestamp: '2h',
      priority: 'high',
      isRead: false,
      attachments: [
        {
          id: 'att-1',
          name: 'Final_Presentation.pdf',
          type: 'pdf',
          size: '2.4 MB',
          url: '#'
        }
      ],
      replies: [
        {
          id: 'reply-1',
          senderId: 'user-1',
          senderName: 'You',
          message: 'Sure! I will review it this afternoon.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    // Nudges do AnimatedBottomSheet
    {
      id: 1,
      senderId: 'user-3',
      senderName: 'Bobbie Barnes',
      senderTitle: 'UX Designer',
      senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      message: 'Hey! Can you review the latest design changes? I need your feedback before the client meeting tomorrow.',
      timestamp: '1h',
      priority: 'high',
      isRead: false,
      attachments: [
        { name: 'DocumentationXPS.pdf' },
        { name: 'PrintScreen1.png' },
        { name: 'PrintScreen2.png' }
      ],
      replies: []
    },
    {
      id: 2,
      senderId: 'user-4',
      senderName: 'George Richards',
      senderTitle: 'Project Manager',
      senderAvatar: 'https://randomuser.me/api/portraits/men/46.jpg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      message: 'The client feedback is in! Let\'s review it together and plan next steps.',
      timestamp: '5d',
      priority: 'high',
      isRead: true,
      attachments: [],
      replies: []
    }
  ],
  
  // Estado do painel secundário (esquerdo)
  isLeftPanelOpen: false,
  selectedNudgeId: null,
  
  // Estado para novas nudges (modo compactado)
  hasNewNudge: true,
  newNudgeId: 'auto-nudge-1',
  
  // Actions
  setLeftPanelOpen: (isOpen) => set({ isLeftPanelOpen: isOpen }),
  
  setSelectedNudge: (nudgeId) => set({ 
    selectedNudgeId: nudgeId,
    isLeftPanelOpen: true 
  }),
  
  markAsRead: (nudgeId) => set((state) => ({
    nudges: state.nudges.map(nudge => 
      nudge.id === nudgeId ? { ...nudge, isRead: true } : nudge
    )
  })),
  
  addNewNudge: (nudge) => set((state) => {
    const newNudge = { ...nudge, id: Date.now() };
    return {
      nudges: [newNudge, ...state.nudges],
      hasNewNudge: !state.isLeftPanelOpen,
      newNudgeId: newNudge.id
    };
  }),
  
  clearNewNudgeNotification: () => set({ 
    hasNewNudge: false, 
    newNudgeId: null 
  }),
  
  closeLeftPanel: () => set({ 
    isLeftPanelOpen: false, 
    selectedNudgeId: null 
  }),
  
  openLeftPanel: () => set({ 
    isLeftPanelOpen: true 
  }),
  
  // Função para simular chegada de nova nudge
  simulateNewNudge: () => {
    const newNudge = {
      sender: {
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        status: "online"
      },
      message: "Quick question about the design mockups!",
      timestamp: "just now",
      priority: "high",
      isRead: false,
      attachments: [],
      replyHistory: []
    };
    
    get().addNewNudge(newNudge);
  }
}));

export default useNudgeStore;