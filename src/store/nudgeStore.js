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
      type: 'message',
      priority: 'high',
      isRead: false,
      isPinned: false,
      isHighPriority: false,
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
      type: 'message',
      priority: 'high',
      isRead: false,
      isPinned: false,
      isHighPriority: false,
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
      type: 'message',
      priority: 'high',
      isRead: true,
      isPinned: false,
      isHighPriority: false,
      attachments: [],
      replies: []
    },
    {
      id: 'poll-1',
      senderId: 'user-13',
      senderName: 'Michael Torres',
      senderTitle: 'Scrum Master',
      senderAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      message: 'Poll: What time works best for our daily standup?',
      fullMessage: 'Poll: What time works best for our daily standup? Please vote so we can find the best time for everyone.',
      timestamp: '3h',
      type: 'poll',
      priority: 'normal',
      isRead: false,
      isPinned: false,
      isHighPriority: false,
      attachments: [],
      replies: [],
      pollOptions: [
        { text: "9:00 AM", percentage: 35 },
        { text: "9:30 AM", percentage: 40 },
        { text: "10:00 AM", percentage: 20 },
        { text: "10:30 AM", percentage: 5 }
      ]
    },
    // Archived nudges for testing
    {
      id: 'archived-1',
      senderId: 'user-2',
      senderName: 'Janice Reid',
      senderTitle: 'Product Manager',
      senderAvatar: 'https://images.pexels.com/photos/1576482/pexels-photo-1576482.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      message: 'First archived message about project X requirements and specifications.',
      timestamp: '1w',
      type: 'message',
      priority: 'normal',
      isRead: true,
      isPinned: false,
      isHighPriority: false,
      isArchived: true,
      archivedAt: '01/10/2024, 2:30 PM',
      attachments: [],
      replies: []
    },
    {
      id: 'archived-2',
      senderId: 'user-2',
      senderName: 'Janice Reid',
      senderTitle: 'Product Manager',
      senderAvatar: 'https://images.pexels.com/photos/1576482/pexels-photo-1576482.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      message: 'Second archived message about project X timeline and deliverables.',
      timestamp: '5d',
      type: 'message',
      priority: 'normal',
      isRead: true,
      isPinned: false,
      isHighPriority: false,
      isArchived: true,
      archivedAt: '01/12/2024, 9:15 AM',
      attachments: [],
      replies: []
    },
    {
      id: 'archived-3',
      senderId: 'user-3',
      senderName: 'Bobbie Barnes',
      senderTitle: 'UX Designer',
      senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      message: 'Feedback on the user interface design and user experience improvements.',
      timestamp: '3d',
      type: 'message',
      priority: 'normal',
      isRead: true,
      isPinned: false,
      isHighPriority: false,
      isArchived: true,
      archivedAt: '01/13/2024, 4:45 PM',
      attachments: [],
      replies: []
    },
    {
      id: 'archived-4',
      senderId: 'user-3',
      senderName: 'Bobbie Barnes',
      senderTitle: 'UX Designer',
      senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      message: 'Update on the prototype development and testing results.',
      timestamp: '2d',
      type: 'message',
      priority: 'normal',
      isRead: true,
      isPinned: false,
      isHighPriority: false,
      isArchived: true,
      archivedAt: '01/14/2024, 11:20 AM',
      attachments: [],
      replies: []
    },
    {
      id: 'archived-5',
      senderId: 'user-4',
      senderName: 'George Richards',
      senderTitle: 'Project Manager',
      senderAvatar: 'https://randomuser.me/api/portraits/men/46.jpg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      message: 'Project progress report and milestone achievements summary.',
      timestamp: '1d',
      type: 'message',
      priority: 'normal',
      isRead: true,
      isPinned: false,
      isHighPriority: false,
      isArchived: true,
      archivedAt: '01/15/2024, 1:30 PM',
      attachments: [],
      replies: []
    }
  ],
  
  // Draft state
  drafts: [
    {
      id: 'draft-1',
      recipients: [
        { id: 1, name: "Sarah Johnson", title: "Designer", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
        { id: 2, name: "Mike Thompson", title: "Developer", avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }
      ],
      message: "Hey team, I wanted to discuss the new design patterns we've been working on. I think we should schedule a meeting to review the progress and align on next steps.",
      createdAt: new Date('01/15/2024 10:30:00'),
      updatedAt: new Date('01/15/2024 14:20:00'),
      poll: null,
      todos: []
    },
    {
      id: 'draft-2',
      recipients: [
        { id: 3, name: "Emily Davis", title: "Product Manager", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }
      ],
      message: "Quick update on the API integration project - we're making good progress but need to discuss some technical decisions.",
      createdAt: new Date('01/14/2024 16:45:00'),
      updatedAt: new Date('01/14/2024 16:45:00'),
      poll: {
        id: 'poll-draft-1',
        title: "Best time for technical review meeting?",
        options: [
          { id: 1, text: "Tomorrow morning (9:00-11:00 AM)", votes: 0 },
          { id: 2, text: "Tomorrow afternoon (2:00-4:00 PM)", votes: 0 },
          { id: 3, text: "Thursday morning (9:00-11:00 AM)", votes: 0 }
        ],
        type: 'poll',
        isAnonymous: false,
        allowMultipleChoices: false
      },
      todos: []
    },
    {
      id: 'draft-3',
      recipients: [
        { id: 4, name: "David Wilson", title: "Backend Dev", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
        { id: 5, name: "Jessica Brown", title: "Data Scientist", avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }
      ],
      message: "Following up on our discussion about the database optimization. I've prepared some initial analysis and would like to get your feedback.",
      createdAt: new Date('01/13/2024 11:15:00'),
      updatedAt: new Date('01/13/2024 15:30:00'),
      poll: null,
      todos: [
        { id: 1, text: "Review database performance metrics", completed: false },
        { id: 2, text: "Prepare optimization recommendations", completed: false }
      ]
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
  
  // Ações para rascunhos
  saveDraft: (draftData) => set((state) => {
    const draft = {
      ...draftData,
      id: `draft-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDraft: true
    };
    return {
      drafts: [draft, ...state.drafts]
    };
  }),
  
  updateDraft: (draftId, draftData) => set((state) => ({
    drafts: state.drafts.map(draft => 
      draft.id === draftId ? { 
        ...draft, 
        ...draftData, 
        updatedAt: new Date().toISOString() 
      } : draft
    )
  })),
  
  deleteDraft: (draftId) => set((state) => ({
    drafts: state.drafts.filter(draft => draft.id !== draftId)
  })),
  
  sendDraft: (draftId) => set((state) => {
    const draft = state.drafts.find(d => d.id === draftId);
    if (!draft) return state;
    
    const nudge = {
      ...draft,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      isDraft: false,
      isRead: true
    };
    
    return {
      nudges: [nudge, ...state.nudges],
      drafts: state.drafts.filter(d => d.id !== draftId)
    };
  }),
  
  markAsRead: (nudgeId) => set((state) => ({
    nudges: state.nudges.map(nudge => 
      nudge.id === nudgeId ? { ...nudge, isRead: true } : nudge
    )
  })),

  markAsUnread: (nudgeId) => set((state) => ({
    nudges: state.nudges.map(nudge => 
      nudge.id === nudgeId ? { ...nudge, isRead: false } : nudge
    )
  })),

  togglePin: (nudgeId) => set((state) => ({
    nudges: state.nudges.map(nudge => 
      nudge.id === nudgeId ? { 
        ...nudge, 
        isPinned: !nudge.isPinned,
        pinnedAt: !nudge.isPinned ? new Date().toISOString() : null
      } : nudge
    )
  })),

  markAsResolved: (nudgeId) => set((state) => ({
    nudges: state.nudges.map(nudge => 
      nudge.id === nudgeId ? { ...nudge, isRead: true, isResolved: true, resolvedAt: new Date().toISOString() } : nudge
    )
  })),

  togglePriority: (nudgeId) => set((state) => ({
    nudges: state.nudges.map(nudge => 
      nudge.id === nudgeId ? { ...nudge, isHighPriority: !nudge.isHighPriority } : nudge
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
  
  // Function to simulate new nudge arrival
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