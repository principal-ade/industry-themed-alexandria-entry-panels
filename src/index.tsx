import { LocalProjectsPanel } from './panels/LocalProjectsPanel';
import { WorkspaceRepositoriesPanel } from './panels/WorkspaceRepositoriesPanel';
import { WorkspacesListPanel } from './panels/WorkspacesListPanel';
import { GitHubStarredPanel } from './panels/GitHubStarredPanel';
import { GitHubProjectsPanel } from './panels/GitHubProjectsPanel';
import type { PanelDefinition, PanelContextValue } from './types';
import { localProjectsPanelTools } from './panels/LocalProjectsPanel/tools';
import { workspaceRepositoriesPanelTools } from './panels/WorkspaceRepositoriesPanel/tools';
import { workspacesListPanelTools } from './panels/WorkspacesListPanel/tools';
import { githubStarredPanelTools } from './panels/GitHubStarredPanel/tools';
import { githubProjectsPanelTools } from './panels/GitHubProjectsPanel/tools';

/**
 * Export array of panel definitions.
 * This is the required export for panel extensions.
 */
export const panels: PanelDefinition[] = [
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
        await context.refresh('global', 'githubStarred');
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
        await context.refresh('global', 'githubProjects');
      }
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('GitHub Projects Panel unmounting');
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

/**
 * Export panel components for direct use
 */
export {
  LocalProjectsPanel,
  LocalProjectsPanelPreview,
  LocalProjectCard,
  RepositoryAvatar,
} from './panels/LocalProjectsPanel';

export { WorkspaceRepositoriesPanel } from './panels/WorkspaceRepositoriesPanel';

export {
  WorkspacesListPanel,
  WorkspacesListPanelPreview,
  WorkspaceCard,
} from './panels/WorkspacesListPanel';

export {
  GitHubStarredPanel,
  GitHubStarredPanelPreview,
} from './panels/GitHubStarredPanel';

export {
  GitHubProjectsPanel,
  GitHubProjectsPanelPreview,
} from './panels/GitHubProjectsPanel';

export { GitHubRepositoryCard } from './panels/shared/GitHubRepositoryCard';

/**
 * Export types
 */
export type {
  LocalProjectCardProps,
  RepositoryAvatarProps,
  AlexandriaRepositoriesSlice,
  LocalProjectsPanelActions,
  CardActionMode,
  RepositoryWindowState,
} from './panels/LocalProjectsPanel/types';

export type {
  Workspace,
  WorkspaceRepositoriesPanelActions,
  RepositorySelectedPayload,
  RepositoryOpenedPayload,
} from './panels/WorkspaceRepositoriesPanel/types';

export type {
  WorkspacesSlice,
  WorkspacesListPanelActions,
  WorkspaceCardProps,
  WorkspaceSelectedPayload,
  WorkspaceOpenedPayload,
  WorkspaceCreatedPayload,
  WorkspaceDeletedPayload,
} from './panels/WorkspacesListPanel/types';

export type {
  GitHubRepository,
  GitHubOrganization,
  LocalRepositoryReference,
} from './panels/shared/github-types';

export type {
  GitHubStarredSlice,
  GitHubStarredPanelActions,
  GitHubStarredPanelEventPayloads,
} from './panels/GitHubStarredPanel/types';

export type {
  GitHubProjectsSlice,
  GitHubProjectsPanelActions,
  GitHubProjectsPanelEventPayloads,
} from './panels/GitHubProjectsPanel/types';

export type { GitHubRepositoryCardProps } from './panels/shared/GitHubRepositoryCard';

