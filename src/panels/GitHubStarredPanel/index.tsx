import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { AlertCircle, Loader2, RotateCcw, Search, Star } from 'lucide-react';
import type { PanelComponentProps } from '../../types';
import type { AlexandriaRepositoriesSlice } from '../LocalProjectsPanel/types';
import type { GitHubStarredSlice, GitHubStarredPanelActions } from './types';
import type { GitHubRepository, LocalRepositoryReference } from '../shared/github-types';
import { GitHubRepositoryCard } from '../shared/GitHubRepositoryCard';

const PANEL_ID = 'industry-theme.github-starred';

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
export const GitHubStarredPanel: React.FC<PanelComponentProps> = (props) => {
  return <GitHubStarredPanelContent {...props} />;
};

const GitHubStarredPanelContent: React.FC<PanelComponentProps> = ({
  context,
  actions,
  events,
}) => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);

  // Get data from slices
  const starredSlice = context.getSlice<GitHubStarredSlice>('githubStarred');
  const localReposSlice = context.getSlice<AlexandriaRepositoriesSlice>('alexandriaRepositories');

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

  // Cast actions to panel-specific type
  const panelActions = actions as GitHubStarredPanelActions;

  // Create local repo lookup map
  const localRepoMap = useMemo(() => {
    const map = new Map<string, LocalRepositoryReference>();

    localRepos.forEach((entry) => {
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
        createPanelEvent(`${PANEL_ID}:repository-selected`, { repository: repo })
      );
    },
    [events]
  );

  const handleRefresh = useCallback(async () => {
    if (panelActions.refreshStarred) {
      await panelActions.refreshStarred();
    }
  }, [panelActions]);

  // Subscribe to tool events
  useEffect(() => {
    const unsubscribers = [
      events.on<{ filter: string }>(`${PANEL_ID}:filter`, (event) => {
        setFilter(event.payload?.filter || '');
      }),
      events.on<{ identifier: string }>(`${PANEL_ID}:select-repository`, (event) => {
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
      }),
      events.on<{ identifier: string }>(`${PANEL_ID}:clone-repository`, (event) => {
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
      }),
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
    <div
      style={{
        ...baseContainerStyle,
        padding: '16px',
        gap: '12px',
      }}
    >
      {/* Search bar */}
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
          placeholder="Filter starred repositories..."
          onChange={(event) => setFilter(event.target.value)}
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

      {/* Error banner (when we have data but also an error) */}
      {error && repositories.length > 0 && (
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
        }}
      >
        {sortedRepositories.map((repo) => (
          <GitHubRepositoryCard
            key={repo.id}
            repository={repo}
            localRepo={localRepoMap.get(repo.full_name)}
            onClone={handleClone}
            onOpen={handleOpen}
            onSelect={handleSelect}
            isSelected={selectedRepo?.id === repo.id}
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
            <Star
              size={32}
              style={{ marginBottom: '12px', opacity: 0.5 }}
            />
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
