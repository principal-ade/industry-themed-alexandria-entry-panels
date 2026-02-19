import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Folder, Loader2, Search, Trash2, X } from 'lucide-react';
import type { GitHubRepository } from '../shared/github-types';
import type {
  WorkspaceCollectionSlice,
  WorkspaceRepositoriesSlice,
  WorkspaceCollectionPanelActions,
  WorkspaceCollectionPanelPropsTyped,
} from './types';
import { RepositoryAvatar } from '../LocalProjectsPanel/RepositoryAvatar';
import '../shared/styles.css';

type SortField = 'name' | 'updated';

export interface WorkspaceCollectionPanelProps extends WorkspaceCollectionPanelPropsTyped {
  selectedRepository?: string; // full_name like "owner/repo"
  /** Whether to show the search bar by default */
  defaultShowSearch?: boolean;
}

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

const WorkspaceCollectionRepositoryCard: React.FC<
  WorkspaceCollectionRepositoryCardProps
> = ({ repository, isSelected = false, onSelect, onNavigate, onRemove }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(repository);
    }
  }, [onSelect, repository]);

  const handleDoubleClick = useCallback(() => {
    if (onNavigate) {
      onNavigate(repository);
    }
  }, [onNavigate, repository]);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onRemove) {
        onRemove(repository);
      }
    },
    [onRemove, repository]
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
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: isSelected
          ? `${theme.colors.primary}15`
          : isHovered
            ? theme.colors.backgroundTertiary
            : 'transparent',
        borderLeft: `2px solid ${isSelected ? theme.colors.primary : 'transparent'}`,
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'background-color 0.15s, border-color 0.15s',
      }}
    >
      {/* Avatar - show original owner for forks */}
      <RepositoryAvatar
        owner={
          repository.fork && repository.parent
            ? repository.parent.owner.login
            : repository.owner.login
        }
        customAvatarUrl={
          repository.fork && repository.parent
            ? repository.parent.owner.avatar_url
            : repository.owner.avatar_url
        }
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

        {/* Owner - show "forked by" for forks */}
        <div
          style={{
            fontSize: `${theme.fontSizes[0]}px`,
            fontFamily: theme.fonts.body,
            color: theme.colors.textSecondary,
            marginBottom: '4px',
          }}
        >
          {repository.fork && repository.parent ? (
            <>
              {repository.parent.owner.login}
              <span style={{ opacity: 0.7 }}> · forked by </span>
              {repository.owner.login}
            </>
          ) : (
            repository.owner.login
          )}
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
          <span>
            Updated{' '}
            {getRelativeTime(repository.pushed_at || repository.updated_at)}
          </span>
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
              e.currentTarget.style.borderColor =
                theme.colors.error || '#ef4444';
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
const WorkspaceCollectionPanelContent: React.FC<
  WorkspaceCollectionPanelProps
> = ({
  context,
  actions,
  events,
  selectedRepository,
  defaultShowSearch = false,
}) => {
  const { theme } = useTheme();
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(
    null
  );
  const [sortField, setSortField] = useState<SortField>('name');
  const [filter, setFilter] = useState('');
  const [showSearch, setShowSearch] = useState(defaultShowSearch);

  // Toggle search and clear filter when closing
  const handleToggleSearch = useCallback(() => {
    // Don't allow toggling off if defaultShowSearch is true
    if (defaultShowSearch) return;

    setShowSearch((prev) => {
      if (prev) {
        setFilter('');
      }
      return !prev;
    });
  }, [defaultShowSearch]);

  const handleClearFilter = useCallback(() => {
    setFilter('');
  }, []);

  // Get extended actions
  const panelActions = actions as WorkspaceCollectionPanelActions;

  // Get data from typed context slices (direct property access)
  const {
    workspace: workspaceSlice,
    workspaceRepositories: repositoriesSlice,
  } = context;

  const workspace = workspaceSlice?.data?.workspace ?? null;
  const repositories = repositoriesSlice?.data?.repositories ?? [];
  const isLoading =
    workspaceSlice?.loading || repositoriesSlice?.loading || false;
  const error = workspaceSlice?.data?.error || repositoriesSlice?.data?.error;

  // Sync selectedRepository prop with internal state
  useEffect(() => {
    if (selectedRepository && repositories.length > 0) {
      const repo = repositories.find((r) => r.full_name === selectedRepository);
      if (repo) {
        setSelectedRepo(repo);
      }
    }
  }, [selectedRepository, repositories]);

  // Listen for repository:selected events to sync selection
  useEffect(() => {
    const unsubscribe = events.on('repository:selected', (event) => {
      const payload = event.payload as {
        repository?: { id?: number; full_name?: string };
      };
      if (payload?.repository?.full_name && repositories.length > 0) {
        const repo = repositories.find(
          (r) => r.full_name === payload.repository?.full_name
        );
        if (repo) {
          setSelectedRepo(repo);
        }
      }
    });

    return () => unsubscribe();
  }, [events, repositories]);

  // Toggle sort between name and updated
  const toggleSort = () => {
    setSortField(sortField === 'name' ? 'updated' : 'name');
  };

  // Filter and sort repositories
  const normalizedFilter = filter.trim().toLowerCase();

  const filteredAndSortedRepositories = useMemo(() => {
    // Filter repositories by search term
    let filtered = repositories;
    if (normalizedFilter) {
      filtered = repositories.filter((repo) => {
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

    // Sort repositories
    return [...filtered].sort((a, b) => {
      if (sortField === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Sort by updated (most recent first)
        const aTime = new Date(a.pushed_at || a.updated_at || 0).getTime();
        const bTime = new Date(b.pushed_at || b.updated_at || 0).getTime();
        return bTime - aTime;
      }
    });
  }, [repositories, sortField, normalizedFilter]);

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
        panelActions.navigateToRepository(
          repository.owner.login,
          repository.name
        );
      }
    },
    [events, panelActions]
  );

  const handleRemoveRepository = useCallback(
    async (repository: GitHubRepository) => {
      if (!workspace?.id || !panelActions.removeRepositoryFromWorkspace) return;

      try {
        await panelActions.removeRepositoryFromWorkspace(
          repository.full_name,
          workspace.id
        );
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
      events.on<{ repositoryKey: string }>(
        `${PANEL_ID}:select-repository`,
        (event) => {
          const key = event.payload?.repositoryKey;
          if (key) {
            const repository = repositories.find(
              (r) => r.full_name === key || r.name === key
            );
            if (repository) {
              handleSelectRepository(repository);
            }
          }
        }
      ),

      events.on<{ repositoryKey: string }>(
        `${PANEL_ID}:navigate-repository`,
        (event) => {
          const key = event.payload?.repositoryKey;
          if (key) {
            const repository = repositories.find(
              (r) => r.full_name === key || r.name === key
            );
            if (repository) {
              handleNavigateRepository(repository);
            }
          }
        }
      ),

      events.on<{ repositoryKey: string }>(
        `${PANEL_ID}:remove-repository`,
        (event) => {
          const key = event.payload?.repositoryKey;
          if (key) {
            const repository = repositories.find(
              (r) => r.full_name === key || r.name === key
            );
            if (repository) {
              void handleRemoveRepository(repository);
            }
          }
        }
      ),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [
    events,
    repositories,
    handleSelectRepository,
    handleNavigateRepository,
    handleRemoveRepository,
  ]);

  const baseContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
  };

  const contentContainerStyle: React.CSSProperties = {
    ...baseContainerStyle,
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
      {/* Header with repository count and sort toggle */}
      <div
        style={{
          position: 'relative',
          height: '40px',
          minHeight: '40px',
          padding: defaultShowSearch && showSearch ? '0 16px 0 8px' : '0 16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Permanent search mode (when defaultShowSearch is true) */}
        {defaultShowSearch && showSearch && repositories.length > 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            {/* Search input */}
            <div
              style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={16}
                color={theme.colors.textSecondary}
                style={{
                  position: 'absolute',
                  left: '10px',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                className="search-input"
                placeholder="Filter repositories..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '6px 32px 6px 32px',
                  fontSize: `${theme.fontSizes[1]}px`,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '4px',
                  outline: 'none',
                  fontFamily: theme.fonts.body,
                  transition: 'border-color 0.2s ease',
                  ['--theme-primary' as string]: theme.colors.primary,
                }}
              />
              {filter && (
                <button
                  className="clear-filter-button"
                  onClick={handleClearFilter}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.textSecondary,
                    ['--theme-text' as string]: theme.colors.text,
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Sort toggle button */}
              <button
                onClick={toggleSort}
                style={{
                  padding: '4px 10px',
                  height: '30px',
                  borderRadius: '4px',
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  fontSize: `${theme.fontSizes[1]}px`,
                  fontFamily: theme.fonts.body,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {sortField === 'name' ? 'A-Z' : 'Recent'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Normal mode */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                visibility: showSearch ? 'hidden' : 'visible',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Folder size={18} color={theme.colors.primary} />
                <span
                  style={{
                    fontSize: `${theme.fontSizes[2]}px`,
                    fontWeight: theme.fontWeights.medium,
                    color: theme.colors.text,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  Repositories
                </span>
                {repositories.length > 0 && (
                  <span
                    style={{
                      fontSize: `${theme.fontSizes[1]}px`,
                      color: theme.colors.textSecondary,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: theme.colors.background,
                    }}
                  >
                    {repositories.length}
                  </span>
                )}
              </div>

              {repositories.length > 0 && (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {/* Search toggle button */}
                  <button
                    className={`header-button ${showSearch ? 'active' : ''}`}
                    onClick={handleToggleSearch}
                    style={{
                      background: showSearch
                        ? theme.colors.backgroundSecondary
                        : 'none',
                      border: `1px solid ${showSearch ? theme.colors.border : 'transparent'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: showSearch
                        ? theme.colors.primary
                        : theme.colors.textSecondary,
                      ['--theme-text' as string]: theme.colors.text,
                    }}
                    title={showSearch ? 'Close search' : 'Search repositories'}
                  >
                    <Search size={16} />
                  </button>

                  {/* Sort toggle button */}
                  <button
                    onClick={toggleSort}
                    style={{
                      padding: '4px 10px',
                      height: '30px',
                      borderRadius: '4px',
                      border: `1px solid ${theme.colors.border}`,
                      background: theme.colors.backgroundSecondary,
                      color: theme.colors.text,
                      fontSize: `${theme.fontSizes[1]}px`,
                      fontFamily: theme.fonts.body,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {sortField === 'name' ? 'A-Z' : 'Recent'}
                  </button>
                </div>
              )}
            </div>

            {/* Search overlay (for normal toggleable search) */}
            {showSearch && !defaultShowSearch && (
              <div
                className="search-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  backgroundColor: theme.colors.backgroundSecondary,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Search
                    size={16}
                    color={theme.colors.textSecondary}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Filter repositories..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '6px 32px 6px 32px',
                      fontSize: `${theme.fontSizes[1]}px`,
                      color: theme.colors.text,
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '4px',
                      outline: 'none',
                      fontFamily: theme.fonts.body,
                      transition: 'border-color 0.2s ease',
                      ['--theme-primary' as string]: theme.colors.primary,
                    }}
                  />
                  {filter && (
                    <button
                      className="clear-filter-button"
                      onClick={handleClearFilter}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.colors.textSecondary,
                        ['--theme-text' as string]: theme.colors.text,
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleToggleSearch}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    marginLeft: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.textSecondary,
                  }}
                  title="Close search"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            margin: '8px 16px',
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

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
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
            <Folder size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
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
        {filteredAndSortedRepositories.length === 0 &&
          repositories.length > 0 && (
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
        {filteredAndSortedRepositories.map((repository) => (
          <WorkspaceCollectionRepositoryCard
            key={repository.id}
            repository={repository}
            isSelected={selectedRepo?.id === repository.id}
            onSelect={handleSelectRepository}
            onNavigate={
              panelActions.navigateToRepository
                ? handleNavigateRepository
                : undefined
            }
            onRemove={
              panelActions.removeRepositoryFromWorkspace
                ? handleRemoveRepository
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

/**
 * WorkspaceCollectionPanel - Browser-based workspace repository management panel
 *
 * Props:
 * - selectedRepository: Full name of the selected repo (e.g., "owner/repo")
 *
 * Features:
 * - List all repositories in a workspace
 * - Toggle between name (A-Z) and recently updated sorting
 * - Syncs selection with selectedRepository prop and repository:selected events
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
export const WorkspaceCollectionPanel: React.FC<
  WorkspaceCollectionPanelProps
> = (props) => {
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
