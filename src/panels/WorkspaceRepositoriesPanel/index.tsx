import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Folder, Home, Check } from 'lucide-react';
import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library/types';
import { LocalProjectCard } from '../LocalProjectsPanel/LocalProjectCard';
import '../LocalProjectsPanel/LocalProjectsPanel.css';
import type {
  WorkspaceRepositoriesPanelPropsTyped,
} from './types';

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
const WorkspaceRepositoriesPanelContent: React.FC<WorkspaceRepositoriesPanelPropsTyped> = ({
  context,
  actions,
  events,
}) => {
  const { theme } = useTheme();
  const [repositoryLocations, setRepositoryLocations] = React.useState<
    Map<string, boolean>
  >(new Map());
  const [copiedPath, setCopiedPath] = useState(false);
  const [isPathHovered, setIsPathHovered] = useState(false);

  // Get extended actions (actions are already typed via WorkspaceRepositoriesPanelPropsTyped)
  const panelActions = actions;

  // Get data from typed context slices (direct property access)
  const { workspace: workspaceSlice, workspaceRepositories: repositoriesSlice, userHomePath: userHomePathSlice } = context;

  const workspace = workspaceSlice?.data?.workspace ?? null;
  const userHomePath = userHomePathSlice?.data ?? undefined;
  const isLoading =
    workspaceSlice?.loading || repositoriesSlice?.loading || false;

  // Sort repositories alphabetically by name
  const sortedRepositories = useMemo(() => {
    const repos = repositoriesSlice?.data?.repositories ?? [];
    return [...repos].sort((a, b) => a.name.localeCompare(b.name));
  }, [repositoriesSlice?.data?.repositories]);

  // Check locations for all repositories
  useEffect(() => {
    const checkLocations = async () => {
      if (
        !workspace?.id ||
        !panelActions.isRepositoryInWorkspaceDirectory ||
        !sortedRepositories.length
      ) {
        return;
      }

      const locationMap = new Map<string, boolean>();
      await Promise.all(
        sortedRepositories.map(async (repo) => {
          try {
            const isInWorkspace =
              await panelActions.isRepositoryInWorkspaceDirectory!(
                repo,
                workspace.id
              );
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
  const { repositoriesInWorkspace, repositoriesOutsideWorkspace } =
    useMemo(() => {
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

      return {
        repositoriesInWorkspace: inWorkspace,
        repositoriesOutsideWorkspace: outsideWorkspace,
      };
    }, [sortedRepositories, repositoryLocations]);

  // Event handlers
  const handleSelectRepository = useCallback(
    (repository: AlexandriaEntry) => {
      events.emit(
        createPanelEvent('repository:selected', {
          repositoryId: repository.name,
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
          repositoryId: repository.name,
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
        await panelActions.removeRepositoryFromWorkspace(
          repository.name,
          workspace.id
        );
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
      if (!workspace?.id || !panelActions.moveRepositoryToWorkspaceDirectory)
        return;
      try {
        await panelActions.moveRepositoryToWorkspaceDirectory(
          repository,
          workspace.id
        );
        setRepositoryLocations((prev) =>
          new Map(prev).set(repository.path, true)
        );
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
      events.on<{ repositoryPath: string }>(
        `${PANEL_ID}:select-repository`,
        (event) => {
          const path = event.payload?.repositoryPath;
          if (path) {
            const repository = sortedRepositories.find((r) => r.path === path);
            if (repository) {
              handleSelectRepository(repository);
            }
          }
        }
      ),

      events.on<{ repositoryPath: string }>(
        `${PANEL_ID}:open-repository`,
        (event) => {
          const path = event.payload?.repositoryPath;
          if (path) {
            const repository = sortedRepositories.find((r) => r.path === path);
            if (repository) {
              handleOpenRepository(repository);
            }
          }
        }
      ),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [
    events,
    sortedRepositories,
    handleSelectRepository,
    handleOpenRepository,
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

  return (
    <div style={contentContainerStyle}>
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
        <Folder size={18} color={theme.colors.primary} />
        <span
          style={{
            fontSize: `${theme.fontSizes[2]}px`,
            fontWeight: theme.fontWeights.medium,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {workspace.name}
        </span>
        {sortedRepositories.length > 0 && (
          <span
            style={{
              fontSize: `${theme.fontSizes[1]}px`,
              color: theme.colors.textSecondary,
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: theme.colors.background,
              flexShrink: 0,
            }}
          >
            {sortedRepositories.length}
          </span>
        )}
        {/* Home directory button */}
        {workspace.suggestedClonePath && (
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  workspace.suggestedClonePath!
                );
                setCopiedPath(true);
                setTimeout(() => setCopiedPath(false), 2000);
              } catch (err) {
                console.error('Failed to copy path:', err);
              }
            }}
            onMouseEnter={() => setIsPathHovered(true)}
            onMouseLeave={() => setIsPathHovered(false)}
            title={
              copiedPath
                ? 'Copied!'
                : `Click to copy: ${workspace.suggestedClonePath}`
            }
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${copiedPath ? theme.colors.success || '#10b981' : theme.colors.border}`,
              backgroundColor: copiedPath
                ? `${theme.colors.success || '#10b981'}15`
                : theme.colors.backgroundTertiary,
              color: copiedPath
                ? theme.colors.success || '#10b981'
                : theme.colors.textSecondary,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              minWidth: 0,
              maxWidth: isPathHovered || copiedPath ? '200px' : '32px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {copiedPath ? (
              <Check size={14} style={{ flexShrink: 0 }} />
            ) : (
              <Home size={14} style={{ flexShrink: 0 }} />
            )}
            <span
              style={{
                fontSize: `${theme.fontSizes[0]}px`,
                fontFamily: theme.fonts.monospace,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                opacity: isPathHovered || copiedPath ? 1 : 0,
                width: isPathHovered || copiedPath ? 'auto' : 0,
                transition: 'opacity 0.15s ease',
              }}
            >
              {copiedPath ? 'Copied!' : workspace.suggestedClonePath}
            </span>
          </button>
        )}
      </div>

      {/* Workspace description */}
      {workspace.description && (
        <div style={{ padding: '8px 16px' }}>
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
        </div>
      )}

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '8px 16px',
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
            <h4
              style={{
                margin: 0,
                paddingBottom: '4px',
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
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              {repositoriesInWorkspace.map((repository) => (
                <LocalProjectCard
                  key={repository.path}
                  entry={repository}
                  actionMode="workspace"
                  isInWorkspaceDirectory={true}
                  workspacePath={workspace.suggestedClonePath}
                  userHomePath={userHomePath}
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
            <h4
              style={{
                margin: 0,
                paddingBottom: '4px',
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
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              {repositoriesOutsideWorkspace.map((repository) => (
                <LocalProjectCard
                  key={repository.path}
                  entry={repository}
                  actionMode="workspace"
                  isInWorkspaceDirectory={false}
                  workspacePath={workspace.suggestedClonePath}
                  userHomePath={userHomePath}
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
 * @deprecated This panel is deprecated. Use WorkspaceCollectionPanel instead.
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
export const WorkspaceRepositoriesPanel: React.FC<WorkspaceRepositoriesPanelPropsTyped> = (
  props
) => {
  return <WorkspaceRepositoriesPanelContent {...props} />;
};

// Re-export types
export type {
  Workspace,
  WorkspaceRepositoriesPanelActions,
  RepositorySelectedPayload,
  RepositoryOpenedPayload,
} from './types';
