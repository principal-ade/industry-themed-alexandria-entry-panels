/**
 * UserProfilePanel Type Definitions
 *
 * Types for displaying user profiles in the network view,
 * including their organizations and starred repositories.
 */

import type { PanelActions } from '../../types';

/**
 * GitHub User profile - matches GitHubUser from electron-app
 */
export interface GitHubUserProfile {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

/**
 * GitHub Organization - matches GitHubOrganization from electron-app
 */
export interface GitHubOrganization {
  login: string;
  id: number;
  avatar_url: string;
  description: string | null;
}

/**
 * GitHub Repository - matches GitHubRepository from electron-app
 */
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url?: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  clone_url: string;
  updated_at: string;
  pushed_at: string;
  language: string | null;
  default_branch: string;
  stargazers_count?: number;
}

/**
 * User presence status from network
 */
export interface UserPresenceStatus {
  status: 'online' | 'away' | 'offline';
  lastSeen?: number;
  statusMessage?: string;
  activeRepository?: string;
}

/**
 * Data slice for user profile panel
 */
export interface UserProfileSlice {
  /** The user's GitHub profile */
  user: GitHubUserProfile | null;
  /** User's GitHub organizations */
  organizations: GitHubOrganization[];
  /** User's starred repositories (public) */
  starredRepositories: GitHubRepository[];
  /** User's presence status in the network */
  presence?: UserPresenceStatus;
  /** Whether data is loading */
  loading: boolean;
  /** Error message if loading failed */
  error?: string;
}

/**
 * Extended actions for UserProfilePanel
 */
export interface UserProfilePanelActions extends PanelActions {
  /**
   * View an organization's details
   * @param orgLogin - Organization login/username
   */
  viewOrganization?: (orgLogin: string) => Promise<void>;

  /**
   * View a repository's details
   * @param owner - Repository owner
   * @param repo - Repository name
   */
  viewRepository?: (owner: string, repo: string) => Promise<void>;

  /**
   * Clone a repository
   * @param repository - Repository to clone
   */
  cloneRepository?: (repository: GitHubRepository) => Promise<void>;

  /**
   * Open repository in browser
   * @param url - Repository URL
   */
  openInBrowser?: (url: string) => Promise<void>;

  /**
   * Fetch user profile by username
   * @param username - GitHub username
   */
  fetchUserProfile?: (username: string) => Promise<GitHubUserProfile | null>;

  /**
   * Fetch user's organizations
   * @param username - GitHub username
   */
  fetchUserOrganizations?: (username: string) => Promise<GitHubOrganization[]>;

  /**
   * Fetch user's starred repositories
   * @param username - GitHub username
   */
  fetchUserStarredRepositories?: (
    username: string
  ) => Promise<GitHubRepository[]>;
}

/**
 * Props for UserProfileCard component
 */
export interface UserProfileCardProps {
  /** User profile data */
  user: GitHubUserProfile;
  /** User's presence status */
  presence?: UserPresenceStatus;
  /** Whether this is the current user's own profile */
  isCurrentUser?: boolean;
}

/**
 * Props for OrganizationCard component
 */
export interface OrganizationCardProps {
  /** Organization data */
  organization: GitHubOrganization;
  /** Callback when card is clicked */
  onClick?: (organization: GitHubOrganization) => void;
}

/**
 * Props for StarredRepositoryCard component
 */
export interface StarredRepositoryCardProps {
  /** Repository data */
  repository: GitHubRepository;
  /** Callback when card is clicked */
  onClick?: (repository: GitHubRepository) => void;
  /** Callback when clone button is clicked */
  onClone?: (repository: GitHubRepository) => void;
  /** Callback when open in browser is clicked */
  onOpenInBrowser?: (repository: GitHubRepository) => void;
}

/**
 * Organization selected event payload
 */
export interface OrganizationSelectedPayload {
  orgLogin: string;
  organization: GitHubOrganization;
}

/**
 * Repository selected event payload
 */
export interface RepositorySelectedPayload {
  owner: string;
  repo: string;
  repository: GitHubRepository;
}

/**
 * Repository clone requested event payload
 */
export interface RepositoryCloneRequestedPayload {
  repository: GitHubRepository;
}

/**
 * Event payloads for UserProfilePanel
 */
export interface UserProfilePanelEventPayloads {
  /** Select organization event (from tools) */
  'select-organization': { orgLogin: string };
  /** Select repository event (from tools) */
  'select-repository': { owner: string; repo: string };
  /** Organization selected notification */
  'organization:selected': OrganizationSelectedPayload;
  /** Repository selected notification */
  'repository:selected': RepositorySelectedPayload;
  /** Repository clone requested notification */
  'repository:clone-requested': RepositoryCloneRequestedPayload;
  /** Profile view changed (switched tabs) */
  'view:changed': { view: 'organizations' | 'starred' };
}

/**
 * Active view tab in the panel
 */
export type UserProfileView = 'organizations' | 'starred';
