/**
 * GitHubProjectsPanel Type Definitions
 */

import type { PanelActions } from '../../types';
import type {
  GitHubRepository,
  GitHubOrganization,
} from '../shared/github-types';

/**
 * Data slice for GitHub projects (user repos + org repos)
 * Provided by the host application through panel context
 */
export interface GitHubProjectsSlice {
  /** User's own repositories */
  userRepositories: GitHubRepository[];
  /** User's organizations */
  organizations: GitHubOrganization[];
  /** Repositories by organization (org login -> repos) */
  orgRepositories: Record<string, GitHubRepository[]>;
  /** Whether data is currently loading */
  loading: boolean;
  /** Error message if loading failed */
  error?: string;
  /** Current authenticated user login */
  currentUser?: string;
}

/**
 * Extended actions for GitHubProjectsPanel
 * These are provided by the host application
 */
export interface GitHubProjectsPanelActions extends PanelActions {
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
   * Refresh projects data
   */
  refreshProjects?: () => Promise<void>;

  /**
   * Add a repository to the current collection/workspace
   * @param repo - Repository to add
   */
  addToCollection?: (repo: GitHubRepository) => Promise<void>;
}

/**
 * Event payloads for GitHubProjectsPanel
 */
export interface GitHubProjectsPanelEventPayloads {
  /** Filter projects event */
  filter: { filter: string };
  /** Toggle owner section collapse event */
  'toggle-section': { owner: string };
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
