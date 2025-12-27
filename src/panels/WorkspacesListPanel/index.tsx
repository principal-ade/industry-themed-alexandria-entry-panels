import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Search, Plus, X, Layers } from 'lucide-react';
import type { PanelComponentProps } from '../../types';
import { WorkspaceCard } from './WorkspaceCard';
import type {
  Workspace,
  WorkspacesSlice,
  WorkspacesListPanelActions,
} from './types';

// Panel event prefix
const PANEL_ID = 'industry-theme.workspaces-list';

// Helper to create panel events with required fields
const createPanelEvent = <T,>(type: string, payload: T) => ({
  type,
  source: PANEL_ID,
  timestamp: Date.now(),
  payload,
});

export interface WorkspacesListPanelProps extends PanelComponentProps {
  /** Whether to show the search bar by default */
  defaultShowSearch?: boolean;
}

/**
 * WorkspacesListPanelContent - Internal component that uses theme
 */
const WorkspacesListPanelContent: React.FC<WorkspacesListPanelProps> = ({
  context,
  actions,
  events,
  defaultShowSearch = false,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(defaultShowSearch);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [workspaceRepositories, setWorkspaceRepositories] = useState<Map<string, string[]>>(
    new Map()
  );

  // Get extended actions
  const panelActions = actions as WorkspacesListPanelActions;

  // Get workspaces from context slice
  const workspacesSlice = context.getSlice<WorkspacesSlice>('workspaces');
  const workspaces = useMemo(
    () => workspacesSlice?.data?.workspaces || [],
    [workspacesSlice?.data?.workspaces]
  );
  const defaultWorkspaceId = workspacesSlice?.data?.defaultWorkspaceId ?? null;
  const loading = workspacesSlice?.loading ?? false;

  // Load repository names for search functionality
  useEffect(() => {
    const loadRepositories = async () => {
      if (!panelActions.getWorkspaceRepositories || workspaces.length === 0) {
        return;
      }

      const repoMap = new Map<string, string[]>();
      await Promise.all(
        workspaces.map(async (workspace) => {
          try {
            const repos = await panelActions.getWorkspaceRepositories!(workspace.id);
            repoMap.set(workspace.id, repos.map((r) => r.name));
          } catch (error) {
            console.error(`Failed to load repos for workspace ${workspace.id}:`, error);
            repoMap.set(workspace.id, []);
          }
        })
      );
      setWorkspaceRepositories(repoMap);
    };

    loadRepositories();
  }, [workspaces, panelActions]);

  // Filter and sort workspaces
  const sortedWorkspaces = useMemo(() => {
    let filtered = workspaces;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = workspaces.filter((workspace) => {
        // Search by workspace name
        if (workspace.name.toLowerCase().includes(query)) {
          return true;
        }

        // Search by description
        if (workspace.description?.toLowerCase().includes(query)) {
          return true;
        }

        // Search by repository names in this workspace
        const repos = workspaceRepositories.get(workspace.id) || [];
        return repos.some((repoName) => repoName.toLowerCase().includes(query));
      });
    }

    // Sort: default workspace first, then by name alphabetically
    return [...filtered].sort((a, b) => {
      // Default workspace always first
      if (a.id === defaultWorkspaceId) return -1;
      if (b.id === defaultWorkspaceId) return 1;

      // Then sort alphabetically by name (case-insensitive)
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }, [workspaces, defaultWorkspaceId, searchQuery, workspaceRepositories]);

  // Handle workspace selection
  const handleWorkspaceSelect = useCallback(
    (workspace: Workspace) => {
      setSelectedWorkspaceId(workspace.id);
      events.emit(
        createPanelEvent(`${PANEL_ID}:workspace:selected`, {
          workspaceId: workspace.id,
          workspace,
        })
      );
    },
    [events]
  );

  // Handle workspace open
  const handleOpenWorkspace = useCallback(
    async (workspace: Workspace) => {
      if (!panelActions.openWorkspace) {
        console.warn('Open workspace action not available');
        return;
      }

      try {
        await panelActions.openWorkspace(workspace.id);
        events.emit(
          createPanelEvent(`${PANEL_ID}:workspace:opened`, {
            workspaceId: workspace.id,
            workspace,
          })
        );
      } catch (error) {
        console.error('Failed to open workspace:', error);
      }
    },
    [panelActions, events]
  );

  // Handle workspace delete
  const handleDeleteWorkspace = useCallback(
    async (workspace: Workspace) => {
      if (!panelActions.deleteWorkspace) {
        console.warn('Delete workspace action not available');
        return;
      }

      // Confirm deletion
      const confirmed = window.confirm(
        `Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await panelActions.deleteWorkspace(workspace.id);
        events.emit(
          createPanelEvent(`${PANEL_ID}:workspace:deleted`, {
            workspaceId: workspace.id,
          })
        );

        // Refresh workspaces
        await context.refresh('workspace', 'workspaces');
      } catch (error) {
        console.error('Failed to delete workspace:', error);
      }
    },
    [panelActions, events, context]
  );

  // Handle workspace name update
  const handleUpdateWorkspaceName = useCallback(
    async (workspaceId: string, newName: string) => {
      if (!panelActions.updateWorkspace) {
        console.warn('Update workspace action not available');
        return;
      }

      await panelActions.updateWorkspace(workspaceId, { name: newName });

      // Refresh workspaces
      await context.refresh('workspace', 'workspaces');
    },
    [panelActions, context]
  );

  // Handle create workspace - emits event for host app to show modal
  const handleCreateWorkspace = useCallback(() => {
    // Emit event for host app to handle (e.g., show a modal)
    events.emit(
      createPanelEvent(`${PANEL_ID}:create-workspace-requested`, {})
    );
  }, [events]);

  // Subscribe to panel events
  useEffect(() => {
    const unsubscribers = [
      // Select workspace event from tools
      events.on<{ workspaceId: string }>(`${PANEL_ID}:select-workspace`, (event) => {
        const workspaceId = event.payload?.workspaceId;
        if (workspaceId) {
          const workspace = workspaces.find((w) => w.id === workspaceId);
          if (workspace) {
            handleWorkspaceSelect(workspace);
          }
        }
      }),

      // Open workspace event from tools
      events.on<{ workspaceId: string }>(`${PANEL_ID}:open-workspace`, (event) => {
        const workspaceId = event.payload?.workspaceId;
        if (workspaceId) {
          const workspace = workspaces.find((w) => w.id === workspaceId);
          if (workspace) {
            handleOpenWorkspace(workspace);
          }
        }
      }),

      // Create workspace event from tools
      events.on<{ name: string; description?: string }>(
        `${PANEL_ID}:create-workspace`,
        async (event) => {
          const { name, description } = event.payload || {};
          if (name && panelActions.createWorkspace) {
            try {
              const workspace = await panelActions.createWorkspace(name, { description });
              events.emit(
                createPanelEvent(`${PANEL_ID}:workspace:created`, {
                  workspaceId: workspace.id,
                  workspace,
                })
              );
              await context.refresh('workspace', 'workspaces');
            } catch (error) {
              console.error('Failed to create workspace:', error);
            }
          }
        }
      ),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [events, workspaces, handleWorkspaceSelect, handleOpenWorkspace, panelActions, context]);

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
              Loading workspaces...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={contentContainerStyle}>
      {/* Header with search and create buttons */}
      <div
        style={{
          height: '40px',
          minHeight: '40px',
          padding: '0 16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color={theme.colors.primary} />
          <span
            style={{
              fontSize: `${theme.fontSizes[2]}px`,
              fontWeight: theme.fontWeights.medium,
              color: theme.colors.text,
              fontFamily: theme.fonts.body,
            }}
          >
            Workspaces
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setShowSearchBox(!showSearchBox);
              if (showSearchBox) {
                setSearchQuery('');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: showSearchBox
                ? theme.colors.primary
                : theme.colors.backgroundTertiary,
              color: showSearchBox ? theme.colors.background : theme.colors.text,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Search workspaces"
          >
            <Search size={16} />
          </button>
          <button
            onClick={handleCreateWorkspace}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Create new workspace"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Search box */}
      {showSearchBox && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by workspace or repository name..."
            autoFocus
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              fontSize: `${theme.fontSizes[1]}px`,
              fontFamily: theme.fonts.body,
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.backgroundTertiary,
                color: theme.colors.text,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Scrollable content */}
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
        {/* Workspace list */}
        {sortedWorkspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            isSelected={workspace.id === selectedWorkspaceId}
            isDefault={workspace.id === defaultWorkspaceId}
            onClick={handleWorkspaceSelect}
            onOpen={panelActions.openWorkspace ? handleOpenWorkspace : undefined}
            onDelete={panelActions.deleteWorkspace ? handleDeleteWorkspace : undefined}
            onUpdateName={panelActions.updateWorkspace ? handleUpdateWorkspaceName : undefined}
          />
        ))}

        {/* No results message */}
        {sortedWorkspaces.length === 0 && !loading && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
            }}
          >
            <p style={{ margin: 0 }}>
              {searchQuery.trim()
                ? `No workspaces found matching "${searchQuery}"`
                : 'No workspaces found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * WorkspacesListPanel - Browse and manage workspaces
 *
 * Features:
 * - List all workspaces with default highlighted
 * - Search/filter by workspace name or repository names
 * - Create new workspaces
 * - Edit workspace names inline
 * - Delete workspaces
 * - Open workspaces in new windows
 *
 * Data Slices:
 * - workspaces: WorkspacesSlice object
 *
 * Events Emitted:
 * - industry-theme.workspaces-list:workspace:selected
 * - industry-theme.workspaces-list:workspace:opened
 * - industry-theme.workspaces-list:workspace:created
 * - industry-theme.workspaces-list:workspace:deleted
 *
 * Events Listened:
 * - industry-theme.workspaces-list:select-workspace
 * - industry-theme.workspaces-list:open-workspace
 * - industry-theme.workspaces-list:create-workspace
 */
export const WorkspacesListPanel: React.FC<WorkspacesListPanelProps> = (props) => {
  return <WorkspacesListPanelContent {...props} />;
};

/**
 * WorkspacesListPanelPreview - Compact preview for panel tabs/thumbnails
 */
export const WorkspacesListPanelPreview: React.FC = () => {
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
        <Layers size={16} style={{ color: theme.colors.primary }} />
        <span>Workspaces</span>
      </div>
      <div
        style={{
          fontSize: `${theme.fontSizes[0]}px`,
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          marginTop: '4px',
        }}
      >
        Browse and manage your workspaces
      </div>
    </div>
  );
};

// Re-export components and types
export { WorkspaceCard } from './WorkspaceCard';
export type {
  Workspace,
  WorkspacesSlice,
  WorkspacesListPanelActions,
  WorkspaceCardProps,
  WorkspaceSelectedPayload,
  WorkspaceOpenedPayload,
  WorkspaceCreatedPayload,
  WorkspaceDeletedPayload,
} from './types';
