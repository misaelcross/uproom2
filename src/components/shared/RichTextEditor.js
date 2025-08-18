import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { createEditor, Editor, Transforms, Range, Node } from 'slate';
import { Slate, Editable, withReact, useSlate, useSelected, useFocused } from 'slate-react';
import { withHistory } from 'slate-history';
import { Bold, Italic, Strikethrough, Underline, Smile, AtSign } from 'lucide-react';

// Mock users data for mentions
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

// Custom leaf component for rendering formatted text
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  return <span {...attributes}>{children}</span>;
};

// Custom element component for mentions
const Element = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();

  switch (element.type) {
    case 'mention':
      return (
        <span
          {...attributes}
          contentEditable={false}
          className={`inline-block px-2 py-1 mx-1 bg-blue-500/20 text-blue-400 rounded-md text-sm ${
            selected && focused ? 'ring-2 ring-blue-400' : ''
          }`}
        >
          @{element.character}
          {children}
        </span>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

// Toolbar button component
const ToolbarButton = ({ format, icon: Icon, isActive, onMouseDown }) => {
  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      className={`p-2 rounded transition-colors ${
        isActive
          ? 'bg-neutral-600 text-white'
          : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

// Toolbar component
const Toolbar = ({ showEmojiPicker, setShowEmojiPicker, onEmojiSelect, onMentionTrigger }) => {
  const editor = useSlate();

  const isMarkActive = (format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (format) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  return (
    <div className="flex items-center space-x-1 p-2 border-b border-neutral-600 bg-neutral-800">
      <ToolbarButton
        format="bold"
        icon={Bold}
        isActive={isMarkActive('bold')}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark('bold');
        }}
      />
      <ToolbarButton
        format="italic"
        icon={Italic}
        isActive={isMarkActive('italic')}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark('italic');
        }}
      />
      <ToolbarButton
        format="underline"
        icon={Underline}
        isActive={isMarkActive('underline')}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark('underline');
        }}
      />
      <ToolbarButton
        format="strikethrough"
        icon={Strikethrough}
        isActive={isMarkActive('strikethrough')}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark('strikethrough');
        }}
      />
      
      <div className="w-px h-6 bg-neutral-600 mx-2" />
      
      <button
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="p-2 rounded transition-colors text-neutral-400 hover:text-white hover:bg-neutral-700"
      >
        <Smile className="w-4 h-4" />
      </button>
      
      <button
        type="button"
        onClick={onMentionTrigger}
        className="p-2 rounded transition-colors text-neutral-400 hover:text-white hover:bg-neutral-700"
      >
        <AtSign className="w-4 h-4" />
      </button>
    </div>
  );
};

// Emoji picker component
const EmojiPicker = ({ onSelect, onClose }) => {
  return (
    <div className="absolute bottom-full left-0 mb-14 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-50 p-3">
      <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
        {emojiList.map((emoji, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(emoji)}
            className="p-2 hover:bg-neutral-700 rounded text-lg transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// Mention dropdown component
const MentionDropdown = ({ search, onSelect, onClose, position }) => {
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredUsers.length === 0) return null;

  return (
    <div 
      className="absolute bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto mb-3.5"
      style={{ 
        bottom: position.bottom + 14, 
        left: position.left,
        minWidth: '200px'
      }}
    >
      {filteredUsers.map(user => (
        <button
          key={user.id}
          type="button"
          onClick={() => onSelect(user)}
          className="flex items-center space-x-3 w-full px-3 py-2 hover:bg-neutral-700 transition-colors text-left first:rounded-t-lg last:rounded-b-lg"
        >
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-6 h-6 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=32&background=6b7280&color=ffffff`;
            }}
          />
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{user.name}</span>
            <span className="text-neutral-400 text-xs">@{user.username}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

// Default initial value for Slate editor
const defaultInitialValue = [{ type: 'paragraph', children: [{ text: '' }] }];

// Main RichTextEditor component
const RichTextEditor = ({ value, onChange, placeholder = "Type something..." }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef(null);

  // Initialize editor value - use a stable reference
  const initialValue = useMemo(() => {
    if (value && typeof value === 'string' && value.trim()) {
      return [{ type: 'paragraph', children: [{ text: value }] }];
    }
    return defaultInitialValue;
  }, [value]);

  // Handle editor change
  const handleChange = useCallback((newValue) => {
    const isAstChange = editor.operations.some(
      op => 'set_selection' !== op.type
    );
    if (isAstChange && onChange) {
      // Convert Slate value to plain text
      const text = newValue
        .filter(n => n && typeof n === 'object')
        .map(n => {
          try {
            return Node.string(n);
          } catch (error) {
            return '';
          }
        })
        .join('\n');
      onChange(text);
    }
  }, [editor, onChange]);

  // Handle emoji selection
  const handleEmojiSelect = useCallback((emoji) => {
    try {
      // Ensure editor has valid content
      if (!editor.children || editor.children.length === 0) {
        Transforms.insertNodes(editor, defaultInitialValue);
      }
      
      Transforms.insertText(editor, emoji);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error in handleEmojiSelect:', error);
    }
  }, [editor]);

  // Handle mention trigger
  const handleMentionTrigger = useCallback(() => {
    try {
      // Ensure editor has valid content
      if (!editor.children || editor.children.length === 0) {
        Transforms.insertNodes(editor, defaultInitialValue);
      }
      
      Transforms.insertText(editor, '@');
      setShowMentionDropdown(true);
      setMentionSearch('');
    } catch (error) {
      console.error('Error in handleMentionTrigger:', error);
    }
  }, [editor]);

  // Handle mention selection
  const handleMentionSelect = useCallback((user) => {
    try {
      const { selection } = editor;
      
      // Ensure editor has valid content
      if (!editor.children || editor.children.length === 0) {
        Transforms.insertNodes(editor, defaultInitialValue);
      }
      
      if (selection && Range.isCollapsed(selection)) {
        const [start] = Range.edges(selection);
        const wordBefore = Editor.before(editor, start, { unit: 'word' });
        const before = wordBefore && Editor.before(editor, wordBefore);
        const beforeRange = before && Editor.range(editor, before, start);
        const beforeText = beforeRange && Editor.string(editor, beforeRange);
        const beforeMatch = beforeText && beforeText.match(/@(\w*)$/);
        
        if (beforeMatch) {
          const beforeMatchRange = Editor.range(editor, before, start);
          Transforms.select(editor, beforeMatchRange);
          Transforms.delete(editor);
          
          const mention = {
            type: 'mention',
            character: `@${user.username}`,
            children: [{ text: '' }],
          };
          
          Transforms.insertNodes(editor, mention);
          Transforms.move(editor);
        }
      }
    } catch (error) {
      console.error('Error in handleMentionSelect:', error);
      // Fallback: just insert the username as text
      Transforms.insertText(editor, `@${user.username} `);
    }
    
    setShowMentionDropdown(false);
    setMentionSearch('');
  }, [editor]);

  // Handle key down for mentions
  const handleKeyDown = useCallback((event) => {
    const { selection } = editor;
    
    if (event.key === '@') {
      setShowMentionDropdown(true);
      setMentionSearch('');
      
      // Get cursor position for dropdown placement
      if (selection && editorRef.current) {
        const domSelection = window.getSelection();
        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();
        
        setMentionPosition({
          bottom: editorRect.bottom - rect.top,
          left: rect.left - editorRect.left
        });
      }
    } else if (showMentionDropdown && event.key === 'Escape') {
      setShowMentionDropdown(false);
      setMentionSearch('');
    }
  }, [editor, showMentionDropdown]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
        setShowMentionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={editorRef} className="relative border border-neutral-600 rounded-lg bg-transparent focus-within:ring-2 focus-within:ring-white focus-within:border-transparent">
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <Toolbar 
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          onEmojiSelect={handleEmojiSelect}
          onMentionTrigger={handleMentionTrigger}
        />
        
        <div className="relative">
          <Editable
            renderLeaf={Leaf}
            renderElement={Element}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="px-4 py-3 pr-16 text-white placeholder-neutral-400 focus:outline-none min-h-[44px] bg-transparent"
          />
          
          {showEmojiPicker && (
            <EmojiPicker 
              onSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
          
          {showMentionDropdown && (
            <MentionDropdown
              search={mentionSearch}
              onSelect={handleMentionSelect}
              onClose={() => setShowMentionDropdown(false)}
              position={mentionPosition}
            />
          )}
        </div>
      </Slate>
    </div>
  );
};

export default RichTextEditor;