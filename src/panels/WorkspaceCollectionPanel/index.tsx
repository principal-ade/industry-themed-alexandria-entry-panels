import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import {
  ExternalLink,
  Folder,
  Loader2,
  Search,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import type { PanelComponentProps } from '../../types';
import type { GitHubRepository } from '../shared/github-types';
import type {
  Workspace,
  WorkspaceCollectionSlice,
  WorkspaceRepositoriesSlice,
  WorkspaceCollectionPanelActions,
} from './types';
import { RepositoryAvatar } from '../LocalProjectsPanel/RepositoryAvatar';

// Panel event prefix
const PANEL_ID = 'industry-theme.workspace-collection';

// Helper to create panel events
const createPanelEvent = <T,>(type: string, payload: T) => ({
  type,
  source: PANEL_ID,
  timestamp: Date.now(),
  payload,
});

/**
 * WorkspaceCollectionRepositoryCard - Displays a repository in a workspace collection
 */
interface WorkspaceCollectionRepositoryCardProps {
  repository: GitHubRepository;
  isSelected?: boolean;
  onSelect?: (repo: GitHubRepository) => void;
  onNavigate?: (repo: GitHubRepository) => void;
  onRemove?: (repo: GitHubRepository) => void;
}

const WorkspaceCollectionRepositoryCard: React.FC<WorkspaceCollectionRepositoryCardProps> = ({
  repository,
  isSelected = false,
  onSelect,
  onNavigate,
  onRemove,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(repository);
    }
  }, [onSelect, repository]);

  const handleNavigate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onNavigate) {
        onNavigate(repository);
      }
    },
    [onNavigate, repository]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onRemove) {
        onRemove(repository);
      }
    },
    [onRemove, repository]
  );

  const handleOpenOnGitHub = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      window.open(repository.html_url, '_blank', 'noopener,noreferrer');
    },
    [repository.html_url]
  );

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: isSelected
          ? `${theme.colors.primary}15`
          : isHovered
            ? theme.colors.backgroundTertiary
            : 'transparent',
        border: `1px solid ${isSelected ? theme.colors.primary : 'transparent'}`,
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'background-color 0.15s, border-color 0.15s',
      }}
    >
      {/* Avatar */}
      <RepositoryAvatar
        owner={repository.owner.login}
        customAvatarUrl={repository.owner.avatar_url}
        size={40}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header row: name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: `${theme.fontSizes[2]}px`,
              fontWeight: theme.fontWeights.semibold,
              fontFamily: theme.fonts.body,
              color: theme.colors.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={repository.full_name}
          >
            {repository.name}
          </span>
        </div>

        {/* Owner */}
        <div
          style={{
            fontSize: `${theme.fontSizes[0]}px`,
            fontFamily: theme.fonts.body,
            color: theme.colors.textSecondary,
            marginBottom: '4px',
          }}
        >
          {repository.owner.login}
        </div>

        {/* Description */}
        {repository.description && (
          <div
            style={{
              fontSize: `${theme.fontSizes[1]}px`,
              fontFamily: theme.fonts.body,
              color: theme.colors.textSecondary,
              lineHeight: theme.lineHeights.body,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              marginBottom: '8px',
            }}
          >
            {repository.description}
          </div>
        )}

        {/* Metadata row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: `${theme.fontSizes[0]}px`,
            fontFamily: theme.fonts.body,
            color: theme.colors.textSecondary,
          }}
        >
          {/* Language */}
          {repository.language && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getLanguageColor(repository.language),
                }}
              />
              {repository.language}
            </span>
          )}

          {/* Updated time */}
          <span>Updated {getRelativeTime(repository.pushed_at || repository.updated_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          opacity: isHovered || isSelected ? 1 : 0,
          transition: 'opacity 0.15s',
        }}
      >
        {/* Remove from workspace button */}
        {onRemove && (
          <button
            type="button"
            onClick={handleRemove}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: 'transparent',
              color: theme.colors.textSecondary,
              cursor: 'pointer',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            title="Remove from workspace"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.error || '#ef4444'}20`;
              e.currentTarget.style.color = theme.colors.error || '#ef4444';
              e.currentTarget.style.borderColor = theme.colors.error || '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.textSecondary;
              e.currentTarget.style.borderColor = theme.colors.border;
            }}
          >
            <Trash2 size={16} />
          </button>
        )}

        {/* Open on GitHub button */}
        <button
          type="button"
          onClick={handleOpenOnGitHub}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: 'transparent',
            color: theme.colors.textSecondary,
            cursor: 'pointer',
            transition: 'background-color 0.15s, color 0.15s',
          }}
          title="Open on GitHub"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
            e.currentTarget.style.color = theme.colors.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.colors.textSecondary;
          }}
        >
          <ExternalLink size={16} />
        </button>

        {/* Navigate button */}
        {onNavigate && (
          <button
            type="button"
            onClick={handleNavigate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              fontSize: `${theme.fontSizes[1]}px`,
              fontWeight: theme.fontWeights.medium,
              fontFamily: theme.fonts.body,
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            title="View repository"
          >
            <ArrowRight size={14} />
            View
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Get color for programming language
 */
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    Java: '#b07219',
    Ruby: '#701516',
    PHP: '#4F5D95',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Vue: '#41b883',
    Svelte: '#ff3e00',
  };
  return colors[language] || '#8b949e';
}

/**
 * WorkspaceCollectionPanelContent - Internal component that uses theme
 */
const WorkspaceCollectionPanelContent: React.FC<PanelComponentProps> = ({
  context,
  actions,
  events,
}) => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);

  // Get extended actions
  const panelActions = actions as WorkspaceCollectionPanelActions;

  // Get data from context using framework's getSlice pattern
  const workspaceSlice = context.getSlice<WorkspaceCollectionSlice>('workspace');
  const repositoriesSlice = context.getSlice<WorkspaceRepositoriesSlice>('workspaceRepositories');

  const workspace = workspaceSlice?.data?.workspace ?? null;
  const repositories = repositoriesSlice?.data?.repositories ?? [];
  const isLoading = workspaceSlice?.loading || repositoriesSlice?.loading || false;
  const error = workspaceSlice?.data?.error || repositoriesSlice?.data?.error;

  // Filter and sort repositories
  const filteredRepositories = useMemo(() => {
    let filtered = [...repositories];

    // Apply text filter
    if (filter.trim()) {
      const normalizedFilter = filter.trim().toLowerCase();
      filtered = filtered.filter((repo) => {
        const haystack = [
          repo.name,
          repo.full_name,
          repo.owner?.login ?? '',
          repo.description ?? '',
          repo.language ?? '',
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedFilter);
      });
    }

    // Sort alphabetically by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [repositories, filter]);

  // Event handlers
  const handleSelectRepository = useCallback(
    (repository: GitHubRepository) => {
      setSelectedRepo(repository);
      events.emit(
        createPanelEvent('repository:selected', {
          repositoryKey: repository.full_name,
          repository,
        })
      );
      // Also call preview action if available
      if (panelActions.previewRepository) {
        panelActions.previewRepository(repository);
      }
    },
    [events, panelActions]
  );

  const handleNavigateRepository = useCallback(
    (repository: GitHubRepository) => {
      events.emit(
        createPanelEvent('repository:navigate', {
          owner: repository.owner.login,
          repo: repository.name,
          repository,
        })
      );
      if (panelActions.navigateToRepository) {
        panelActions.navigateToRepository(repository.owner.login, repository.name);
      }
    },
    [events, panelActions]
  );

  const handleRemoveRepository = useCallback(
    async (repository: GitHubRepository) => {
      if (!workspace?.id || !panelActions.removeRepositoryFromWorkspace) return;

      try {
        await panelActions.removeRepositoryFromWorkspace(repository.full_name, workspace.id);
        events.emit(
          createPanelEvent('repository:removed', {
            repositoryKey: repository.full_name,
            workspaceId: workspace.id,
          })
        );
        // Clear selection if removed repo was selected
        if (selectedRepo?.id === repository.id) {
          setSelectedRepo(null);
        }
      } catch (err) {
        console.error('Failed to remove repository from workspace:', err);
      }
    },
    [workspace, panelActions, events, selectedRepo]
  );

  // Subscribe to panel events
  useEffect(() => {
    const unsubscribers = [
      events.on<{ repositoryKey: string }>(`${PANEL_ID}:select-repository`, (event) => {
        const key = event.payload?.repositoryKey;
        if (key) {
          const repository = repositories.find(
            (r) => r.full_name === key || r.name === key
          );
          if (repository) {
            handleSelectRepository(repository);
          }
        }
      }),

      events.on<{ repositoryKey: string }>(`${PANEL_ID}:navigate-repository`, (event) => {
        const key = event.payload?.repositoryKey;
        if (key) {
          const repository = repositories.find(
            (r) => r.full_name === key || r.name === key
          );
          if (repository) {
            handleNavigateRepository(repository);
          }
        }
      }),

      events.on<{ repositoryKey: string }>(`${PANEL_ID}:remove-repository`, (event) => {
        const key = event.payload?.repositoryKey;
        if (key) {
          const repository = repositories.find(
            (r) => r.full_name === key || r.name === key
          );
          if (repository) {
            void handleRemoveRepository(repository);
          }
        }
      }),

      events.on<{ filter: string }>(`${PANEL_ID}:filter`, (event) => {
        setFilter(event.payload?.filter || '');
      }),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [events, repositories, handleSelectRepository, handleNavigateRepository, handleRemoveRepository]);

  const baseContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
  };

  const contentContainerStyle: React.CSSProperties = {
    ...baseContainerStyle,
    padding: '16px',
    gap: '12px',
  };

  // No workspace selected
  if (!workspace) {
    return (
      <div style={baseContainerStyle}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '360px',
            }}
          >
            <Folder
              size={48}
              style={{
                color: theme.colors.textSecondary,
                opacity: 0.5,
              }}
            />
            <div>
              <h3
                style={{
                  margin: '0 0 8px 0',
                  color: theme.colors.text,
                  fontSize: `${theme.fontSizes[3]}px`,
                  fontWeight: theme.fontWeights.semibold,
                  fontFamily: theme.fonts.body,
                }}
              >
                No Workspace Selected
              </h3>
              <p
                style={{
                  margin: 0,
                  color: theme.colors.textSecondary,
                  fontSize: `${theme.fontSizes[1]}px`,
                  fontFamily: theme.fonts.body,
                }}
              >
                Select a workspace to see its repositories.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && repositories.length === 0) {
    return (
      <div style={baseContainerStyle}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Loader2
              size={32}
              style={{ color: theme.colors.textSecondary }}
              className="animate-spin"
            />
            <h3
              style={{
                margin: 0,
                color: theme.colors.text,
                fontSize: `${theme.fontSizes[3]}px`,
                fontWeight: theme.fontWeights.semibold,
                fontFamily: theme.fonts.body,
              }}
            >
              Loading repositories...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={contentContainerStyle}>
      {/* Workspace header */}
      <div>
        <h3
          style={{
            margin: '0 0 4px 0',
            fontSize: `${theme.fontSizes[2]}px`,
            fontWeight: theme.fontWeights.semibold,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}
        >
          {workspace.name}
        </h3>
        {workspace.description && (
          <p
            style={{
              margin: 0,
              fontSize: `${theme.fontSizes[1]}px`,
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            {workspace.description}
          </p>
        )}
      </div>

      {/* Search bar */}
      {repositories.length > 0 && (
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              top: '50%',
              left: '12px',
              transform: 'translateY(-50%)',
              color: theme.colors.textSecondary,
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={filter}
            placeholder="Filter repositories..."
            onChange={(e) => setFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '6px',
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              fontSize: `${theme.fontSizes[1]}px`,
              fontFamily: theme.fonts.body,
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '6px',
            backgroundColor: `${theme.colors.error || '#ef4444'}20`,
            color: theme.colors.error || '#ef4444',
            fontSize: `${theme.fontSizes[1]}px`,
            fontFamily: theme.fonts.body,
          }}
        >
          <span>{error}</span>
        </div>
      )}

      {/* Repository count */}
      <div
        style={{
          fontSize: `${theme.fontSizes[0]}px`,
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {filteredRepositories.length} {filteredRepositories.length === 1 ? 'repository' : 'repositories'}
        {filter && repositories.length !== filteredRepositories.length && (
          <span> (filtered from {repositories.length})</span>
        )}
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {/* Empty state */}
        {repositories.length === 0 && !isLoading && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
            }}
          >
            <Folder
              size={32}
              style={{ marginBottom: '12px', opacity: 0.5 }}
            />
            <p style={{ margin: 0 }}>No repositories in this workspace.</p>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: `${theme.fontSizes[0]}px`,
              }}
            >
              Add repositories to organize your projects.
            </p>
          </div>
        )}

        {/* No filter results */}
        {repositories.length > 0 && filteredRepositories.length === 0 && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
            }}
          >
            <p style={{ margin: 0 }}>No repositories match your filter.</p>
          </div>
        )}

        {/* Repository list */}
        {filteredRepositories.map((repository) => (
          <WorkspaceCollectionRepositoryCard
            key={repository.id}
            repository={repository}
            isSelected={selectedRepo?.id === repository.id}
            onSelect={handleSelectRepository}
            onNavigate={panelActions.navigateToRepository ? handleNavigateRepository : undefined}
            onRemove={panelActions.removeRepositoryFromWorkspace ? handleRemoveRepository : undefined}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * WorkspaceCollectionPanel - Browser-based workspace repository management panel
 *
 * Features:
 * - List all repositories in a workspace
 * - Filter repositories by name/description
 * - Navigate to repository pages
 * - Remove repositories from workspace
 *
 * Data Slices:
 * - workspace: WorkspaceCollectionSlice
 * - workspaceRepositories: WorkspaceRepositoriesSlice
 *
 * Events Emitted:
 * - repository:selected
 * - repository:navigate
 * - repository:removed
 */
export const WorkspaceCollectionPanel: React.FC<PanelComponentProps> = (props) => {
  return <WorkspaceCollectionPanelContent {...props} />;
};

/**
 * Preview component for panel tabs/thumbnails
 */
export const WorkspaceCollectionPanelPreview: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: '12px',
        fontSize: `${theme.fontSizes[0]}px`,
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: theme.fontWeights.semibold,
        }}
      >
        <Folder size={16} style={{ color: theme.colors.primary }} />
        <span>Workspace Collection</span>
      </div>
      <div
        style={{
          fontSize: `${theme.fontSizes[0]}px`,
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          marginTop: '4px',
        }}
      >
        Repositories in your workspace
      </div>
    </div>
  );
};

// Re-export types
export type {
  Workspace,
  WorkspaceCollectionSlice,
  WorkspaceRepositoriesSlice,
  WorkspaceCollectionPanelActions,
  RepositorySelectedPayload,
  RepositoryRemovedPayload,
  RepositoryNavigatePayload,
} from './types';
