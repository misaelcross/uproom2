import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import { Bold, Italic, Strikethrough, Underline, Smile, AtSign } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { formatMentionName, getStatusColors } from '../../utils/mentionUtils';
import { usersData } from '../../data/usersData';

// Mock users data
const mockUsers = [
    { id: 1, name: 'John Doe', username: 'johndoe', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop' },
    { id: 2, name: 'Jane Smith', username: 'janesmith', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop' },
    { id: 3, name: 'Mike Johnson', username: 'mikejohnson', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop' },
    { id: 4, name: 'Sarah Wilson', username: 'sarahwilson', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop' },
    { id: 5, name: 'David Brown', username: 'davidbrown', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop' }
  ];

// Emoji list
const emojiList = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏',
  '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
  '✨', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '⭐'
];

// Toolbar Button Component
const ToolbarButton = ({ onClick, isActive, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-colors ${
      isActive 
        ? 'bg-neutral-600 text-white' 
        : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
    }`}
  >
    {children}
  </button>
);

// Toolbar Component
const Toolbar = ({ editor, showEmojiPicker, setShowEmojiPicker, setEmojiPickerPosition, onMentionTrigger }) => {
  if (!editor) return null;

  const handleEmojiClick = (e) => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
      setEmojiPickerPosition(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const pickerHeight = 200; // Estimated height of emoji picker
      setEmojiPickerPosition({
        top: rect.top + window.scrollY - pickerHeight - 8,
        left: rect.left + window.scrollX
      });
      setShowEmojiPicker(true);
    }
  };

  return (
    <div className="flex items-center space-x-1 px-4 py-2 border-b border-neutral-600">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold size={16} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic size={16} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </ToolbarButton>
      
      <div className="w-px h-6 bg-neutral-600 mx-2" />
      
      <ToolbarButton
        onClick={handleEmojiClick}
        isActive={showEmojiPicker}
        title="Add Emoji"
      >
        <Smile size={16} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={onMentionTrigger}
        isActive={false}
        title="Mention User"
      >
        <AtSign size={16} />
      </ToolbarButton>
    </div>
  );
};

// Emoji Picker Component
const EmojiPicker = ({ onSelect, onClose, position }) => {
  if (!position) return null;
  
  return createPortal(
    <div 
      className="fixed bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-[9999] p-3 max-h-48 overflow-hidden"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        minWidth: '280px', 
        width: '280px' 
      }}
    >
      <SimpleBar style={{ maxHeight: '192px' }}>
        <div className="grid grid-cols-8 gap-1">
          {emojiList.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="p-2 hover:bg-neutral-700 rounded text-lg transition-colors flex items-center justify-center"
              style={{ minWidth: '32px', minHeight: '32px' }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </SimpleBar>
    </div>,
    document.body
  );
};

// Mention List Component
const MentionList = React.forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: formatMentionName(item.name) });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-50 max-h-48" style={{ minWidth: '200px', maxWidth: '200px' }}>
      <SimpleBar style={{ maxHeight: '192px' }}>
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
            key={item.id}
            type="button"
            onClick={() => selectItem(index)}
            className={`flex items-center space-x-3 w-full px-3 py-2 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
              index === selectedIndex ? 'bg-neutral-700' : 'hover:bg-neutral-700'
            }`}
          >
            <img 
              src={item.avatar} 
              alt={item.name}
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&size=32&background=6b7280&color=ffffff`;
              }}
            />
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium">{item.name}</span>
              <span className="text-neutral-400 text-xs">@{item.name}</span>
            </div>
          </button>
        ))
        ) : (
          <div className="px-3 py-2 text-neutral-400 text-sm">No users found</div>
        )}
      </SimpleBar>
    </div>
  );
});

MentionList.displayName = 'MentionList';

// Simplified suggestion configuration without tippy.js
const suggestion = {
  items: ({ query }) => {
    return mockUsers
      .filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  },

  render: () => {
    let reactRenderer;
    let popup;

    return {
      onStart: (props) => {
        if (!props.clientRect) {
          return;
        }

        // Create a simple popup element
        popup = document.createElement('div');
        popup.style.position = 'absolute';
        popup.style.zIndex = '9999';
        document.body.appendChild(popup);

        // Position the popup above the cursor
        const rect = props.clientRect();
        const dropdownHeight = 200; // Estimated height of dropdown
        popup.style.top = `${rect.top + window.scrollY - dropdownHeight}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;

        // Render React component
        const root = ReactDOM.createRoot ? ReactDOM.createRoot(popup) : null;
        if (root) {
          root.render(React.createElement(MentionList, props));
          reactRenderer = root;
        }
      },

      onUpdate(props) {
        if (!props.clientRect || !popup) {
          return;
        }

        // Update position above the cursor
        const rect = props.clientRect();
        const dropdownHeight = 200; // Estimated height of dropdown
        popup.style.top = `${rect.top + window.scrollY - dropdownHeight}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;

        // Update React component
        if (reactRenderer) {
          reactRenderer.render(React.createElement(MentionList, props));
        }
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          return true;
        }
        return false;
      },

      onExit() {
        if (popup) {
          if (reactRenderer && reactRenderer.unmount) {
            reactRenderer.unmount();
          }
          document.body.removeChild(popup);
          popup = null;
          reactRenderer = null;
        }
      },
    };
  },
};

// Main TipTap Editor Component
const TipTapEditor = ({ value, onChange, placeholder = "Type something...", showToolbar = true, onEnter }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
        includeChildren: true,
      }),
      Mention.configure({
        renderHTML({ options, node }) {
          const mentionId = node.attrs.id;
          const user = usersData.find(u => u.id === mentionId);
          const colors = user ? getStatusColors(user.availability) : { text: 'text-gray-400', bg: 'bg-gray-500/10' };
          
          return [
            'span',
            {
              class: `mention inline-block px-2 py-1 rounded font-semibold text-xs cursor-pointer transition-colors hover:opacity-80 ${colors.text} ${colors.bg}`,
              'data-type': 'mention',
              'data-id': mentionId,
            },
            `@${node.attrs.label || ''}`,
          ];
        },
        suggestion,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    onFocus: () => {
      setIsEditing(true);
    },
    onBlur: () => {
      // Only hide editing state if editor is empty
      if (!editor?.getText().trim()) {
        setIsEditing(false);
      }
    },
    editorProps: {
      attributes: {
        class: 'px-4 py-3 text-white placeholder-neutral-400 focus:outline-none min-h-[44px] prose prose-invert max-w-none',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey && onEnter) {
          event.preventDefault();
          onEnter();
          return true;
        }
        return false;
      },
    },
  });

  // Handle emoji selection
  const handleEmojiSelect = useCallback((emoji) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji).run();
    }
  }, [editor]);

  // Handle mention trigger
  const handleMentionTrigger = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertContent('@').run();
    }
  }, [editor]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync editor content with value prop
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      if (!value || value === '<p></p>' || value.trim() === '') {
        editor.commands.clearContent();
        setIsEditing(false);
      } else {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  // Reset editing state when value changes externally (like clearing after adding todo)
  useEffect(() => {
    if (!value || value === '<p></p>' || value.trim() === '') {
      setIsEditing(false);
    }
  }, [value]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && editorRef.current && !editorRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
        setEmojiPickerPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <div ref={editorRef} className="bg-neutral-800 border border-neutral-600 rounded-lg overflow-hidden relative">
      {showToolbar && (
        <Toolbar 
          editor={editor}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          setEmojiPickerPosition={setEmojiPickerPosition}
          onMentionTrigger={handleMentionTrigger}
        />
      )}
      
      <div className="relative">
        <EditorContent 
          editor={editor}
        />
      </div>
      
      {showToolbar && showEmojiPicker && (
        <EmojiPicker 
          onSelect={handleEmojiSelect}
          onClose={() => {
            setShowEmojiPicker(false);
            setEmojiPickerPosition(null);
          }}
          position={emojiPickerPosition}
        />
      )}
    </div>
  );
};

export default TipTapEditor;