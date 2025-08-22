// Utility functions for user mentions

// Função para obter cores baseadas no status (seguindo padrão dos user cards)
export const getStatusColors = (availability) => {
  switch (availability) {
    case 'Available':
      return { text: 'text-green-400', bg: 'bg-green-500/10' };
    case 'In meeting':
      return { text: 'text-blue-400', bg: 'bg-blue-500/10' };
    case 'Break':
      return { text: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    case 'Focus':
      return { text: 'text-purple-400', bg: 'bg-purple-500/10' };
    case 'Emergency':
      return { text: 'text-red-400', bg: 'bg-red-500/10' };
    case 'Away':
      return { text: 'text-orange-400', bg: 'bg-orange-500/10' };
    case 'Offline':
      return { text: 'text-gray-400', bg: 'bg-gray-500/10' };
    default:
      return { text: 'text-blue-400', bg: 'bg-blue-500/10' };
  }
};

// Function to get background color based on user availability status (mantida para compatibilidade)
export const getStatusBackgroundColor = (availability) => {
  const colors = getStatusColors(availability);
  return colors.bg;
};

// Function to format user name for mentions (@NomeSobrenome)
export const formatMentionName = (name) => {
  if (!name) return '';
  
  // Remove spaces and capitalize first letter of each word
  const words = name.split(' ');
  const formattedName = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('');
  
  return `@${formattedName}`;
};

// Function to create standardized mention component
export const createMentionSpan = (user, mentionName, handlers = {}) => {
  const { onMouseEnter, onMouseLeave, onClick } = handlers;
  const colors = getStatusColors(user.availability);
  
  return {
    className: `inline-block px-2 py-1 rounded font-semibold text-xs cursor-pointer transition-colors hover:opacity-80 ${colors.text} ${colors.bg}`,
    onMouseEnter,
    onMouseLeave,
    onClick,
    children: formatMentionName(mentionName)
  };
};

// Function to render text with standardized mentions
export const renderTextWithStandardizedMentions = (text, usersData, handlers = {}, isPreview = false) => {
  if (!text) return text;
  
  // Se for preview, retorna texto simples sem formatação
  if (isPreview) {
    return text;
  }
  
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
      const mentionProps = createMentionSpan(user, user.name, {
        onMouseEnter: handlers.onMouseEnter ? (e) => handlers.onMouseEnter(user, e) : undefined,
        onMouseLeave: handlers.onMouseLeave,
        onClick: handlers.onClick ? () => handlers.onClick(user) : undefined
      });
      
      parts.push({
        type: 'mention',
        key: match.index,
        props: mentionProps
      });
    } else {
      // Fallback for unknown users
      parts.push({
        type: 'unknown-mention',
        key: match.index,
        text: `@${mentionName}`,
        className: 'inline-block px-2 py-1 rounded bg-gray-500/10 text-gray-400 font-semibold text-xs'
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};