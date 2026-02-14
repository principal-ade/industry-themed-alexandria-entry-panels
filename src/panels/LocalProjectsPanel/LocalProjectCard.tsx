import React, { useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Copy, Check, Lock, GitBranch } from 'lucide-react';
import { useDraggable } from '@principal-ade/panel-framework-core';
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
  workspacePath,
  userHomePath,
  disableCopyPaths = true,
  isInSelectedCollection = false,
  selectedCollectionName,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);

  // Add drag-and-drop functionality
  // Don't make draggable if already in the selected collection
  const { isDragging, ...dragProps } = useDraggable({
    dataType: 'repository-project', // Custom data type for repository projects
    primaryData: entry.path,
    metadata: {
      name: entry.name,
      github: entry.github,
      hasViews: entry.hasViews,
      remoteUrl: entry.remoteUrl,
    },
    suggestedActions: ['add-to-collection'], // Custom action for collection map
    sourcePanel: 'local-projects',
    dragPreview: entry.name,
  });

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
      return relativePath.startsWith('/')
        ? relativePath.slice(1)
        : relativePath;
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

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    padding: '16px',
    borderRadius: '0',
    backgroundColor: isSelected
      ? theme.colors.backgroundTertiary
      : isHovered
        ? theme.colors.backgroundTertiary
        : 'transparent',
    border: `1px solid ${
      isSelected ? theme.colors.primary || theme.colors.border : 'transparent'
    }`,
    cursor: isInSelectedCollection
      ? 'not-allowed'
      : isDragging
        ? 'grabbing'
        : 'grab',
    opacity: isDragging ? 0.5 : isInSelectedCollection ? 0.7 : 1,
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
      {...(isInSelectedCollection ? {} : dragProps)}
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
            className={
              entry.github?.primaryLanguage
                ? 'project-name-underline'
                : undefined
            }
            style={
              {
                fontSize: `${theme.fontSizes[2]}px`,
                fontWeight: theme.fontWeights.semibold,
                color: theme.colors.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                '--underline-color': entry.github?.primaryLanguage
                  ? getLanguageColor(entry.github.primaryLanguage)
                  : theme.colors.textSecondary,
              } as React.CSSProperties
            }
          >
            {entry.name}
          </span>
          {/* Private badge */}
          {entry.github && entry.github.isPublic === false && (
            <span title="Private repository">
              <Lock
                size={12}
                style={{ color: theme.colors.textSecondary, flexShrink: 0 }}
              />
            </span>
          )}
          {/* In Collection badge */}
          {isInSelectedCollection && selectedCollectionName && (
            <span
              title={`Already in "${selectedCollectionName}"`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: theme.colors.success
                  ? `${theme.colors.success}20`
                  : '#10b98120',
                color: theme.colors.success || '#10b981',
                fontSize: `${theme.fontSizes[0]}px`,
                fontWeight: theme.fontWeights.medium,
                flexShrink: 0,
              }}
            >
              <Check size={12} />
              <span>In Map</span>
            </span>
          )}
          {/* Untracked badge for discovered repos */}
          {actionMode === 'discovered' && (
            <span
              title="Untracked repository"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: `${theme.colors.warning || '#f59e0b'}20`,
                color: theme.colors.warning || '#f59e0b',
                fontSize: `${theme.fontSizes[0]}px`,
                fontWeight: theme.fontWeights.medium,
                flexShrink: 0,
              }}
            >
              <GitBranch size={10} />
              <span>Untracked</span>
            </span>
          )}
        </div>

        {/* Path row - click to copy */}
        <div
          onClick={disableCopyPaths ? undefined : handleCopyPath}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: disableCopyPaths ? 'default' : 'pointer',
          }}
          title={
            disableCopyPaths
              ? displayPath
              : copiedPath
                ? 'Copied!'
                : `Click to copy: ${entry.path}`
          }
        >
          <span
            style={{
              flex: 1,
              fontSize: `${theme.fontSizes[1]}px`,
              color: copiedPath
                ? theme.colors.success || '#10b981'
                : theme.colors.textSecondary,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
              transition: 'color 0.15s ease',
            }}
          >
            {copiedPath ? '✓ Copied!' : displayPath}
          </span>
          {!disableCopyPaths && !copiedPath && (
            <Copy
              size={12}
              style={{
                color: theme.colors.textSecondary,
                flexShrink: 0,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.15s ease',
              }}
            />
          )}
          {!disableCopyPaths && copiedPath && (
            <Check
              size={12}
              style={{
                color: theme.colors.success || '#10b981',
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
