import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Smile } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

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

// Emoji Picker Dropdown Component
const EmojiPickerDropdown = ({ onSelect, onClose, position = 'bottom-right' }) => {
  const positionClasses = {
    'bottom-right': 'absolute bottom-full right-0 mb-2',
    'top-left': 'absolute top-full left-0 mt-1',
    'bottom-left': 'absolute bottom-full left-0 mb-2'
  };

  return (
    <div className={`${positionClasses[position]} bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg z-50 p-3 max-h-48 overflow-hidden`}>
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
              className="p-1 hover:bg-neutral-700 rounded text-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </SimpleBar>
    </div>
  );
};

// Main Emoji Picker Component with hidden editor
const EmojiPicker = ({ onEmojiSelect, position = 'bottom-right', className = '' }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const containerRef = useRef(null);

  // Hidden editor instance for emoji functionality
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editable: false, // Make it non-editable since it's hidden
  });

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji).run();
      const content = editor.getText();
      onEmojiSelect(emoji, content);
    } else {
      // Fallback if editor is not ready
      onEmojiSelect(emoji, emoji);
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Hidden editor - not displayed but used for emoji processing */}
      <div className="hidden">
        <EditorContent editor={editor} />
      </div>
      
      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="p-2 rounded transition-colors text-neutral-400 hover:text-white hover:bg-neutral-700"
        title="Add Emoji"
      >
        <Smile size={16} />
      </button>
      
      {/* Emoji Picker Dropdown */}
      {showEmojiPicker && (
        <EmojiPickerDropdown 
          onSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
          position={position}
        />
      )}
    </div>
  );
};

export default EmojiPicker;