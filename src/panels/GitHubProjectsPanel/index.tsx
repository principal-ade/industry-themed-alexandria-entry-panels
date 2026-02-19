import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import {
  AlertCircle,
  Building2,
  ChevronDown,
  ChevronRight,
  FolderGit2,
  Loader2,
  RotateCcw,
  Search,
  User,
  X,
} from 'lucide-react';
import type {
  GitHubProjectsSlice,
  GitHubProjectsPanelActions,
  GitHubProjectsPanelPropsTyped,
} from './types';
import type {
  GitHubRepository,
  LocalRepositoryReference,
} from '../shared/github-types';
import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library';
import { GitHubRepositoryCard } from '../shared/GitHubRepositoryCard';
import '../shared/styles.css';

const PANEL_ID = 'industry-theme.github-projects';

export interface GitHubProjectsPanelProps extends GitHubProjectsPanelPropsTyped {
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
 * GitHubProjectsPanel - Browse user's repositories and organization repositories
 */
export const GitHubProjectsPanel: React.FC<GitHubProjectsPanelProps> = (
  props
) => {
  return <GitHubProjectsPanelContent {...props} />;
};

const GitHubProjectsPanelContent: React.FC<GitHubProjectsPanelProps> = ({
  context,
  actions,
  events,
  defaultShowSearch = false,
}) => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('');
  const [showSearch, setShowSearch] = useState(defaultShowSearch);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(
    null
  );

  // Toggle search and clear filter when closing
  const handleToggleSearch = useCallback(() => {
    setShowSearch((prev) => {
      if (prev) {
        setFilter('');
      }
      return !prev;
    });
  }, []);

  const handleClearFilter = useCallback(() => {
    setFilter('');
  }, []);

  // Get data from typed context slices (direct property access)
  const {
    githubProjects: projectsSlice,
    alexandriaRepositories: localReposSlice,
    workspace: workspaceSlice,
    workspaceRepositories: workspaceReposSlice,
  } = context;

  const userRepositories = useMemo(
    () => projectsSlice?.data?.userRepositories || [],
    [projectsSlice?.data?.userRepositories]
  );
  const organizations = useMemo(
    () => projectsSlice?.data?.organizations || [],
    [projectsSlice?.data?.organizations]
  );
  const orgRepositories = useMemo(
    () => projectsSlice?.data?.orgRepositories || {},
    [projectsSlice?.data?.orgRepositories]
  );
  const currentUser = projectsSlice?.data?.currentUser;
  const loading = projectsSlice?.loading ?? false;
  const error = projectsSlice?.data?.error;

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
  const panelActions = actions as GitHubProjectsPanelActions;

  // Create local repo lookup map
  const localRepoMap = useMemo(() => {
    const map = new Map<string, LocalRepositoryReference>();

    localRepos.forEach((entry: AlexandriaEntry) => {
      if (entry.github?.id) {
        map.set(entry.github.id, {
          path: entry.path,
          name: entry.name,
          githubFullName: entry.github.id,
          githubId: entry.github.id,
        });
      }

      if (entry.github?.owner && entry.github?.name) {
        const fullName = `${entry.github.owner}/${entry.github.name}`;
        map.set(fullName, {
          path: entry.path,
          name: entry.name,
          githubFullName: fullName,
        });
      }

      map.set(entry.name, {
        path: entry.path,
        name: entry.name,
      });
    });

    return map;
  }, [localRepos]);

  // Filter repositories
  const normalizedFilter = filter.trim().toLowerCase();

  const filterRepos = useCallback(
    (repos: GitHubRepository[]) => {
      if (!normalizedFilter) return repos;

      return repos.filter((repo) => {
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
    },
    [normalizedFilter]
  );

  const filteredUserRepos = useMemo(
    () => filterRepos(userRepositories),
    [filterRepos, userRepositories]
  );

  const filteredOrgRepos = useMemo(() => {
    const result: Record<string, GitHubRepository[]> = {};
    for (const [orgLogin, repos] of Object.entries(orgRepositories)) {
      if (!Array.isArray(repos)) continue;
      const filtered = filterRepos(repos);
      if (filtered.length > 0) {
        result[orgLogin] = filtered;
      }
    }
    return result;
  }, [filterRepos, orgRepositories]);

  // Get all repositories for tool lookups
  const allRepositories = useMemo(() => {
    const all = [...userRepositories];
    for (const repos of Object.values(orgRepositories)) {
      if (Array.isArray(repos)) {
        all.push(...repos);
      }
    }
    return all;
  }, [userRepositories, orgRepositories]);

  // Has any data
  const hasData =
    userRepositories.length > 0 ||
    organizations.length > 0 ||
    Object.keys(orgRepositories).length > 0;

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
    if (panelActions.refreshProjects) {
      await panelActions.refreshProjects();
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

  const toggleSection = useCallback((owner: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(owner)) {
        next.delete(owner);
      } else {
        next.add(owner);
      }
      return next;
    });
  }, []);

  // Subscribe to tool events
  useEffect(() => {
    const unsubscribers = [
      events.on<{ filter: string }>(`${PANEL_ID}:filter`, (event) => {
        setFilter(event.payload?.filter || '');
      }),
      events.on<{ owner: string }>(`${PANEL_ID}:toggle-section`, (event) => {
        const owner = event.payload?.owner;
        if (owner) {
          toggleSection(owner);
        }
      }),
      events.on<{ identifier: string }>(
        `${PANEL_ID}:select-repository`,
        (event) => {
          const identifier = event.payload?.identifier;
          if (identifier) {
            const repo = allRepositories.find(
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
            const repo = allRepositories.find(
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
  }, [events, allRepositories, toggleSection, handleSelect, handleClone]);

  // Base styles
  const baseContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
  };

  // Loading state
  if (loading && !hasData) {
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
              Loading your repositories...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !hasData) {
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

  // Render section header
  const renderSectionHeader = (
    owner: string,
    repoCount: number,
    icon: React.ReactNode,
    isOrg: boolean = false
  ) => {
    const isCollapsed = collapsedSections.has(owner);

    return (
      <button
        type="button"
        onClick={() => toggleSection(owner)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          backgroundColor: theme.colors.background,
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          textAlign: 'left',
          marginBottom: isCollapsed ? '0' : '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            theme.colors.backgroundTertiary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.background;
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isCollapsed ? (
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          ) : (
            <ChevronDown size={16} color={theme.colors.textSecondary} />
          )}
          {icon}
          <span
            style={{
              fontSize: `${theme.fontSizes[2]}px`,
              fontWeight: theme.fontWeights.semibold,
              fontFamily: theme.fonts.body,
              color: theme.colors.text,
            }}
          >
            {owner}
          </span>
          {isOrg && (
            <span
              style={{
                fontSize: `${theme.fontSizes[0]}px`,
                fontFamily: theme.fonts.body,
                color: theme.colors.textSecondary,
                backgroundColor: theme.colors.backgroundSecondary,
                padding: '2px 6px',
                borderRadius: '3px',
              }}
            >
              org
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: `${theme.fontSizes[0]}px`,
            fontFamily: theme.fonts.body,
            color: theme.colors.textSecondary,
          }}
        >
          {repoCount} {repoCount === 1 ? 'repo' : 'repos'}
        </span>
      </button>
    );
  };

  return (
    <div style={baseContainerStyle}>
      {/* Header */}
      <div
        style={{
          position: 'relative',
          height: '40px',
          minHeight: '40px',
          padding: '0 16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            visibility: showSearch ? 'hidden' : 'visible',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderGit2 size={18} color={theme.colors.primary} />
            <span
              style={{
                fontSize: `${theme.fontSizes[2]}px`,
                fontWeight: theme.fontWeights.medium,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
            >
              GitHub Projects
            </span>
          </div>

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
              padding: '4px',
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

        {/* Search overlay */}
        {showSearch && (
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
      </div>

      {/* Error banner */}
      {error && hasData && (
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

      {/* Repository sections */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '8px',
        }}
      >
        {/* User's repositories */}
        {filteredUserRepos.length > 0 && (
          <div>
            {renderSectionHeader(
              currentUser || 'Your Repositories',
              filteredUserRepos.length,
              <User size={16} color={theme.colors.textSecondary} />
            )}
            {!collapsedSections.has(currentUser || 'Your Repositories') && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                {filteredUserRepos
                  .sort((a, b) =>
                    a.name.localeCompare(b.name, undefined, {
                      sensitivity: 'base',
                    })
                  )
                  .map((repo) => (
                    <GitHubRepositoryCard
                      key={repo.id}
                      repository={repo}
                      localRepo={localRepoMap.get(repo.full_name)}
                      onClone={
                        panelActions.cloneRepository ? handleClone : undefined
                      }
                      onOpen={handleOpen}
                      onSelect={handleSelect}
                      isSelected={selectedRepo?.id === repo.id}
                      onAddToCollection={
                        currentWorkspace ? handleAddToCollection : undefined
                      }
                      isInCollection={collectionRepoSet.has(repo.full_name)}
                      collectionName={collectionName}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Organization repositories */}
        {organizations.map((org) => {
          const repos = filteredOrgRepos[org.login];
          if (!repos || repos.length === 0) return null;

          return (
            <div key={org.id}>
              {renderSectionHeader(
                org.login,
                repos.length,
                <Building2 size={16} color={theme.colors.textSecondary} />,
                true
              )}
              {!collapsedSections.has(org.login) && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {repos
                    .sort((a, b) =>
                      a.name.localeCompare(b.name, undefined, {
                        sensitivity: 'base',
                      })
                    )
                    .map((repo) => (
                      <GitHubRepositoryCard
                        key={repo.id}
                        repository={repo}
                        localRepo={localRepoMap.get(repo.full_name)}
                        onClone={
                          panelActions.cloneRepository ? handleClone : undefined
                        }
                        onOpen={handleOpen}
                        onSelect={handleSelect}
                        isSelected={selectedRepo?.id === repo.id}
                        onAddToCollection={
                          currentWorkspace ? handleAddToCollection : undefined
                        }
                        isInCollection={collectionRepoSet.has(repo.full_name)}
                        collectionName={collectionName}
                      />
                    ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state after filtering */}
        {filteredUserRepos.length === 0 &&
          Object.keys(filteredOrgRepos).length === 0 &&
          hasData && (
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

        {/* No repos at all */}
        {!hasData && !loading && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
            }}
          >
            <FolderGit2
              size={32}
              style={{ marginBottom: '12px', opacity: 0.5 }}
            />
            <p style={{ margin: 0 }}>No repositories found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Preview component for panel tabs/thumbnails
 */
export const GitHubProjectsPanelPreview: React.FC = () => {
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
        <FolderGit2 size={16} style={{ color: theme.colors.primary }} />
        <span>GitHub Projects</span>
      </div>
      <div
        style={{
          fontSize: `${theme.fontSizes[0]}px`,
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          marginTop: '4px',
        }}
      >
        Your repositories and organization projects
      </div>
    </div>
  );
};
