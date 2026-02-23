import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { AlertCircle, Loader2, RotateCcw, Search, Star, X } from 'lucide-react';
import type {
  GitHubStarredPanelActions,
  GitHubStarredPanelPropsTyped,
} from './types';
import type {
  GitHubRepository,
  LocalRepositoryReference,
} from '../shared/github-types';
import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library';
import { GitHubRepositoryCard } from '../shared/GitHubRepositoryCard';
import '../shared/styles.css';

const PANEL_ID = 'industry-theme.github-starred';

export interface GitHubStarredPanelProps extends GitHubStarredPanelPropsTyped {
  /** Whether to show the search bar by default */
  defaultShowSearch?: boolean;
}

// Helper to create panel events with required fields
const createPanelEvent = <T,>(type: string, payload: T) => ({
  type,
  source: PANEL_ID,
  timestamp: Date.now(),
  payload,
});

/**
 * GitHubStarredPanel - Browse and manage starred GitHub repositories
 */
export const GitHubStarredPanel: React.FC<GitHubStarredPanelProps> = (
  props
) => {
  return <GitHubStarredPanelContent {...props} />;
};

const GitHubStarredPanelContent: React.FC<GitHubStarredPanelProps> = ({
  context,
  actions,
  events,
  defaultShowSearch = true,
}) => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('');
  const [showSearch, setShowSearch] = useState(defaultShowSearch);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(
    null
  );

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

  // Get data from typed context slices (direct property access)
  const {
    githubStarred: starredSlice,
    alexandriaRepositories: localReposSlice,
    workspace: workspaceSlice,
    workspaceRepositories: workspaceReposSlice,
  } = context;

  const repositories = useMemo(
    () => starredSlice?.data?.repositories || [],
    [starredSlice?.data?.repositories]
  );
  const loading = starredSlice?.loading ?? false;
  const error = starredSlice?.data?.error;

  const localRepos = useMemo(
    () => localReposSlice?.data?.repositories || [],
    [localReposSlice?.data?.repositories]
  );

  // Collection context - used to show "Add to Collection" button
  const currentWorkspace = workspaceSlice?.data?.workspace;
  const collectionName = currentWorkspace?.name;
  const collectionRepos = useMemo(
    () => workspaceReposSlice?.data?.repositories || [],
    [workspaceReposSlice?.data?.repositories]
  );

  // Set of repo full_names already in the collection for quick lookup
  const collectionRepoSet = useMemo(() => {
    return new Set(collectionRepos.map((r: GitHubRepository) => r.full_name));
  }, [collectionRepos]);

  // Cast actions to panel-specific type
  const panelActions = actions as GitHubStarredPanelActions;

  // Create local repo lookup map
  const localRepoMap = useMemo(() => {
    const map = new Map<string, LocalRepositoryReference>();

    localRepos.forEach((entry: AlexandriaEntry) => {
      // Index by GitHub full_name (owner/repo format)
      if (entry.github?.id) {
        map.set(entry.github.id, {
          path: entry.path,
          name: entry.name,
          githubFullName: entry.github.id,
          githubId: entry.github.id,
        });
      }

      // Index by owner/name combination
      if (entry.github?.owner && entry.github?.name) {
        const fullName = `${entry.github.owner}/${entry.github.name}`;
        map.set(fullName, {
          path: entry.path,
          name: entry.name,
          githubFullName: fullName,
        });
      }

      // Index by repository name (fallback)
      map.set(entry.name, {
        path: entry.path,
        name: entry.name,
      });
    });

    return map;
  }, [localRepos]);

  // Filter repositories
  const normalizedFilter = filter.trim().toLowerCase();

  const filteredRepositories = useMemo(() => {
    if (!normalizedFilter) {
      return repositories;
    }

    return repositories.filter((repo) => {
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
  }, [repositories, normalizedFilter]);

  // Sort alphabetically by name
  const sortedRepositories = useMemo(() => {
    return [...filteredRepositories].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  }, [filteredRepositories]);

  // Event handlers
  const handleClone = useCallback(
    async (repo: GitHubRepository) => {
      if (panelActions.cloneRepository) {
        await panelActions.cloneRepository(repo);
        events.emit(
          createPanelEvent(`${PANEL_ID}:repository-cloned`, {
            repository: repo,
          })
        );
      }
    },
    [panelActions, events]
  );

  const handleOpen = useCallback(
    async (localPath: string) => {
      if (panelActions.openRepository) {
        await panelActions.openRepository(localPath);
      }
    },
    [panelActions]
  );

  const handleSelect = useCallback(
    (repo: GitHubRepository) => {
      setSelectedRepo(repo);
      events.emit(
        createPanelEvent(`${PANEL_ID}:repository-selected`, {
          repository: repo,
        })
      );
    },
    [events]
  );

  const handleRefresh = useCallback(async () => {
    if (panelActions.refreshStarred) {
      await panelActions.refreshStarred();
    }
  }, [panelActions]);

  const handleAddToCollection = useCallback(
    async (repo: GitHubRepository) => {
      if (panelActions.addToCollection) {
        await panelActions.addToCollection(repo);
        events.emit(
          createPanelEvent(`${PANEL_ID}:repository-added-to-collection`, {
            repository: repo,
          })
        );
      }
    },
    [panelActions, events]
  );

  // Subscribe to tool events
  useEffect(() => {
    const unsubscribers = [
      events.on<{ filter: string }>(`${PANEL_ID}:filter`, (event) => {
        setFilter(event.payload?.filter || '');
      }),
      events.on<{ identifier: string }>(
        `${PANEL_ID}:select-repository`,
        (event) => {
          const identifier = event.payload?.identifier;
          if (identifier) {
            const repo = repositories.find(
              (r) =>
                r.name === identifier ||
                r.full_name === identifier ||
                r.full_name.toLowerCase() === identifier.toLowerCase()
            );
            if (repo) {
              handleSelect(repo);
            }
          }
        }
      ),
      events.on<{ identifier: string }>(
        `${PANEL_ID}:clone-repository`,
        (event) => {
          const identifier = event.payload?.identifier;
          if (identifier) {
            const repo = repositories.find(
              (r) =>
                r.name === identifier ||
                r.full_name === identifier ||
                r.full_name.toLowerCase() === identifier.toLowerCase()
            );
            if (repo) {
              void handleClone(repo);
            }
          }
        }
      ),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [events, repositories, handleSelect, handleClone]);

  // Base styles
  const baseContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
  };

  // Loading state
  if (loading && repositories.length === 0) {
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
              Loading starred repositories...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && repositories.length === 0) {
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
            <AlertCircle
              size={32}
              style={{ color: theme.colors.error || '#ef4444' }}
            />
            <div>
              <h3
                style={{
                  margin: 0,
                  marginBottom: '8px',
                  color: theme.colors.text,
                  fontSize: `${theme.fontSizes[3]}px`,
                  fontWeight: theme.fontWeights.semibold,
                  fontFamily: theme.fonts.body,
                }}
              >
                Unable to load repositories
              </h3>
              <p
                style={{
                  margin: 0,
                  color: theme.colors.textSecondary,
                  lineHeight: theme.lineHeights.body,
                  fontFamily: theme.fonts.body,
                }}
              >
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                fontWeight: theme.fontWeights.semibold,
                fontSize: `${theme.fontSizes[1]}px`,
                fontFamily: theme.fonts.body,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={baseContainerStyle}>
      {/* Header */}
      <div
        style={{
          position: 'relative',
          height: '40px',
          minHeight: '40px',
          padding: '0',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          backgroundColor: theme.colors.background,
        }}
      >
        {/* Permanent search mode (when defaultShowSearch is true) */}
        {defaultShowSearch && showSearch ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0',
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
                placeholder="Filter starred repositories..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '0 32px',
                  height: '40px',
                  fontSize: `${theme.fontSizes[1]}px`,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background,
                  border: 'none',
                  borderRadius: '0',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <Star size={18} style={{ color: '#f59e0b' }} />
                <span
                  style={{
                    fontSize: `${theme.fontSizes[2]}px`,
                    fontWeight: theme.fontWeights.medium,
                    color: theme.colors.text,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  Starred
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                {/* Search toggle button */}
                <button
                  className={`header-button ${showSearch ? 'active' : ''}`}
                  onClick={handleToggleSearch}
                  style={{
                    background: showSearch
                      ? theme.colors.backgroundSecondary
                      : 'none',
                    border: 'none',
                    borderRadius: '0',
                    cursor: 'pointer',
                    padding: '0 12px',
                    height: '40px',
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
              </div>
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
                  padding: '0',
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
                    placeholder="Filter starred repositories..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '0 32px',
                      height: '40px',
                      fontSize: `${theme.fontSizes[1]}px`,
                      color: theme.colors.text,
                      backgroundColor: theme.colors.background,
                      border: 'none',
                      borderRadius: '0',
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
                    padding: '0 12px',
                    height: '40px',
                    marginLeft: '0',
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

      {/* Error banner (when we have data but also an error) */}
      {error && repositories.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            margin: '0 16px',
            borderRadius: '6px',
            backgroundColor: `${theme.colors.error || '#ef4444'}20`,
            color: theme.colors.error || '#ef4444',
            fontSize: `${theme.fontSizes[1]}px`,
            fontFamily: theme.fonts.body,
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Repository list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '8px',
        }}
      >
        {sortedRepositories.map((repo) => (
          <GitHubRepositoryCard
            key={repo.id}
            repository={repo}
            localRepo={localRepoMap.get(repo.full_name)}
            onClone={panelActions.cloneRepository ? handleClone : undefined}
            onOpen={handleOpen}
            onSelect={handleSelect}
            isSelected={selectedRepo?.id === repo.id}
            isInCollection={collectionRepoSet.has(repo.full_name)}
            collectionName={collectionName}
          />
        ))}

        {/* Empty state */}
        {sortedRepositories.length === 0 && repositories.length > 0 && (
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

        {/* No starred repos */}
        {repositories.length === 0 && !loading && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
            }}
          >
            <Star size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ margin: 0 }}>
              You haven&apos;t starred any repositories yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Preview component for panel tabs/thumbnails
 */
export const GitHubStarredPanelPreview: React.FC = () => {
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
        <Star size={16} style={{ color: '#f59e0b' }} />
        <span>Starred Repositories</span>
      </div>
      <div
        style={{
          fontSize: `${theme.fontSizes[0]}px`,
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          marginTop: '4px',
        }}
      >
        Browse your starred GitHub repositories
      </div>
    </div>
  );
};

export { GitHubRepositoryCard } from '../shared/GitHubRepositoryCard';
