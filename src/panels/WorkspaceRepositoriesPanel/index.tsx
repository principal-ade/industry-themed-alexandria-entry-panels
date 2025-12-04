import React, { useMemo, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from '@principal-ade/industry-theme';
import { Folder, Home, Pencil, AlertTriangle } from 'lucide-react';
import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library/types';
import type { PanelComponentProps } from '../../types';
import { LocalProjectCard } from '../LocalProjectsPanel/LocalProjectCard';
import '../LocalProjectsPanel/LocalProjectsPanel.css';
import type { Workspace, WorkspaceRepositoriesPanelActions } from './types';

// Panel event prefix
const PANEL_ID = 'industry-theme.workspace-repositories';

// Helper to create panel events
const createPanelEvent = <T,>(type: string, payload: T) => ({
  type,
  source: PANEL_ID,
  timestamp: Date.now(),
  payload,
});

/**
 * WorkspaceRepositoriesPanelContent - Internal component that uses theme
 */
const WorkspaceRepositoriesPanelContent: React.FC<PanelComponentProps> = ({
  context,
  actions,
  events,
}) => {
  const { theme } = useTheme();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [repositoryLocations, setRepositoryLocations] = React.useState<Map<string, boolean>>(
    new Map()
  );

  // Get extended actions
  const panelActions = actions as WorkspaceRepositoriesPanelActions;

  // Get data from context using framework's getSlice pattern
  const workspaceSlice = context.getSlice<Workspace>('workspace');
  const repositoriesSlice = context.getSlice<AlexandriaEntry[]>('workspaceRepositories');

  const workspace = workspaceSlice?.data ?? null;
  const isLoading = workspaceSlice?.loading || repositoriesSlice?.loading || false;

  // Sort repositories alphabetically by name
  const sortedRepositories = useMemo(() => {
    const repos = repositoriesSlice?.data ?? [];
    return [...repos].sort((a, b) => a.name.localeCompare(b.name));
  }, [repositoriesSlice?.data]);

  // Check locations for all repositories
  useEffect(() => {
    const checkLocations = async () => {
      if (!workspace?.id || !panelActions.isRepositoryInWorkspaceDirectory || !sortedRepositories.length) {
        return;
      }

      const locationMap = new Map<string, boolean>();
      await Promise.all(
        sortedRepositories.map(async (repo) => {
          try {
            const isInWorkspace = await panelActions.isRepositoryInWorkspaceDirectory!(repo, workspace.id);
            if (isInWorkspace !== null) {
              locationMap.set(repo.path, isInWorkspace);
            }
          } catch (error) {
            console.error(`Failed to check location for ${repo.name}:`, error);
          }
        })
      );
      setRepositoryLocations(locationMap);
    };

    checkLocations();
  }, [workspace, sortedRepositories, panelActions]);

  // Group repositories by location
  const { repositoriesInWorkspace, repositoriesOutsideWorkspace } = useMemo(() => {
    const inWorkspace: AlexandriaEntry[] = [];
    const outsideWorkspace: AlexandriaEntry[] = [];

    sortedRepositories.forEach((repo) => {
      const isInWorkspace = repositoryLocations.get(repo.path);
      if (isInWorkspace === true) {
        inWorkspace.push(repo);
      } else if (isInWorkspace === false) {
        outsideWorkspace.push(repo);
      }
    });

    return { repositoriesInWorkspace: inWorkspace, repositoriesOutsideWorkspace: outsideWorkspace };
  }, [sortedRepositories, repositoryLocations]);

  // Event handlers
  const handleSelectRepository = useCallback(
    (repository: AlexandriaEntry) => {
      events.emit(
        createPanelEvent('repository:selected', {
          repositoryId: repository.github?.id || repository.name,
          repository,
          repositoryPath: repository.path,
        })
      );
    },
    [events]
  );

  const handleOpenRepository = useCallback(
    (repository: AlexandriaEntry) => {
      events.emit(
        createPanelEvent('repository:opened', {
          repositoryId: repository.github?.id || repository.name,
          repository,
        })
      );
    },
    [events]
  );

  const handleRemoveFromWorkspace = useCallback(
    async (repository: AlexandriaEntry) => {
      if (!workspace?.id || !panelActions.removeRepositoryFromWorkspace) return;
      try {
        const repositoryId = repository.github?.id || repository.name;
        await panelActions.removeRepositoryFromWorkspace(repositoryId, workspace.id);
      } catch (error) {
        console.error('Failed to remove repository from workspace:', error);
        alert(
          `Failed to remove repository: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
    [workspace, panelActions]
  );

  const handleMoveToWorkspace = useCallback(
    async (repository: AlexandriaEntry) => {
      if (!workspace?.id || !panelActions.moveRepositoryToWorkspaceDirectory) return;
      try {
        await panelActions.moveRepositoryToWorkspaceDirectory(repository, workspace.id);
        setRepositoryLocations((prev) => new Map(prev).set(repository.path, true));
      } catch (error) {
        console.error('Failed to move repository:', error);
        alert(
          `Failed to move repository: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
    [workspace, panelActions]
  );

  // Subscribe to panel events
  useEffect(() => {
    const unsubscribers = [
      events.on<{ repositoryPath: string }>(`${PANEL_ID}:select-repository`, (event) => {
        const path = event.payload?.repositoryPath;
        if (path) {
          const repository = sortedRepositories.find((r) => r.path === path);
          if (repository) {
            handleSelectRepository(repository);
          }
        }
      }),

      events.on<{ repositoryPath: string }>(`${PANEL_ID}:open-repository`, (event) => {
        const path = event.payload?.repositoryPath;
        if (path) {
          const repository = sortedRepositories.find((r) => r.path === path);
          if (repository) {
            handleOpenRepository(repository);
          }
        }
      }),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [events, sortedRepositories, handleSelectRepository, handleOpenRepository]);

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
  if (isLoading) {
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
              Loading repositories...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div style={contentContainerStyle}>
      {/* Workspace header */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '4px',
          }}
        >
          {/* Left: Workspace name with edit button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: `${theme.fontSizes[2]}px`,
                fontWeight: theme.fontWeights.semibold,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
            >
              {workspace.name}
            </h3>
            <button
              type="button"
              onClick={handleToggleEditMode}
              title={isEditMode ? 'Exit edit mode' : 'Edit workspace'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                padding: 0,
                borderRadius: '4px',
                border: 'none',
                backgroundColor: isEditMode
                  ? theme.colors.backgroundTertiary || theme.colors.backgroundSecondary
                  : 'transparent',
                color: isEditMode ? theme.colors.primary : theme.colors.textSecondary,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(event) => {
                if (!isEditMode) {
                  event.currentTarget.style.backgroundColor =
                    theme.colors.backgroundTertiary || theme.colors.backgroundSecondary;
                  event.currentTarget.style.color = theme.colors.text;
                }
              }}
              onMouseLeave={(event) => {
                if (!isEditMode) {
                  event.currentTarget.style.backgroundColor = 'transparent';
                  event.currentTarget.style.color = theme.colors.textSecondary;
                }
              }}
            >
              <Pencil size={14} />
            </button>
          </div>

          {/* Right: Home directory */}
          {workspace.suggestedClonePath && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: 0,
              }}
            >
              <Home
                size={14}
                style={{
                  color: theme.colors.textSecondary,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: `${theme.fontSizes[0]}px`,
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.monospace,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={workspace.suggestedClonePath}
              >
                {workspace.suggestedClonePath}
              </span>
            </div>
          )}
        </div>

        {/* Workspace description */}
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

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Empty state */}
        {sortedRepositories.length === 0 && !isLoading && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
            }}
          >
            <p style={{ margin: 0 }}>No repositories in this workspace.</p>
          </div>
        )}

        {/* Repositories in workspace directory */}
        {repositoriesInWorkspace.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                paddingBottom: '4px',
              }}
            >
              <Home
                size={14}
                style={{
                  color: theme.colors.success || '#10b981',
                  flexShrink: 0,
                }}
              />
              <h4
                style={{
                  margin: 0,
                  fontSize: `${theme.fontSizes[1]}px`,
                  fontWeight: theme.fontWeights.semibold,
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.body,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                In Workspace Directory
              </h4>
              <span
                style={{
                  fontSize: `${theme.fontSizes[0]}px`,
                  color: theme.colors.textTertiary || theme.colors.textSecondary,
                  fontWeight: theme.fontWeights.medium,
                }}
              >
                {repositoriesInWorkspace.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {repositoriesInWorkspace.map((repository) => (
                <LocalProjectCard
                  key={repository.path}
                  entry={repository}
                  actionMode="workspace"
                  isEditMode={isEditMode}
                  isInWorkspaceDirectory={true}
                  workspacePath={workspace.suggestedClonePath}
                  onSelect={handleSelectRepository}
                  onOpen={handleOpenRepository}
                  onRemoveFromWorkspace={handleRemoveFromWorkspace}
                  onMoveToWorkspace={handleMoveToWorkspace}
                />
              ))}
            </div>
          </div>
        )}

        {/* Repositories outside workspace directory */}
        {repositoriesOutsideWorkspace.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                paddingBottom: '4px',
              }}
            >
              <AlertTriangle
                size={14}
                style={{
                  color: theme.colors.warning || '#f59e0b',
                  flexShrink: 0,
                }}
              />
              <h4
                style={{
                  margin: 0,
                  fontSize: `${theme.fontSizes[1]}px`,
                  fontWeight: theme.fontWeights.semibold,
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.body,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Outside Workspace Directory
              </h4>
              <span
                style={{
                  fontSize: `${theme.fontSizes[0]}px`,
                  color: theme.colors.textTertiary || theme.colors.textSecondary,
                  fontWeight: theme.fontWeights.medium,
                }}
              >
                {repositoriesOutsideWorkspace.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {repositoriesOutsideWorkspace.map((repository) => (
                <LocalProjectCard
                  key={repository.path}
                  entry={repository}
                  actionMode="workspace"
                  isEditMode={isEditMode}
                  isInWorkspaceDirectory={false}
                  workspacePath={workspace.suggestedClonePath}
                  onSelect={handleSelectRepository}
                  onOpen={handleOpenRepository}
                  onRemoveFromWorkspace={handleRemoveFromWorkspace}
                  onMoveToWorkspace={handleMoveToWorkspace}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * WorkspaceRepositoriesPanel - Workspace repository management panel
 *
 * Features:
 * - List all repositories in a workspace
 * - Group by in/outside workspace directory
 * - Move repositories to workspace directory
 * - Remove repositories from workspace
 *
 * Data Slices:
 * - workspace: Workspace object
 * - workspaceRepositories: AlexandriaEntry[]
 *
 * Events Emitted:
 * - repository:selected
 * - repository:opened
 */
export const WorkspaceRepositoriesPanel: React.FC<PanelComponentProps> = (props) => {
  return (
    <ThemeProvider>
      <WorkspaceRepositoriesPanelContent {...props} />
    </ThemeProvider>
  );
};

// Re-export types
export type {
  Workspace,
  WorkspaceRepositoriesPanelActions,
  RepositorySelectedPayload,
  RepositoryOpenedPayload,
} from './types';
