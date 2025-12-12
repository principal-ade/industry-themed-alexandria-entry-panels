/**
 * WorkspaceCollectionPanel Type Definitions
 *
 * Types for the browser-based Workspace Collection panel.
 * This panel displays repositories in a workspace for web applications,
 * using GitHub repository data rather than local filesystem entries.
 */

import type { PanelActions } from '../../types';
import type { GitHubRepository } from '../shared/github-types';

/**
 * Workspace type - matches alexandria-core-library Workspace
 */
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  theme?: string;
  createdAt: number;
  updatedAt: number;
  isDefault?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Data slice for workspace collection
 */
export interface WorkspaceCollectionSlice {
  /** The current workspace */
  workspace: Workspace | null;
  /** Loading state */
  loading: boolean;
  /** Error message if loading failed */
  error?: string;
}

/**
 * Data slice for workspace repositories
 * Contains GitHub repository data for repos in the workspace
 */
export interface WorkspaceRepositoriesSlice {
  /** Repositories in the workspace */
  repositories: GitHubRepository[];
  /** Loading state */
  loading: boolean;
  /** Error message if loading failed */
  error?: string;
}

/**
 * Extended actions for WorkspaceCollectionPanel
 */
export interface WorkspaceCollectionPanelActions extends PanelActions {
  /**
   * Remove a repository from the workspace
   * @param repoKey - Repository identifier in "owner/repo" format
   * @param workspaceId - Workspace ID
   */
  removeRepositoryFromWorkspace?: (repoKey: string, workspaceId: string) => Promise<void>;

  /**
   * Navigate to a repository page
   * @param owner - Repository owner
   * @param repo - Repository name
   */
  navigateToRepository?: (owner: string, repo: string) => void;

  /**
   * Preview a repository (show in preview panel without navigation)
   * @param repository - GitHub repository data
   */
  previewRepository?: (repository: GitHubRepository) => void;
}

/**
 * Repository selected event payload
 */
export interface RepositorySelectedPayload {
  /** Repository identifier (owner/repo) */
  repositoryKey: string;
  /** Full repository data */
  repository: GitHubRepository;
}

/**
 * Repository removed event payload
 */
export interface RepositoryRemovedPayload {
  /** Repository identifier (owner/repo) */
  repositoryKey: string;
  /** Workspace ID */
  workspaceId: string;
}

/**
 * Repository navigation event payload
 */
export interface RepositoryNavigatePayload {
  /** Repository owner */
  owner: string;
  /** Repository name */
  repo: string;
  /** Full repository data if available */
  repository?: GitHubRepository;
}

/**
 * Event payloads for WorkspaceCollectionPanel
 */
export interface WorkspaceCollectionPanelEventPayloads {
  /** Select repository event (from tools) */
  'select-repository': { repositoryKey: string };
  /** Navigate to repository event (from tools) */
  'navigate-repository': { repositoryKey: string };
  /** Remove repository event (from tools) */
  'remove-repository': { repositoryKey: string };
  /** Refresh workspace event (from tools) */
  'refresh-workspace': { force?: boolean };
  /** Repository selected notification */
  'repository:selected': RepositorySelectedPayload;
  /** Repository removed notification */
  'repository:removed': RepositoryRemovedPayload;
  /** Repository navigation notification */
  'repository:navigate': RepositoryNavigatePayload;
}
