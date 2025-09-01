import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import { Bold, Italic, Strikethrough, Underline, Smile, AtSign } from 'lucide-react';
import 'simplebar-react/dist/simplebar.min.css';
import { formatMentionName } from '../../utils/mentionUtils';

// Mock users data
const mockUsers = [
  { id: 1, name: 'John Doe', username: 'johndoe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face' },
  { id: 2, name: 'Jane Smith', username: 'janesmith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face' },
  { id: 3, name: 'Mike Johnson', username: 'mikejohnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face' },
  { id: 4, name: 'Sarah Wilson', username: 'sarahwilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face' },
  { id: 5, name: 'David Brown', username: 'davidbrown', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face' }
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
const Toolbar = ({ editor, showEmojiPicker, setShowEmojiPicker, onMentionTrigger }) => {
  if (!editor) return null;

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
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
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
const EmojiPicker = ({ onSelect, onClose }) => {
  return (
    <div className="absolute top-full left-0 mt-1 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-50 p-3 max-h-48 overflow-auto" data-simplebar>
      <div className="grid grid-cols-8 gap-1">
        {emojiList.map((emoji, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="p-1 hover:bg-neutral-700 rounded text-lg transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
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
    <div className="bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-50 max-h-48 overflow-auto" data-simplebar>
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
const TipTapEditor = ({ value, onChange, placeholder = "Type something..." }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
        HTMLAttributes: {
          class: 'mention bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold',
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

  return (
    <div ref={editorRef} className="bg-neutral-800 border border-neutral-600 rounded-lg overflow-hidden relative">
      <Toolbar 
        editor={editor}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        onMentionTrigger={handleMentionTrigger}
      />
      
      <div className="relative">
        <EditorContent 
          editor={editor}
        />
        
        {showEmojiPicker && (
          <EmojiPicker 
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TipTapEditor;