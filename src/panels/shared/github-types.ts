/**
 * Shared GitHub API Types
 *
 * Common types used across GitHub-related panels
 */

/**
 * GitHub repository data from the API
 */
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  clone_url: string;
  updated_at: string;
  pushed_at?: string;
  language: string | null;
  stargazers_count?: number;
  default_branch: string;
  fork?: boolean;
  /** License SPDX identifier (e.g., "MIT", "Apache-2.0") */
  license?: string | null;
}

/**
 * GitHub organization data from the API
 */
export interface GitHubOrganization {
  login: string;
  id: number;
  avatar_url: string;
  description: string | null;
}

/**
 * Reference to a locally cloned repository
 * Used to match GitHub repos with local Alexandria entries
 */
export interface LocalRepositoryReference {
  /** Local file system path */
  path: string;
  /** Repository name */
  name: string;
  /** GitHub full name (owner/repo) if known */
  githubFullName?: string;
  /** GitHub numeric ID if known */
  githubId?: string;
}
