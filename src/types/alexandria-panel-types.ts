/**
 * Shared Type Definitions for Alexandria Panels
 *
 * This file consolidates all action and context type definitions
 * for the alexandria-panels package, enabling full type safety
 * with panel-framework-core v0.3.0+
 */

import type { PanelActions, DataSlice, PanelComponentProps } from '@principal-ade/panel-framework-core';
import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library';

// Re-export individual panel types
export type {
  // UserCollectionsPanel types
  Collection,
  CollectionMembership,
  UserCollectionsSlice,
  UserCollectionsPanelActions,
  CollectionCardProps,
  CollectionSelectedPayload,
  CollectionCreatedPayload,
  CollectionDeletedPayload,
  RepositoryAddedPayload as CollectionRepositoryAddedPayload,
  RepositoryRemovedPayload as CollectionRepositoryRemovedPayload,
  UserCollectionsPanelEventPayloads,
} from '../panels/UserCollectionsPanel/types';

export type {
  // GitHubStarredPanel types
  GitHubStarredSlice,
  GitHubStarredPanelActions,
  GitHubStarredPanelEventPayloads,
} from '../panels/GitHubStarredPanel/types';

export type {
  // GitHubProjectsPanel types
  GitHubProjectsSlice,
  GitHubProjectsPanelActions,
  GitHubProjectsPanelEventPayloads,
} from '../panels/GitHubProjectsPanel/types';

export type {
  // WorkspaceCollectionPanel types
  Workspace as WorkspaceCollectionWorkspace,
  WorkspaceCollectionSlice,
  WorkspaceCollectionRepositoriesSlice,
  WorkspaceCollectionPanelActions,
  RepositorySelectedPayload as CollectionRepositorySelectedPayload,
  RepositoryRemovedPayload as WorkspaceRepositoryRemovedPayload,
  RepositoryNavigatePayload,
  WorkspaceCollectionPanelEventPayloads,
} from '../panels/WorkspaceCollectionPanel/types';

export type {
  // WorkspacesListPanel types
  Workspace,
  WorkspacesSlice,
  WorkspacesListPanelActions,
  WorkspaceCardProps,
  WorkspaceSelectedPayload,
  WorkspaceOpenedPayload,
  WorkspaceCreatedPayload,
  WorkspaceDeletedPayload,
  WorkspacesListPanelEventPayloads,
} from '../panels/WorkspacesListPanel/types';

export type {
  // LocalProjectsPanel types
  LocalProjectCardProps,
  RepositoryAvatarProps,
  AlexandriaRepositoriesSlice,
  LocalProjectsPanelActions,
  CardActionMode,
  RepositoryWindowState,
  DiscoveredRepository,
  LocalProjectsPanelEventPayloads,
} from '../panels/LocalProjectsPanel/types';

export type {
  // WorkspaceRepositoriesPanel types
  Workspace as WorkspaceRepositoryWorkspace,
  WorkspaceSlice as WorkspaceRepositoryWorkspaceSlice,
  WorkspaceRepositoriesSlice,
  WorkspaceRepositoriesPanelActions,
  RepositorySelectedPayload as WorkspaceRepositorySelectedPayload,
  RepositoryOpenedPayload,
  WorkspaceRepositoriesPanelEventPayloads,
} from '../panels/WorkspaceRepositoriesPanel/types';

export type {
  // UserProfilePanel types
  GitHubUserProfile,
  GitHubOrganization as UserProfileOrganization,
  GitHubRepository as UserProfileRepository,
  UserProfileSlice,
  UserProfilePanelActions,
  UserProfileView,
  UserPresenceStatus,
  UserProfileCardProps,
  OrganizationCardProps,
  StarredRepositoryCardProps,
  OrganizationSelectedPayload,
  RepositorySelectedPayload as UserRepositorySelectedPayload,
  RepositoryCloneRequestedPayload,
  UserProfilePanelEventPayloads,
} from '../panels/UserProfilePanel/types';

// Shared GitHub types
export type {
  GitHubRepository,
  GitHubOrganization,
  LocalRepositoryReference,
} from '../panels/shared/github-types';

/**
 * Unified Actions Interface
 * Combines all actions from all panels in the package
 */
export interface AlexandriaPanelsActions extends PanelActions {
  // Repository operations
  cloneRepository?: (repo: import('../panels/shared/github-types').GitHubRepository) => Promise<void>;
  openRepository?: (path: string | AlexandriaEntry) => Promise<void>;
  registerRepository?: (name: string, path: string) => Promise<void>;
  removeLocalRepository?: (name: string, deleteLocal: boolean) => Promise<void>;
  focusRepository?: (entry: AlexandriaEntry) => Promise<void>;
  trackRepository?: (name: string, path: string) => Promise<void>;

  // Workspace operations
  createWorkspace?: (name: string, options?: Record<string, unknown>) => Promise<import('../panels/WorkspacesListPanel/types').Workspace>;
  updateWorkspace?: (workspaceId: string, updates: Partial<import('../panels/WorkspacesListPanel/types').Workspace>) => Promise<void>;
  deleteWorkspace?: (workspaceId: string) => Promise<void>;
  setDefaultWorkspace?: (workspaceId: string) => Promise<void>;
  openWorkspace?: (workspaceId: string) => Promise<void>;
  getWorkspaceRepositories?: (workspaceId: string) => Promise<import('../panels/shared/github-types').GitHubRepository[]>;

  // Collection operations
  createCollection?: (name: string, description?: string, icon?: string) => Promise<import('../panels/UserCollectionsPanel/types').Collection>;
  updateCollection?: (collectionId: string, updates: Partial<import('../panels/UserCollectionsPanel/types').Collection>) => Promise<void>;
  deleteCollection?: (collectionId: string) => Promise<void>;
  addRepositoryToCollection?: (collectionId: string, repositoryId: string, metadata?: Record<string, unknown>) => Promise<void>;
  removeRepositoryFromCollection?: (collectionId: string, repositoryId: string) => Promise<void>;
  enableGitHubSync?: () => Promise<void>;
  refreshCollections?: () => Promise<void>;

  // GitHub operations
  refreshStarred?: () => Promise<void>;
  refreshProjects?: () => Promise<void>;
  addToCollection?: (repo: import('../panels/shared/github-types').GitHubRepository) => Promise<void>;

  // Navigation
  navigateToRepository?: (owner: string | AlexandriaEntry, repo?: string) => void;
  previewRepository?: (repository: import('../panels/shared/github-types').GitHubRepository | AlexandriaEntry) => void;
  openInBrowser?: (url: string) => Promise<void>;

  // User profile
  viewOrganization?: (orgLogin: string) => Promise<void>;
  viewRepository?: (owner: string, repo: string) => Promise<void>;
  fetchUserProfile?: (username: string) => Promise<import('../panels/UserProfilePanel/types').GitHubUserProfile>;
  fetchUserOrganizations?: (username: string) => Promise<import('../panels/UserProfilePanel/types').GitHubOrganization[]>;
  fetchUserStarredRepositories?: (username: string) => Promise<import('../panels/shared/github-types').GitHubRepository[]>;

  // Workspace repository operations
  removeRepositoryFromWorkspace?: (repositoryId: string, workspaceId: string) => Promise<void>;
  copyToClipboard?: (text: string) => Promise<void>;
  isRepositoryInWorkspaceDirectory?: (repository: AlexandriaEntry, workspaceId: string) => Promise<boolean | null>;
  moveRepositoryToWorkspaceDirectory?: (repository: AlexandriaEntry, workspaceId: string) => Promise<string>;

  // Utility
  selectDirectory?: () => Promise<{ path: string; name: string } | null>;
  getRepositoryWindowState?: (entry: AlexandriaEntry) => Promise<import('../panels/LocalProjectsPanel/types').RepositoryWindowState>;
}

/**
 * Unified Context Interface
 * Combines all context slices from all panels in the package
 */
export interface AlexandriaPanelsContext extends Record<string, unknown> {
  // Alexandria repositories
  alexandriaRepositories?: DataSlice<import('../panels/LocalProjectsPanel/types').AlexandriaRepositoriesSlice>;

  // Collections
  userCollections?: DataSlice<import('../panels/UserCollectionsPanel/types').UserCollectionsSlice>;

  // Workspaces
  workspaces?: DataSlice<import('../panels/WorkspacesListPanel/types').WorkspacesSlice>;
  workspace?: DataSlice<import('../panels/WorkspaceCollectionPanel/types').WorkspaceCollectionSlice>;
  workspaceRepositories?: DataSlice<import('../panels/WorkspaceCollectionPanel/types').WorkspaceCollectionRepositoriesSlice>;

  // GitHub
  githubStarred?: DataSlice<import('../panels/GitHubStarredPanel/types').GitHubStarredSlice>;
  githubProjects?: DataSlice<import('../panels/GitHubProjectsPanel/types').GitHubProjectsSlice>;

  // User profile
  userProfile?: DataSlice<import('../panels/UserProfilePanel/types').UserProfileSlice>;
}

/**
 * Helper type for panel props with full Alexandria context and actions
 */
export type AlexandriaPanelProps<
  TActions extends PanelActions = AlexandriaPanelsActions,
  TContext extends Record<string, unknown> = AlexandriaPanelsContext
> = PanelComponentProps<TActions, TContext>;
