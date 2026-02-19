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
  WorkspaceRepositoriesSlice,
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
  cloneRepository?: (repo: any) => Promise<void>;
  openRepository?: (path: string | AlexandriaEntry) => Promise<void>;
  registerRepository?: (name: string, path: string) => Promise<void>;
  removeLocalRepository?: (name: string, deleteLocal: boolean) => Promise<void>;
  focusRepository?: (entry: AlexandriaEntry) => Promise<void>;
  trackRepository?: (name: string, path: string) => Promise<void>;

  // Workspace operations
  createWorkspace?: (name: string, options?: any) => Promise<any>;
  updateWorkspace?: (workspaceId: string, updates: any) => Promise<void>;
  deleteWorkspace?: (workspaceId: string) => Promise<void>;
  setDefaultWorkspace?: (workspaceId: string) => Promise<void>;
  openWorkspace?: (workspaceId: string) => Promise<void>;
  getWorkspaceRepositories?: (workspaceId: string) => Promise<any[]>;

  // Collection operations
  createCollection?: (name: string, description?: string, icon?: string) => Promise<any>;
  updateCollection?: (collectionId: string, updates: any) => Promise<void>;
  deleteCollection?: (collectionId: string) => Promise<void>;
  addRepositoryToCollection?: (collectionId: string, repositoryId: string, metadata?: any) => Promise<void>;
  removeRepositoryFromCollection?: (collectionId: string, repositoryId: string) => Promise<void>;
  enableGitHubSync?: () => Promise<void>;
  refreshCollections?: () => Promise<void>;

  // GitHub operations
  refreshStarred?: () => Promise<void>;
  refreshProjects?: () => Promise<void>;
  addToCollection?: (repo: any) => Promise<void>;

  // Navigation
  navigateToRepository?: (owner: string | any, repo?: string) => void;
  previewRepository?: (repository: any) => void;
  openInBrowser?: (url: string) => Promise<void>;

  // User profile
  viewOrganization?: (orgLogin: string) => Promise<void>;
  viewRepository?: (owner: string, repo: string) => Promise<void>;
  fetchUserProfile?: (username: string) => Promise<any>;
  fetchUserOrganizations?: (username: string) => Promise<any[]>;
  fetchUserStarredRepositories?: (username: string) => Promise<any[]>;

  // Workspace repository operations
  removeRepositoryFromWorkspace?: (repositoryId: string, workspaceId: string) => Promise<void>;
  copyToClipboard?: (text: string) => Promise<void>;
  isRepositoryInWorkspaceDirectory?: (repository: AlexandriaEntry, workspaceId: string) => Promise<boolean | null>;
  moveRepositoryToWorkspaceDirectory?: (repository: AlexandriaEntry, workspaceId: string) => Promise<string>;

  // Utility
  selectDirectory?: () => Promise<{ path: string; name: string } | null>;
  getRepositoryWindowState?: (entry: AlexandriaEntry) => Promise<any>;
}

/**
 * Unified Context Interface
 * Combines all context slices from all panels in the package
 */
export interface AlexandriaPanelsContext {
  // Alexandria repositories
  alexandriaRepositories?: DataSlice<import('../panels/LocalProjectsPanel/types').AlexandriaRepositoriesSlice>;

  // Collections
  userCollections?: DataSlice<import('../panels/UserCollectionsPanel/types').UserCollectionsSlice>;

  // Workspaces
  workspaces?: DataSlice<import('../panels/WorkspacesListPanel/types').WorkspacesSlice>;
  workspace?: DataSlice<import('../panels/WorkspaceCollectionPanel/types').WorkspaceCollectionSlice>;
  workspaceRepositories?: DataSlice<import('../panels/WorkspaceCollectionPanel/types').WorkspaceRepositoriesSlice>;

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
  TContext extends Record<string, any> = AlexandriaPanelsContext
> = PanelComponentProps<TActions, TContext>;
