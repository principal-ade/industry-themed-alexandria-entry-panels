/**
 * WorkspacesListPanel Type Definitions
 *
 * Types for the Workspaces List panel
 */

import type { PanelActions, DataSlice, PanelComponentProps } from '../../types';

/**
 * Workspace type - Extended for list panel use
 */
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  theme?: string;
  suggestedClonePath?: string;
  createdAt: number;
  updatedAt: number;
  /** Whether the workspace is private (not shared) */
  isPrivate?: boolean;
}

/**
 * Data slice for workspaces list
 */
export interface WorkspacesSlice {
  /** List of all workspaces */
  workspaces: Workspace[];
  /** Default workspace ID */
  defaultWorkspaceId?: string | null;
  /** Whether workspaces are currently loading */
  loading: boolean;
  /** Error message if loading failed */
  error?: string;
}

/**
 * Extended actions for WorkspacesListPanel
 */
export interface WorkspacesListPanelActions extends PanelActions {
  /**
   * Create a new workspace
   * @param name - Workspace name
   * @param options - Optional workspace settings
   */
  createWorkspace?: (
    name: string,
    options?: {
      description?: string;
      icon?: string;
      theme?: string;
      suggestedClonePath?: string;
    }
  ) => Promise<Workspace>;

  /**
   * Update a workspace
   * @param workspaceId - Workspace ID
   * @param updates - Fields to update
   */
  updateWorkspace?: (
    workspaceId: string,
    updates: Partial<Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;

  /**
   * Delete a workspace
   * @param workspaceId - Workspace ID
   */
  deleteWorkspace?: (workspaceId: string) => Promise<void>;

  /**
   * Set a workspace as default
   * @param workspaceId - Workspace ID
   */
  setDefaultWorkspace?: (workspaceId: string) => Promise<void>;

  /**
   * Open a workspace (e.g., in a new window)
   * @param workspaceId - Workspace ID
   */
  openWorkspace?: (workspaceId: string) => Promise<void>;

  /**
   * Get repositories in a workspace (for search)
   * @param workspaceId - Workspace ID
   */
  getWorkspaceRepositories?: (
    workspaceId: string
  ) => Promise<{ name: string }[]>;
}

/**
 * Props for WorkspaceCard component
 */
export interface WorkspaceCardProps {
  /** Workspace data */
  workspace: Workspace;
  /** Whether this workspace is selected */
  isSelected?: boolean;
  /** Whether this is the default workspace */
  isDefault?: boolean;
  /** Callback when card is clicked */
  onClick?: (workspace: Workspace) => void;
  /** Callback when open button is clicked */
  onOpen?: (workspace: Workspace) => void;
  /** Callback when delete button is clicked */
  onDelete?: (workspace: Workspace) => void;
  /** Callback when workspace name is updated */
  onUpdateName?: (workspaceId: string, newName: string) => Promise<void>;
  /** Theme color for workspace icon */
  themeColor?: string;
}

/**
 * Workspace selected event payload
 */
export interface WorkspaceSelectedPayload {
  workspaceId: string;
  workspace: Workspace;
}

/**
 * Workspace opened event payload
 */
export interface WorkspaceOpenedPayload {
  workspaceId: string;
  workspace: Workspace;
}

/**
 * Workspace created event payload
 */
export interface WorkspaceCreatedPayload {
  workspaceId: string;
  workspace: Workspace;
}

/**
 * Workspace deleted event payload
 */
export interface WorkspaceDeletedPayload {
  workspaceId: string;
}

/**
 * Context interface for WorkspacesListPanel
 * Declares which slices this panel requires
 */
export interface WorkspacesListPanelContext {
  /** Workspaces data slice (required) */
  workspaces: DataSlice<WorkspacesSlice>;
}

/**
 * Props type for WorkspacesListPanel component
 */
export type WorkspacesListPanelPropsTyped = PanelComponentProps<
  WorkspacesListPanelActions,
  WorkspacesListPanelContext
>;

/**
 * Event payloads for WorkspacesListPanel
 */
export interface WorkspacesListPanelEventPayloads {
  /** Select workspace event (from tools) */
  'select-workspace': { workspaceId: string };
  /** Open workspace event (from tools) */
  'open-workspace': { workspaceId: string };
  /** Create workspace event (from tools) */
  'create-workspace': { name: string; description?: string };
  /** Create workspace requested - emitted when user clicks add button */
  'create-workspace-requested': Record<string, never>;
  /** Workspace selected notification */
  'workspace:selected': WorkspaceSelectedPayload;
  /** Workspace opened notification */
  'workspace:opened': WorkspaceOpenedPayload;
  /** Workspace created notification */
  'workspace:created': WorkspaceCreatedPayload;
  /** Workspace deleted notification */
  'workspace:deleted': WorkspaceDeletedPayload;
}
