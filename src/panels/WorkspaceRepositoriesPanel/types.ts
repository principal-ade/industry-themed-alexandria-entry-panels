/**
 * WorkspaceRepositoriesPanel Type Definitions
 *
 * Types for the Workspace Repositories panel
 */

import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library/types';
import type { PanelActions } from '../../types';

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
