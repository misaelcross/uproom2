import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createEditor, Editor, Transforms, Range, Node } from 'slate';
import { Slate, Editable, withReact, useSlate, useSelected, useFocused } from 'slate-react';
import { withHistory } from 'slate-history';
import { Bold, Italic, Strikethrough, Underline, Smile, AtSign } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

// Mock users data for mentions
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
          className={`inline-block px-2 py-1 mx-1 bg-white text-black rounded-md text-sm ${
            selected && focused ? 'ring-2 ring-gray-400' : ''
          }`}
        >
          @{element.character}
          {children}
        </span>
      );
    default:
      return <p {...attributes} className="mt-0">{children}</p>;
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
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredUsers.length === 0) return null;

  const dropdownLeft = Math.max(10, Math.min(position.left, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 220));
  const dropdownTop = position.top - 56;

  return (
    <div 
      className="absolute bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-[9999] max-h-48"
      style={{ 
        top: dropdownTop,
        left: dropdownLeft,
        minWidth: '200px',
        maxWidth: '200px',
        transform: 'translateY(-134%) translateX(250%)',
        pointerEvents: 'auto'
      }}
    >
      <SimpleBar style={{ maxHeight: '192px' }}>
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
            <span className="text-neutral-400 text-xs">@{user.name}</span>
          </div>
        </button>
      ))}
      </SimpleBar>
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
        
        // Look for @ symbol before cursor
        const beforePoint = Editor.before(editor, start, { unit: 'character' });
        let atPoint = beforePoint;
        let searchText = '';
        
        // Find the @ symbol and collect search text
        while (atPoint) {
          const char = Editor.string(editor, { anchor: atPoint, focus: Editor.after(editor, atPoint) });
          if (char === '@') {
            break;
          }
          searchText = char + searchText;
          const prevPoint = Editor.before(editor, atPoint, { unit: 'character' });
          if (!prevPoint) break;
          atPoint = prevPoint;
        }
        
        if (atPoint) {
          // Select from @ to current cursor position
          const range = { anchor: atPoint, focus: start };
          Transforms.select(editor, range);
          
          // Replace with mention
          const mention = {
            type: 'mention',
            character: user.name,
            children: [{ text: '' }],
          };
          
          Transforms.insertNodes(editor, mention);
          
          // Add space after mention
          Transforms.insertText(editor, ' ');
        } else {
          // Fallback: just insert the full name as text
          Transforms.insertText(editor, `@${user.name} `);
        }
      } else {
        // Fallback: just insert the full name as text
        Transforms.insertText(editor, `@${user.name} `);
      }
    } catch (error) {
      console.error('Error in handleMentionSelect:', error);
      // Fallback: just insert the full name as text
      Transforms.insertText(editor, `@${user.name} `);
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
          top: rect.top - editorRect.top,
          left: rect.left - editorRect.left
        });
      }
    } else if (showMentionDropdown && event.key === 'Escape') {
      setShowMentionDropdown(false);
      setMentionSearch('');
    } else if (showMentionDropdown && selection && Range.isCollapsed(selection)) {
      // Update search term as user types after @
      setTimeout(() => {
        try {
          const [start] = Range.edges(selection);
          const beforePoint = Editor.before(editor, start, { unit: 'character' });
          let atPoint = beforePoint;
          let searchText = '';
          
          // Find the @ symbol and collect search text
          while (atPoint) {
            const char = Editor.string(editor, { anchor: atPoint, focus: Editor.after(editor, atPoint) });
            if (char === '@') {
              break;
            }
            if (char === ' ' || char === '\n') {
              // Stop if we hit whitespace (no @ found)
              atPoint = null;
              break;
            }
            searchText = char + searchText;
            const prevPoint = Editor.before(editor, atPoint, { unit: 'character' });
            if (!prevPoint) break;
            atPoint = prevPoint;
          }
          
          if (atPoint) {
            // We found @, update search term
            const currentChar = Editor.string(editor, { anchor: beforePoint, focus: start });
            const newSearchText = searchText + currentChar;
            setMentionSearch(newSearchText);
          } else {
            // No @ found, close dropdown
            setShowMentionDropdown(false);
            setMentionSearch('');
          }
        } catch (error) {
          // If there's an error, just close the dropdown
          setShowMentionDropdown(false);
          setMentionSearch('');
        }
      }, 0);
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
        
        <div className="relative overflow-visible">
          <Editable
            renderLeaf={Leaf}
            renderElement={Element}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="px-4 py-3 text-white placeholder-neutral-400 focus:outline-none min-h-[44px] bg-transparent"
          />
          
          {showEmojiPicker && (
            <EmojiPicker 
              onSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>
        
          {showMentionDropdown && (
            <MentionDropdown
              search={mentionSearch}
              onSelect={handleMentionSelect}
              onClose={() => setShowMentionDropdown(false)}
              position={mentionPosition}
            />
          )}
      </Slate>
    </div>
  );
};

export default RichTextEditor;