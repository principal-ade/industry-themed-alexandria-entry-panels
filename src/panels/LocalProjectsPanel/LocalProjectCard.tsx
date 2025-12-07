import React, { useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { FolderOpen, Focus, Loader2, X, Copy, Check, Plus, MoveUp } from 'lucide-react';
import { RepositoryAvatar } from './RepositoryAvatar';
import type { LocalProjectCardProps } from './types';
import './LocalProjectsPanel.css';

/**
 * Language color mapping for visual indicators
 */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#cc342d',
  PHP: '#777bb4',
  'C++': '#00599c',
  C: '#555555',
  'C#': '#239120',
  Swift: '#fa7343',
  Kotlin: '#7f52ff',
  Dart: '#0175c2',
  Vue: '#4fc08d',
  HTML: '#e34c26',
  CSS: '#1572b6',
  Shell: '#89e051',
  PowerShell: '#012456',
};

const getLanguageColor = (language: string): string => {
  return LANGUAGE_COLORS[language] || '#6e7681';
};

/**
 * LocalProjectCard - Individual project card with actions
 *
 * Displays repository info and provides action buttons based on mode:
 * - default: Open and Remove buttons
 * - add-to-workspace: Add button only
 * - minimal: Open button only
 */
export const LocalProjectCard: React.FC<LocalProjectCardProps> = ({
  entry,
  actionMode = 'default',
  isSelected = false,
  onSelect,
  onOpen,
  onRemove,
  onAddToWorkspace,
  onRemoveFromWorkspace,
  onMoveToWorkspace,
  isLoading = false,
  windowState = 'closed',
  compact: _compact = false,
  isInWorkspaceDirectory,
  workspacePath,
  userHomePath,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Get avatar URL from GitHub owner
  const avatarUrl = entry.github?.owner
    ? `https://github.com/${entry.github.owner}.png`
    : null;

  // Format path for display - strip workspace path or replace home with ~
  const getDisplayPath = (path: string): string => {
    // First try to strip workspace path
    if (workspacePath && path.startsWith(workspacePath)) {
      const relativePath = path.slice(workspacePath.length);
      // Remove leading slash if present
      return relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    }
    // Then try to replace home path with ~
    if (userHomePath && path.startsWith(userHomePath)) {
      return '~' + path.slice(userHomePath.length);
    }
    return path;
  };

  const displayPath = getDisplayPath(entry.path);

  const handleCardClick = () => {
    onSelect?.(entry);
  };

  const handleDoubleClick = () => {
    onOpen?.(entry);
  };

  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen?.(entry);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(entry);
  };

  const handleAddToWorkspaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWorkspace?.(entry);
  };

  const handleRemoveFromWorkspaceClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsRemoving(true);
      onRemoveFromWorkspace?.(entry);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleMoveToWorkspaceClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsMoving(true);
      onMoveToWorkspace?.(entry);
    } finally {
      setIsMoving(false);
    }
  };


  const handleCopyPath = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(entry.path);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    } catch (err) {
      console.error('Failed to copy path:', err);
    }
  };

  // Action button style - flex to share width
  const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    flex: 1,
    height: '24px',
    padding: '0 8px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    fontSize: `${theme.fontSizes[1]}px`,
    fontFamily: theme.fonts.body,
    transition: 'all 0.15s ease',
  };

  // Button hover handlers for consistent styling with WorkspaceCard
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isDestructive = false) => {
    if (isDestructive) {
      e.currentTarget.style.backgroundColor = `${theme.colors.error || '#ef4444'}15`;
      e.currentTarget.style.color = theme.colors.error || '#ef4444';
    } else {
      e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
      e.currentTarget.style.color = theme.colors.text;
    }
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>, defaultColor?: string) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = defaultColor || theme.colors.textSecondary;
  };

  const renderActionButtons = () => {
    if (actionMode === 'add-to-workspace') {
      return (
        <button
          type="button"
          onClick={handleAddToWorkspaceClick}
          disabled={isLoading}
          title="Add to workspace"
          style={actionButtonStyle}
          onMouseEnter={(e) => handleButtonHover(e)}
          onMouseLeave={(e) => handleButtonLeave(e)}
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          <span>Add</span>
        </button>
      );
    }

    if (actionMode === 'workspace') {
      return (
        <>
          {isInWorkspaceDirectory === false && onMoveToWorkspace && (
            <button
              type="button"
              onClick={handleMoveToWorkspaceClick}
              disabled={isMoving}
              title="Move to workspace directory"
              style={actionButtonStyle}
              onMouseEnter={(e) => handleButtonHover(e)}
              onMouseLeave={(e) => handleButtonLeave(e)}
            >
              {isMoving ? <Loader2 size={14} className="animate-spin" /> : <MoveUp size={14} />}
              <span>Move</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleCopyPath}
            title={copiedPath ? 'Copied!' : `Copy path: ${entry.path}`}
            style={{
              ...actionButtonStyle,
              color: copiedPath ? theme.colors.success || '#10b981' : theme.colors.textSecondary,
            }}
            onMouseEnter={(e) => handleButtonHover(e)}
            onMouseLeave={(e) => handleButtonLeave(e, copiedPath ? theme.colors.success || '#10b981' : undefined)}
          >
            {copiedPath ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedPath ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleOpenClick}
            title="Open repository"
            style={actionButtonStyle}
            onMouseEnter={(e) => handleButtonHover(e)}
            onMouseLeave={(e) => handleButtonLeave(e)}
          >
            <FolderOpen size={14} />
            <span>Open</span>
          </button>
          {onRemoveFromWorkspace && (
            <button
              type="button"
              onClick={handleRemoveFromWorkspaceClick}
              disabled={isRemoving}
              title="Remove from workspace"
              style={actionButtonStyle}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonLeave(e)}
            >
              {isRemoving ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
              <span>Remove</span>
            </button>
          )}
        </>
      );
    }

    // Default and minimal modes
    return (
      <>
        <button
          type="button"
          onClick={handleCopyPath}
          title={copiedPath ? 'Copied!' : `Copy path: ${entry.path}`}
          style={{
            ...actionButtonStyle,
            color: copiedPath ? theme.colors.success || '#10b981' : theme.colors.textSecondary,
          }}
          onMouseEnter={(e) => handleButtonHover(e)}
          onMouseLeave={(e) => handleButtonLeave(e, copiedPath ? theme.colors.success || '#10b981' : undefined)}
        >
          {copiedPath ? <Check size={14} /> : <Copy size={14} />}
          <span>{copiedPath ? 'Copied' : 'Copy'}</span>
        </button>
        <button
          type="button"
          onClick={handleOpenClick}
          title={
            windowState === 'ready'
              ? 'Focus window'
              : windowState === 'opening'
                ? 'Window is opening...'
                : 'Open locally'
          }
          disabled={windowState === 'opening'}
          style={actionButtonStyle}
          onMouseEnter={(e) => handleButtonHover(e)}
          onMouseLeave={(e) => handleButtonLeave(e)}
        >
          {windowState === 'ready' ? (
            <Focus size={14} />
          ) : windowState === 'opening' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <FolderOpen size={14} />
          )}
          <span>{windowState === 'ready' ? 'Focus' : 'Open'}</span>
        </button>
        {actionMode === 'default' && onRemove && (
          <button
            type="button"
            onClick={handleRemoveClick}
            disabled={isLoading}
            title="Remove from local projects"
            style={actionButtonStyle}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonLeave(e)}
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            <span>Remove</span>
          </button>
        )}
      </>
    );
  };

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: isSelected
      ? theme.colors.backgroundTertiary
      : isHovered
        ? theme.colors.backgroundTertiary
        : 'transparent',
    border: `1px solid ${
      isSelected
        ? theme.colors.primary || theme.colors.border
        : isHovered
          ? theme.colors.border
          : 'transparent'
    }`,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: theme.fonts.body,
  };

  return (
    <div
      className="local-project-card"
      style={cardStyle}
      onClick={handleCardClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <RepositoryAvatar
        customAvatarUrl={avatarUrl}
        size={48}
        fallbackIcon={
          <div
            style={{
              color: theme.colors.textSecondary,
              fontSize: `${theme.fontSizes[2]}px`,
              fontWeight: theme.fontWeights.semibold,
            }}
          >
            {entry.name[0]?.toUpperCase() || '?'}
          </div>
        }
      />

      {/* Content column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: 0,
        }}
      >
        {/* Name row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              flex: 1,
              fontSize: `${theme.fontSizes[2]}px`,
              fontWeight: theme.fontWeights.semibold,
              color: theme.colors.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textDecoration: 'underline',
              textDecorationColor: entry.github?.primaryLanguage
                ? getLanguageColor(entry.github.primaryLanguage)
                : theme.colors.textSecondary,
              textUnderlineOffset: '3px',
            }}
          >
            {entry.name}
          </span>
        </div>

        {/* Description row with action buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            minHeight: '24px',
            position: 'relative',
          }}
        >
          {/* Description - hidden when hovered */}
          <div
            style={{
              flex: 1,
              fontSize: `${theme.fontSizes[1]}px`,
              color: theme.colors.textSecondary,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
              opacity: isHovered ? 0 : 1,
              transition: 'opacity 0.15s ease',
            }}
            title={entry.github?.description || displayPath}
          >
            {entry.github?.description || displayPath}
          </div>

          {/* Action buttons - cover full width when hovered */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: isHovered ? 1 : 0,
              pointerEvents: isHovered ? 'auto' : 'none',
              transition: 'opacity 0.15s ease',
            }}
          >
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};
