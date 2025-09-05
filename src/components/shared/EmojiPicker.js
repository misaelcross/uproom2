import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
const EmojiPickerDropdown = ({ onSelect, onClose, position, buttonRef }) => {
  if (!position || !buttonRef.current) return null;

  const rect = buttonRef.current.getBoundingClientRect();
  const dropdownWidth = 280;
  const dropdownHeight = 200;
  
  // Calculate position based on available space
  let top = rect.bottom + window.scrollY + 4;
  let left = rect.right + window.scrollX - dropdownWidth;
  
  // Adjust if dropdown would go off screen
  if (left < 10) {
    left = rect.left + window.scrollX;
  }
  
  if (top + dropdownHeight > window.innerHeight + window.scrollY - 10) {
    top = rect.top + window.scrollY - dropdownHeight - 4;
  }

  return createPortal(
    <div 
      className="fixed bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg p-3 max-h-48 overflow-hidden"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 9999,
        minWidth: `${dropdownWidth}px`,
        width: `${dropdownWidth}px`
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

// Main Emoji Picker Component with hidden editor
const EmojiPicker = ({ onEmojiSelect, position = 'bottom-right', className = '' }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

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
        ref={buttonRef}
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
          buttonRef={buttonRef}
        />
      )}
    </div>
  );
};

export default EmojiPicker;