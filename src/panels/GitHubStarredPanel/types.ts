/**
 * GitHubStarredPanel Type Definitions
 */

import type { PanelActions, DataSlice, PanelComponentProps } from '../../types';
import type { GitHubRepository } from '../shared/github-types';

/**
 * Data slice for GitHub starred repositories
 * Provided by the host application through panel context
 */
export interface GitHubStarredSlice {
  /** List of starred repositories */
  repositories: GitHubRepository[];
  /** Whether repositories are currently loading */
  loading: boolean;
  /** Error message if loading failed */
  error?: string;
}

/**
 * Extended actions for GitHubStarredPanel
 * These are provided by the host application
 */
export interface GitHubStarredPanelActions extends PanelActions {
  /**
   * Clone a repository from GitHub
   * @param repo - Repository to clone
   */
  cloneRepository?: (repo: GitHubRepository) => Promise<void>;

  /**
   * Open a locally cloned repository
   * @param localPath - Path to the local repository
   */
  openRepository?: (localPath: string) => Promise<void>;

  /**
   * Refresh starred repositories data
   */
  refreshStarred?: () => Promise<void>;

  /**
   * Add a repository to the current collection/workspace
   * @param repo - Repository to add
   */
  addToCollection?: (repo: GitHubRepository) => Promise<void>;
}

/**
 * Context interface for GitHubStarredPanel
 * Declares which slices this panel requires and uses
 */
export interface GitHubStarredPanelContext {
  /** GitHub starred repositories data slice (required) */
  githubStarred: DataSlice<GitHubStarredSlice>;
  /** Alexandria repositories data slice (optional - for showing local repo status) */
  alexandriaRepositories?: DataSlice<import('../LocalProjectsPanel/types').AlexandriaRepositoriesSlice>;
  /** Workspace data slice (optional - for collection context) */
  workspace?: DataSlice<import('../WorkspaceCollectionPanel/types').WorkspaceCollectionSlice>;
  /** Workspace repositories data slice (optional - for collection repos) */
  workspaceRepositories?: DataSlice<import('../WorkspaceCollectionPanel/types').WorkspaceCollectionRepositoriesSlice>;
}

/**
 * Props type for GitHubStarredPanel component
 */
export type GitHubStarredPanelPropsTyped = PanelComponentProps<
  GitHubStarredPanelActions,
  GitHubStarredPanelContext
>;

/**
 * Event payloads for GitHubStarredPanel
 */
export interface GitHubStarredPanelEventPayloads {
  /** Filter starred repositories event */
  filter: { filter: string };
  /** Select a repository event */
  'select-repository': { identifier: string };
  /** Clone a repository event */
  'clone-repository': { identifier: string };
  /** Repository selected notification */
  'repository-selected': { repository: GitHubRepository };
  /** Repository cloned notification */
  'repository-cloned': { repository: GitHubRepository; localPath: string };
  /** Repository added to collection notification */
  'repository-added-to-collection': { repository: GitHubRepository };
}
