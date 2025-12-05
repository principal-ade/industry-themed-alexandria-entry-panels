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
}) => {
  const { theme } = useTheme();
  const [copiedPath, setCopiedPath] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const highlightColor = theme.colors.primary;

  // Get avatar URL from GitHub owner
  const avatarUrl = entry.github?.owner
    ? `https://github.com/${entry.github.owner}.png`
    : null;

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

  const renderActionButtons = (isCompact = false) => {
    const buttonFlex = isCompact ? 1 : undefined;

    if (actionMode === 'add-to-workspace') {
      return (
        <button
          type="button"
          onClick={handleAddToWorkspaceClick}
          disabled={isLoading}
          title="Add to workspace"
          style={{
            flex: buttonFlex,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 10px',
            gap: '4px',
            borderRadius: '4px',
            border: `1px solid ${theme.colors.primary || '#3b82f6'}`,
            backgroundColor: `${theme.colors.primary || '#3b82f6'}15`,
            color: theme.colors.primary || '#3b82f6',
            fontSize: `${theme.fontSizes[0]}px`,
            fontWeight: theme.fontWeights.medium,
            cursor: isLoading ? 'wait' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {isLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Plus size={12} />
          )}
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      );
    }

    // Copy path button - shown in all modes except add-to-workspace
    const copyPathButton = (
      <button
        type="button"
        onClick={handleCopyPath}
        title={copiedPath ? 'Copied!' : `Copy path: ${entry.path}`}
        style={{
          flex: buttonFlex,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 10px',
          gap: '4px',
          borderRadius: '4px',
          border: `1px solid ${copiedPath ? theme.colors.success || '#10b981' : theme.colors.border}`,
          backgroundColor: copiedPath
            ? `${theme.colors.success || '#10b981'}15`
            : theme.colors.backgroundTertiary,
          color: copiedPath
            ? theme.colors.success || '#10b981'
            : theme.colors.textSecondary,
          fontSize: `${theme.fontSizes[0]}px`,
          fontWeight: theme.fontWeights.medium,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        {copiedPath ? <Check size={12} /> : <Copy size={12} />}
        {copiedPath ? 'Copied' : 'Path'}
      </button>
    );

    // Workspace mode - show Move (if outside), Open, and Remove buttons
    if (actionMode === 'workspace') {
      return (
        <>
          {/* Move to workspace button - if outside workspace */}
          {isInWorkspaceDirectory === false && onMoveToWorkspace && (
            <button
              type="button"
              onClick={handleMoveToWorkspaceClick}
              disabled={isMoving}
              title="Move to workspace directory"
              style={{
                flex: buttonFlex,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 10px',
                gap: '4px',
                borderRadius: '4px',
                border: `1px solid ${theme.colors.primary || '#3b82f6'}`,
                backgroundColor: `${theme.colors.primary || '#3b82f6'}15`,
                color: theme.colors.primary || '#3b82f6',
                fontSize: `${theme.fontSizes[0]}px`,
                fontWeight: theme.fontWeights.medium,
                cursor: isMoving ? 'wait' : 'pointer',
                opacity: isMoving ? 0.6 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {isMoving ? <Loader2 size={12} className="animate-spin" /> : <MoveUp size={12} />}
              {isMoving ? 'Moving...' : 'Move'}
            </button>
          )}

          {copyPathButton}

          {/* Open button */}
          <button
            type="button"
            onClick={handleOpenClick}
            title="Open repository"
            style={{
              flex: buttonFlex,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 10px',
              gap: '4px',
              borderRadius: '4px',
              border: `1px solid ${theme.colors.success || '#10b981'}`,
              backgroundColor: `${theme.colors.success || '#10b981'}15`,
              color: theme.colors.success || '#10b981',
              fontSize: `${theme.fontSizes[0]}px`,
              fontWeight: theme.fontWeights.medium,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <FolderOpen size={12} />
            Open
          </button>

          {/* Remove from workspace button */}
          {onRemoveFromWorkspace && (
            <button
              type="button"
              onClick={handleRemoveFromWorkspaceClick}
              disabled={isRemoving}
              title="Remove from workspace"
              style={{
                flex: buttonFlex,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: isCompact ? undefined : '28px',
                height: '28px',
                padding: isCompact ? '6px 10px' : 0,
                gap: '4px',
                borderRadius: '4px',
                border: isCompact ? `1px solid ${theme.colors.error || '#ef4444'}` : 'none',
                backgroundColor: isCompact ? `${theme.colors.error || '#ef4444'}15` : 'transparent',
                color: isCompact ? theme.colors.error || '#ef4444' : theme.colors.textSecondary,
                fontSize: `${theme.fontSizes[0]}px`,
                fontWeight: theme.fontWeights.medium,
                cursor: isRemoving ? 'wait' : 'pointer',
                opacity: isRemoving ? 0.6 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {isRemoving ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
              {isCompact && (isRemoving ? 'Removing...' : 'Remove')}
            </button>
          )}
        </>
      );
    }

    // Default and minimal modes - show Open button
    return (
      <>
        {copyPathButton}
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
          style={{
            flex: buttonFlex,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 10px',
            gap: '4px',
            borderRadius: '4px',
            border: `1px solid ${theme.colors.success || '#10b981'}`,
            backgroundColor: `${theme.colors.success || '#10b981'}15`,
            color: theme.colors.success || '#10b981',
            fontSize: `${theme.fontSizes[0]}px`,
            fontWeight: theme.fontWeights.medium,
            cursor: windowState === 'opening' ? 'wait' : 'pointer',
            opacity: windowState === 'opening' ? 0.6 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {windowState === 'ready' ? (
            <Focus size={12} />
          ) : windowState === 'opening' ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <FolderOpen size={12} />
          )}
          {windowState === 'ready'
            ? 'Focus'
            : windowState === 'opening'
              ? 'Opening...'
              : 'Open'}
        </button>

        {/* Remove button - only in default mode */}
        {actionMode === 'default' && onRemove && (
          <button
            type="button"
            onClick={handleRemoveClick}
            disabled={isLoading}
            title="Remove from local projects"
            style={{
              flex: buttonFlex,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: isCompact ? undefined : '28px',
              height: '28px',
              padding: isCompact ? '6px 10px' : 0,
              gap: '4px',
              borderRadius: '4px',
              border: isCompact ? `1px solid ${theme.colors.error || '#ef4444'}` : 'none',
              backgroundColor: isCompact ? `${theme.colors.error || '#ef4444'}15` : 'transparent',
              color: isCompact ? theme.colors.error || '#ef4444' : theme.colors.textSecondary,
              fontSize: `${theme.fontSizes[0]}px`,
              fontWeight: theme.fontWeights.medium,
              cursor: isLoading ? 'wait' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            {isCompact && (isLoading ? 'Removing...' : 'Remove')}
          </button>
        )}
      </>
    );
  };

  return (
    <div
      className="local-project-card"
      style={{
        padding: '8px 12px',
        borderRadius: '4px',
        backgroundColor: isSelected ? `${highlightColor}15` : 'transparent',
        border: isSelected
          ? `1px solid ${highlightColor}40`
          : '1px solid transparent',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        fontFamily: theme.fonts.body,
      }}
      onClick={handleCardClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Top row: Avatar + Name (+ buttons in non-compact) */}
      <div className="local-project-card__content">
        {/* Owner avatar */}
        <RepositoryAvatar
          customAvatarUrl={avatarUrl}
          size={32}
          fallbackIcon={
            <div
              style={{
                color: theme.colors.textSecondary,
                fontSize: `${theme.fontSizes[0]}px`,
                fontWeight: theme.fontWeights.semibold,
              }}
            >
              {entry.name[0]?.toUpperCase() || '?'}
            </div>
          }
        />

        {/* Name and info */}
        <div className="local-project-card__info">
          {/* Name */}
          <span
            style={{
              fontSize: `${theme.fontSizes[2]}px`,
              fontWeight: theme.fontWeights.medium,
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

          {/* Description - hidden in compact via CSS */}
          {entry.github?.description && (
            <div
              className="local-project-card__meta"
              style={{
                alignItems: 'center',
                gap: '12px',
                fontSize: `${theme.fontSizes[0]}px`,
                color: theme.colors.textSecondary,
              }}
            >
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {entry.github.description}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons - inline, hidden in compact via CSS */}
        <div className="local-project-card__actions">
          {renderActionButtons(false)}
        </div>
      </div>

      {/* Action buttons - stacked below, shown only in compact via CSS */}
      <div className="local-project-card__actions--stacked">
        {renderActionButtons(true)}
      </div>
    </div>
  );
};
