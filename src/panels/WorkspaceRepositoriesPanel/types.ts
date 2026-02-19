/**
 * WorkspaceRepositoriesPanel Type Definitions
 *
 * Types for the Workspace Repositories panel
 */

import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library/types';
import type { PanelActions, DataSlice, PanelComponentProps } from '../../types';

/**
 * Workspace type
 */
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  suggestedClonePath?: string;
}

/**
 * Data slice for workspace
 */
export interface WorkspaceSlice {
  /** The current workspace */
  workspace: Workspace | null;
  /** Loading state */
  loading: boolean;
  /** Error message if loading failed */
  error?: string;
}

/**
 * Data slice for workspace repositories
 * Contains Alexandria entries for repos in the workspace
 */
export interface WorkspaceRepositoriesSlice {
  /** Repositories in the workspace */
  repositories: AlexandriaEntry[];
  /** Loading state */
  loading: boolean;
  /** Error message if loading failed */
  error?: string;
}

/**
 * Extended actions for WorkspaceRepositoriesPanel
 */
export interface WorkspaceRepositoriesPanelActions extends PanelActions {
  /** Remove a repository from a workspace */
  removeRepositoryFromWorkspace?: (
    repositoryId: string,
    workspaceId: string
  ) => Promise<void>;
  /** Copy text to clipboard */
  copyToClipboard?: (text: string) => Promise<void>;
  /** Check if repository is in workspace directory */
  isRepositoryInWorkspaceDirectory?: (
    repository: AlexandriaEntry,
    workspaceId: string
  ) => Promise<boolean | null>;
  /** Move repository to workspace directory */
  moveRepositoryToWorkspaceDirectory?: (
    repository: AlexandriaEntry,
    workspaceId: string
  ) => Promise<string>;
}

/**
 * Repository selected event payload
 */
export interface RepositorySelectedPayload {
  repositoryId: string;
  repository: AlexandriaEntry;
  repositoryPath: string;
}

/**
 * Repository opened event payload
 */
export interface RepositoryOpenedPayload {
  repositoryId: string;
  repository: AlexandriaEntry;
}

/**
 * Context interface for WorkspaceRepositoriesPanel
 * Declares which slices this panel requires
 */
export interface WorkspaceRepositoriesPanelContext {
  /** Workspace data slice (required) */
  workspace: DataSlice<WorkspaceSlice>;
  /** Workspace repositories data slice (required) */
  workspaceRepositories: DataSlice<WorkspaceRepositoriesSlice>;
  /** User home path (optional - for display purposes) */
  userHomePath?: DataSlice<string>;
}

/**
 * Props type for WorkspaceRepositoriesPanel component
 */
export type WorkspaceRepositoriesPanelPropsTyped = PanelComponentProps<
  WorkspaceRepositoriesPanelActions,
  WorkspaceRepositoriesPanelContext
>;

/**
 * Event payloads for WorkspaceRepositoriesPanel
 */
export interface WorkspaceRepositoriesPanelEventPayloads {
  /** Select repository event */
  'select-repository': { repositoryPath: string };
  /** Open repository event */
  'open-repository': { repositoryPath: string };
  /** Refresh workspace event */
  'refresh-workspace': { force?: boolean };
  /** Repository selected notification */
  'repository:selected': RepositorySelectedPayload;
  /** Repository opened notification */
  'repository:opened': RepositoryOpenedPayload;
}
