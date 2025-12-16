import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Search, Plus, Building2, FolderGit2 } from 'lucide-react';
import './LocalProjectsPanel.css';
import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library/types';
import type { PanelComponentProps } from '../../types';
import { LocalProjectCard } from './LocalProjectCard';
import type {
  AlexandriaRepositoriesSlice,
  LocalProjectsPanelActions,
  RepositoryWindowState,
} from './types';

// Panel event prefix
const PANEL_ID = 'industry-theme.local-projects';

// Helper to create panel events with required fields
const createPanelEvent = <T,>(type: string, payload: T) => ({
  type,
  source: PANEL_ID,
  timestamp: Date.now(),
  payload,
});

/**
 * LocalProjectsPanelContent - Internal component that uses theme
 */
const LocalProjectsPanelContent: React.FC<PanelComponentProps> = ({
  context,
  actions,
  events,
}) => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AlexandriaEntry | null>(null);
  const [windowStates, setWindowStates] = useState<Map<string, RepositoryWindowState>>(new Map());
  const [sortByOrg, setSortByOrg] = useState(false);

  // Get extended actions (type assertion for panel-specific actions)
  const panelActions = actions as LocalProjectsPanelActions;

  // Get repositories from context slice
  const repoSlice = context.getSlice<AlexandriaRepositoriesSlice>('alexandriaRepositories');
  const repositories = useMemo(
    () => repoSlice?.data?.repositories || [],
    [repoSlice?.data?.repositories]
  );
  const loading = repoSlice?.loading ?? false;

  // Handle open repository
  const handleOpenRepository = useCallback(
    async (entry: AlexandriaEntry) => {
      if (!panelActions.openRepository) {
        console.warn('Open repository action not available');
        return;
      }

      // Update window state to opening
      setWindowStates((prev) => new Map(prev).set(entry.path, 'opening'));

      try {
        await panelActions.openRepository(entry);

        // Update window state to ready
        setWindowStates((prev) => new Map(prev).set(entry.path, 'ready'));

        // Emit event
        events.emit(createPanelEvent(`${PANEL_ID}:repository-opened`, { entry }));
      } catch (error) {
        console.error('Error opening repository:', error);
        setWindowStates((prev) => new Map(prev).set(entry.path, 'closed'));
      }
    },
    [panelActions, events]
  );

  // Subscribe to panel events
  useEffect(() => {
    const unsubscribers = [
      // Filter event from tools
      events.on<{ filter: string }>(`${PANEL_ID}:filter`, (event) => {
        if (event.payload?.filter !== undefined) {
          setFilter(event.payload.filter);
        }
      }),

      // Select repository event from tools
      events.on<{ identifier: string }>(`${PANEL_ID}:select-repository`, (event) => {
        const identifier = event.payload?.identifier;
        if (identifier) {
          const entry = repositories.find(
            (r) => r.name === identifier || r.path === identifier
          );
          if (entry) {
            setSelectedEntry(entry);
            events.emit(createPanelEvent(`${PANEL_ID}:repository-selected`, { entry }));
          }
        }
      }),

      // Open repository event from tools
      events.on<{ identifier: string }>(`${PANEL_ID}:open-repository`, (event) => {
        const identifier = event.payload?.identifier;
        if (identifier) {
          const entry = repositories.find(
            (r) => r.name === identifier || r.path === identifier
          );
          if (entry) {
            handleOpenRepository(entry);
          }
        }
      }),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [events, repositories, handleOpenRepository]);

  // Handle add project
  const handleAddProject = async () => {
    if (!panelActions.selectDirectory || !panelActions.registerRepository) {
      console.warn('Add project actions not available');
      return;
    }

    try {
      setIsAdding(true);
      const result = await panelActions.selectDirectory();

      if (!result) {
        return;
      }

      await panelActions.registerRepository(result.name, result.path);

      // Refresh the repositories
      await context.refresh('repository', 'alexandriaRepositories');
    } catch (error) {
      console.error('Failed to add project:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Handle remove repository
  const handleRemoveRepository = async (entry: AlexandriaEntry) => {
    if (!panelActions.removeRepository) {
      console.warn('Remove repository action not available');
      return;
    }

    try {
      await panelActions.removeRepository(entry.name, false);
      await context.refresh('repository', 'alexandriaRepositories');
    } catch (error) {
      console.error('Failed to remove repository:', error);
    }
  };

  // Handle select repository
  const handleSelectRepository = (entry: AlexandriaEntry) => {
    setSelectedEntry(entry);
    events.emit(createPanelEvent(`${PANEL_ID}:repository-selected`, { entry }));
  };

  // Filter and sort repositories
  const normalizedFilter = filter.trim().toLowerCase();

  const filteredAndSortedRepositories = useMemo(() => {
    // Filter repositories by search term
    const filtered = repositories.filter((entry) => {
      if (!normalizedFilter) return true;

      const haystack = [
        entry.name,
        entry.github?.name ?? '',
        entry.github?.owner ?? '',
        entry.remoteUrl ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedFilter);
    });

    // Sort alphabetically
    return filtered.sort((a, b) => {
      if (sortByOrg) {
        // Sort by org/owner first, then by repo name
        const aOrg = (a.github?.owner ?? '').toLowerCase();
        const bOrg = (b.github?.owner ?? '').toLowerCase();
        const orgCompare = aOrg.localeCompare(bOrg);
        if (orgCompare !== 0) return orgCompare;
      }
      // Sort by repo name
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }, [repositories, normalizedFilter, sortByOrg]);

  const baseContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
  };

  const contentContainerStyle: React.CSSProperties = {
    ...baseContainerStyle,
  };

  // Loading state
  if (loading) {
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
            <h3
              style={{
                margin: 0,
                color: theme.colors.text,
                fontSize: `${theme.fontSizes[3]}px`,
                fontWeight: theme.fontWeights.semibold,
                fontFamily: theme.fonts.body,
              }}
            >
              Loading local projects...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="local-projects-panel" style={contentContainerStyle}>
      {/* Header */}
      <div
        style={{
          height: '40px',
          minHeight: '40px',
          padding: '0 16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <FolderGit2 size={18} style={{ color: theme.colors.success || '#10b981' }} />
        <span
          style={{
            fontSize: `${theme.fontSizes[2]}px`,
            fontWeight: theme.fontWeights.medium,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}
        >
          Local Projects
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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSortByOrg(!sortByOrg)}
            title={sortByOrg ? 'Sorting by organization' : 'Sorting by repo name'}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: sortByOrg ? `${theme.colors.primary}20` : theme.colors.background,
              color: sortByOrg ? theme.colors.primary : theme.colors.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {sortByOrg ? <Building2 size={16} /> : <FolderGit2 size={16} />}
          </button>
          {panelActions.selectDirectory && (
            <button
              onClick={handleAddProject}
              disabled={isAdding}
              title="Add existing project"
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                cursor: isAdding ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isAdding ? 0.6 : 1,
                transition: 'opacity 0.2s',
                flexShrink: 0,
              }}
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: '8px 16px' }}>
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
              zIndex: 1,
            }}
          />
          <input
            type="text"
            value={filter}
            placeholder="Filter local projects..."
            onChange={(event) => setFilter(event.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
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
      </div>

      {/* Scrollable content */}
      <div
        className="local-projects-list"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '8px',
        }}
      >
        {/* Repository list */}
        {filteredAndSortedRepositories.map((entry) => (
          <LocalProjectCard
            key={entry.path}
            entry={entry}
            isSelected={selectedEntry?.path === entry.path}
            onSelect={handleSelectRepository}
            onOpen={handleOpenRepository}
            onRemove={handleRemoveRepository}
            windowState={windowStates.get(entry.path) || 'closed'}
          />
        ))}

        {/* No results message */}
        {filteredAndSortedRepositories.length === 0 && !loading && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
            }}
          >
            <p style={{ margin: 0 }}>
              {normalizedFilter
                ? 'No local projects match your filter.'
                : 'No local projects found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * LocalProjectsPanel - Browse and manage local Alexandria repositories
 *
 * Features:
 * - List all registered local repositories
 * - Search/filter by name, owner, or path
 * - Add new projects via directory picker
 * - Open projects in dev workspace
 * - Remove projects from registry
 *
 * Data Slices:
 * - alexandriaRepositories: List of AlexandriaEntry objects
 *
 * Events Emitted:
 * - industry-theme.local-projects:repository-selected
 * - industry-theme.local-projects:repository-opened
 *
 * Events Listened:
 * - industry-theme.local-projects:filter
 * - industry-theme.local-projects:select-repository
 * - industry-theme.local-projects:open-repository
 */
export const LocalProjectsPanel: React.FC<PanelComponentProps> = (props) => {
  return <LocalProjectsPanelContent {...props} />;
};

/**
 * LocalProjectsPanelPreview - Compact preview for panel tabs/thumbnails
 */
export const LocalProjectsPanelPreview: React.FC = () => {
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
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '2px',
            backgroundColor: `${theme.colors.success || '#10b981'}40`,
          }}
        />
        <span>Local Projects</span>
      </div>
      <div
        style={{
          fontSize: `${theme.fontSizes[0]}px`,
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          marginTop: '4px',
        }}
      >
        Browse your cloned repositories sorted by recent activity
      </div>
    </div>
  );
};

// Re-export types and components
export type { LocalProjectCardProps, RepositoryAvatarProps } from './types';
export { LocalProjectCard } from './LocalProjectCard';
export { RepositoryAvatar } from './RepositoryAvatar';
