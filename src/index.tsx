import { LocalProjectsPanel } from './panels/LocalProjectsPanel';
import { WorkspaceRepositoriesPanel } from './panels/WorkspaceRepositoriesPanel';
import { WorkspacesListPanel } from './panels/WorkspacesListPanel';
import { WorkspaceCollectionPanel } from './panels/WorkspaceCollectionPanel';
import { GitHubStarredPanel } from './panels/GitHubStarredPanel';
import { GitHubProjectsPanel } from './panels/GitHubProjectsPanel';
import { UserProfilePanel } from './panels/UserProfilePanel';
import { UserCollectionsPanel } from './panels/UserCollectionsPanel';
import type { PanelDefinition, PanelContextValue } from './types';
import { localProjectsPanelTools } from './panels/LocalProjectsPanel/tools';
import { workspaceRepositoriesPanelTools } from './panels/WorkspaceRepositoriesPanel/tools';
import { workspacesListPanelTools } from './panels/WorkspacesListPanel/tools';
import { workspaceCollectionPanelTools } from './panels/WorkspaceCollectionPanel/tools';
import { githubStarredPanelTools } from './panels/GitHubStarredPanel/tools';
import { githubProjectsPanelTools } from './panels/GitHubProjectsPanel/tools';
import { userProfilePanelTools } from './panels/UserProfilePanel/tools';
import { userCollectionsPanelTools } from './panels/UserCollectionsPanel/tools';

// Import panel-specific types for proper typing
import type {
  LocalProjectsPanelActions,
  LocalProjectsPanelContext,
} from './panels/LocalProjectsPanel/types';
import type {
  WorkspaceRepositoriesPanelActions,
  WorkspaceRepositoriesPanelContext,
} from './panels/WorkspaceRepositoriesPanel/types';
import type {
  WorkspacesListPanelActions,
  WorkspacesListPanelContext,
} from './panels/WorkspacesListPanel/types';
import type {
  WorkspaceCollectionPanelActions,
  WorkspaceCollectionPanelContext,
} from './panels/WorkspaceCollectionPanel/types';
import type {
  GitHubStarredPanelActions,
  GitHubStarredPanelContext,
} from './panels/GitHubStarredPanel/types';
import type {
  GitHubProjectsPanelActions,
  GitHubProjectsPanelContext,
} from './panels/GitHubProjectsPanel/types';
import type {
  UserProfilePanelActions,
  UserProfilePanelContext,
} from './panels/UserProfilePanel/types';
import type {
  UserCollectionsPanelActions,
  UserCollectionsPanelContext,
} from './panels/UserCollectionsPanel/types';

/**
 * Union type of all panel definitions with their specific typed contexts
 */
type AlexandriaPanelDefinition =
  | PanelDefinition<LocalProjectsPanelActions, LocalProjectsPanelContext>
  | PanelDefinition<WorkspaceRepositoriesPanelActions, WorkspaceRepositoriesPanelContext>
  | PanelDefinition<WorkspacesListPanelActions, WorkspacesListPanelContext>
  | PanelDefinition<WorkspaceCollectionPanelActions, WorkspaceCollectionPanelContext>
  | PanelDefinition<GitHubStarredPanelActions, GitHubStarredPanelContext>
  | PanelDefinition<GitHubProjectsPanelActions, GitHubProjectsPanelContext>
  | PanelDefinition<UserProfilePanelActions, UserProfilePanelContext>
  | PanelDefinition<UserCollectionsPanelActions, UserCollectionsPanelContext>;

/**
 * Export array of panel definitions.
 * This is the required export for panel extensions.
 * Each panel has its typed actions and context requirements.
 */
export const panels: AlexandriaPanelDefinition[] = [
  {
    metadata: {
      id: 'industry-theme.local-projects',
      name: 'Local Projects',
      icon: 'Folder',
      version: '0.1.0',
      author: 'Industry Theme',
      description: 'Browse and manage local Alexandria repositories',
      slices: ['alexandriaRepositories'],
      tools: localProjectsPanelTools,
    },
    component: LocalProjectsPanel,

    onMount: async (context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Local Projects Panel mounted');

      // Refresh Alexandria repositories if available
      if (
        context.hasSlice('alexandriaRepositories') &&
        !context.isSliceLoading('alexandriaRepositories')
      ) {
        await context.refresh('repository', 'alexandriaRepositories');
      }
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Local Projects Panel unmounting');
    },
  },
  {
    metadata: {
      id: 'industry-theme.workspace-repositories',
      name: 'Workspace Repositories',
      icon: 'FolderGit2',
      version: '0.1.0',
      author: 'Industry Theme',
      description: 'Workspace and repository management panel',
      slices: ['workspace', 'workspaceRepositories'],
      tools: workspaceRepositoriesPanelTools,
    },
    component: WorkspaceRepositoriesPanel,

    onMount: async (context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Workspace Repositories Panel mounted');
      // eslint-disable-next-line no-console
      console.log('Current scope:', context.currentScope.type);
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Workspace Repositories Panel unmounting');
    },
  },
  {
    metadata: {
      id: 'industry-theme.workspaces-list',
      name: 'Workspaces',
      icon: 'Layers',
      version: '0.1.0',
      author: 'Industry Theme',
      description: 'Browse and manage workspaces',
      slices: ['workspaces'],
      tools: workspacesListPanelTools,
    },
    component: WorkspacesListPanel,

    onMount: async (context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Workspaces List Panel mounted');

      // Refresh workspaces if available
      if (
        context.hasSlice('workspaces') &&
        !context.isSliceLoading('workspaces')
      ) {
        await context.refresh('workspace', 'workspaces');
      }
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Workspaces List Panel unmounting');
    },
  },
  {
    metadata: {
      id: 'industry-theme.workspace-collection',
      name: 'Workspace Collection',
      icon: 'FolderOpen',
      version: '0.1.0',
      author: 'Industry Theme',
      description: 'Browse repositories in a workspace (browser)',
      slices: ['workspace', 'workspaceRepositories'],
      tools: workspaceCollectionPanelTools,
    },
    component: WorkspaceCollectionPanel,

    onMount: async (context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Workspace Collection Panel mounted');
      // eslint-disable-next-line no-console
      console.log('Current scope:', context.currentScope.type);
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Workspace Collection Panel unmounting');
    },
  },
  {
    metadata: {
      id: 'industry-theme.github-starred',
      name: 'Starred',
      icon: 'Star',
      version: '0.1.0',
      author: 'Industry Theme',
      description: 'Browse your starred GitHub repositories',
      slices: ['githubStarred', 'alexandriaRepositories'],
      tools: githubStarredPanelTools,
    },
    component: GitHubStarredPanel,

    onMount: async (context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('GitHub Starred Panel mounted');

      if (
        context.hasSlice('githubStarred') &&
        !context.isSliceLoading('githubStarred')
      ) {
        await context.refresh(undefined, 'githubStarred');
      }
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('GitHub Starred Panel unmounting');
    },
  },
  {
    metadata: {
      id: 'industry-theme.github-projects',
      name: 'GitHub Projects',
      icon: 'FolderGit2',
      version: '0.1.0',
      author: 'Industry Theme',
      description: 'Your repositories and organization projects',
      slices: ['githubProjects', 'alexandriaRepositories'],
      tools: githubProjectsPanelTools,
    },
    component: GitHubProjectsPanel,

    onMount: async (context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('GitHub Projects Panel mounted');

      if (
        context.hasSlice('githubProjects') &&
        !context.isSliceLoading('githubProjects')
      ) {
        await context.refresh(undefined, 'githubProjects');
      }
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('GitHub Projects Panel unmounting');
    },
  },
  {
    metadata: {
      id: 'industry-theme.user-profile',
      name: 'User Profile',
      icon: 'User',
      version: '0.1.0',
      author: 'Industry Theme',
      description:
        'View user profiles, organizations, and starred repositories',
      slices: ['userProfile'],
      tools: userProfilePanelTools,
    },
    component: UserProfilePanel,

    onMount: async (context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('User Profile Panel mounted');

      if (
        context.hasSlice('userProfile') &&
        !context.isSliceLoading('userProfile')
      ) {
        await context.refresh(undefined, 'userProfile');
      }
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('User Profile Panel unmounting');
    },
  },
  {
    metadata: {
      id: 'industry-theme.user-collections',
      name: 'Collections',
      icon: 'FolderOpen',
      version: '0.1.0',
      author: 'Industry Theme',
      description: 'Organize repositories into collections that sync to GitHub',
      slices: ['userCollections'],
      tools: userCollectionsPanelTools,
    },
    component: UserCollectionsPanel,

    onMount: async (context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('User Collections Panel mounted');

      if (
        context.hasSlice('userCollections') &&
        !context.isSliceLoading('userCollections')
      ) {
        await context.refresh(undefined, 'userCollections');
      }
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('User Collections Panel unmounting');
    },
  },
];

/**
 * Optional: Called once when the entire package is loaded.
 */
export const onPackageLoad = async () => {
  // eslint-disable-next-line no-console
  console.log('Alexandria Panels package loaded');
};

/**
 * Optional: Called once when the package is unloaded.
 */
export const onPackageUnload = async () => {
  // eslint-disable-next-line no-console
  console.log('Alexandria Panels package unloading');
};

/**
 * Export tools for server-safe imports.
 * Use '@industry-theme/alexandria-panels/tools' to import without React dependencies.
 */
export {
  localProjectsPanelTools,
  localProjectsPanelToolsMetadata,
  filterProjectsTool,
  selectProjectTool,
  openProjectTool,
} from './panels/LocalProjectsPanel/tools';

export {
  workspaceRepositoriesPanelTools,
  workspaceRepositoriesPanelToolsMetadata,
  selectRepositoryTool,
  refreshWorkspaceTool,
  openRepositoryTool,
} from './panels/WorkspaceRepositoriesPanel/tools';

export {
  workspacesListPanelTools,
  workspacesListPanelToolsMetadata,
  filterWorkspacesTool,
  selectWorkspaceTool,
  openWorkspaceTool,
  createWorkspaceTool,
} from './panels/WorkspacesListPanel/tools';

export {
  workspaceCollectionPanelTools,
  workspaceCollectionPanelToolsMetadata,
  filterRepositoriesTool,
  selectRepositoryTool as selectCollectionRepositoryTool,
  navigateRepositoryTool,
  removeRepositoryTool,
  refreshWorkspaceCollectionTool,
} from './panels/WorkspaceCollectionPanel/tools';

export {
  githubStarredPanelTools,
  githubStarredPanelToolsMetadata,
  filterStarredTool,
  selectStarredRepositoryTool,
  cloneStarredRepositoryTool,
} from './panels/GitHubStarredPanel/tools';

export {
  githubProjectsPanelTools,
  githubProjectsPanelToolsMetadata,
  filterProjectsTool as filterGitHubProjectsTool,
  toggleOwnerSectionTool,
  selectProjectRepositoryTool,
  cloneProjectRepositoryTool,
} from './panels/GitHubProjectsPanel/tools';

export {
  userProfilePanelTools,
  userProfilePanelToolsMetadata,
  viewOrganizationsTool,
  viewStarredTool,
  selectOrganizationTool,
  selectRepositoryTool as selectUserRepositoryTool,
  cloneRepositoryTool as cloneUserRepositoryTool,
  filterStarredTool as filterUserStarredTool,
} from './panels/UserProfilePanel/tools';

export {
  userCollectionsPanelTools,
  userCollectionsPanelToolsMetadata,
  filterCollectionsTool,
  selectCollectionTool,
  createCollectionTool,
  deleteCollectionTool,
  addRepositoryTool as addCollectionRepositoryTool,
  removeRepositoryTool as removeCollectionRepositoryTool,
  enableGitHubSyncTool,
  refreshCollectionsTool,
} from './panels/UserCollectionsPanel/tools';

/**
 * Export panel components for direct use
 */
export {
  LocalProjectsPanel,
  LocalProjectsPanelPreview,
  LocalProjectCard,
  RepositoryAvatar,
  type LocalProjectsPanelProps,
} from './panels/LocalProjectsPanel';

export { WorkspaceRepositoriesPanel } from './panels/WorkspaceRepositoriesPanel';

export {
  WorkspacesListPanel,
  WorkspacesListPanelPreview,
  WorkspaceCard,
  type WorkspacesListPanelProps,
} from './panels/WorkspacesListPanel';

export {
  WorkspaceCollectionPanel,
  WorkspaceCollectionPanelPreview,
  type WorkspaceCollectionPanelProps,
} from './panels/WorkspaceCollectionPanel';

export {
  GitHubStarredPanel,
  GitHubStarredPanelPreview,
  type GitHubStarredPanelProps,
} from './panels/GitHubStarredPanel';

export {
  GitHubProjectsPanel,
  GitHubProjectsPanelPreview,
  type GitHubProjectsPanelProps,
} from './panels/GitHubProjectsPanel';

export {
  UserProfilePanel,
  UserProfilePanelPreview,
} from './panels/UserProfilePanel';

export {
  UserCollectionsPanel,
  UserCollectionsPanelPreview,
  type UserCollectionsPanelProps,
} from './panels/UserCollectionsPanel';

export { GitHubRepositoryCard } from './panels/shared/GitHubRepositoryCard';

/**
 * Export types
 */
export type {
  LocalProjectCardProps,
  RepositoryAvatarProps,
  AlexandriaRepositoriesSlice,
  LocalProjectsPanelActions,
  LocalProjectsPanelContext,
  CardActionMode,
  RepositoryWindowState,
  DiscoveredRepository,
} from './panels/LocalProjectsPanel/types';

export type {
  Workspace,
  WorkspaceSlice,
  WorkspaceRepositoriesPanelActions,
  WorkspaceRepositoriesPanelContext,
  RepositorySelectedPayload,
  RepositoryOpenedPayload,
} from './panels/WorkspaceRepositoriesPanel/types';

export type {
  WorkspacesSlice,
  WorkspacesListPanelActions,
  WorkspacesListPanelContext,
  WorkspaceCardProps,
  WorkspaceSelectedPayload,
  WorkspaceOpenedPayload,
  WorkspaceCreatedPayload,
  WorkspaceDeletedPayload,
} from './panels/WorkspacesListPanel/types';

export type {
  Workspace as WorkspaceCollectionWorkspace,
  WorkspaceCollectionSlice,
  WorkspaceRepositoriesSlice,
  WorkspaceCollectionPanelActions,
  RepositorySelectedPayload as CollectionRepositorySelectedPayload,
  RepositoryRemovedPayload,
  RepositoryNavigatePayload,
  WorkspaceCollectionPanelEventPayloads,
} from './panels/WorkspaceCollectionPanel/types';

export type {
  GitHubRepository,
  GitHubOrganization,
  LocalRepositoryReference,
} from './panels/shared/github-types';

export type {
  GitHubStarredSlice,
  GitHubStarredPanelActions,
  GitHubStarredPanelContext,
  GitHubStarredPanelEventPayloads,
} from './panels/GitHubStarredPanel/types';

export type {
  GitHubProjectsSlice,
  GitHubProjectsPanelActions,
  GitHubProjectsPanelContext,
  GitHubProjectsPanelEventPayloads,
} from './panels/GitHubProjectsPanel/types';

export type {
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
} from './panels/UserProfilePanel/types';

export type { GitHubRepositoryCardProps } from './panels/shared/GitHubRepositoryCard';

export type {
  Collection,
  CollectionMembership,
  UserCollectionsSlice,
  UserCollectionsPanelActions,
  UserCollectionsPanelContext,
  CollectionCardProps,
  CollectionSelectedPayload,
  CollectionCreatedPayload,
  CollectionDeletedPayload,
  RepositoryAddedPayload as CollectionRepositoryAddedPayload,
  RepositoryRemovedPayload as CollectionRepositoryRemovedPayload,
  UserCollectionsPanelEventPayloads,
} from './panels/UserCollectionsPanel/types';
