import { LocalProjectsPanel } from './panels/LocalProjectsPanel';
import { WorkspaceRepositoriesPanel } from './panels/WorkspaceRepositoriesPanel';
import { DependenciesPanel } from './panels/DependenciesPanel';
import type { PanelDefinition, PanelContextValue } from './types';
import { localProjectsPanelTools } from './panels/LocalProjectsPanel/tools';
import { workspaceRepositoriesPanelTools } from './panels/WorkspaceRepositoriesPanel/tools';
import { dependenciesPanelTools } from './panels/DependenciesPanel/tools';

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
      id: 'principal-ade.dependencies-panel',
      name: 'Dependencies',
      icon: 'Package',
      version: '0.1.0',
      author: 'Principal ADE',
      description: 'View and explore package dependencies',
      slices: ['packages'],
      tools: dependenciesPanelTools,
    },
    component: DependenciesPanel,

    onMount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Dependencies Panel mounted');
    },

    onUnmount: async (_context: PanelContextValue) => {
      // eslint-disable-next-line no-console
      console.log('Dependencies Panel unmounting');
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
  dependenciesPanelTools,
  dependenciesPanelToolsMetadata,
  filterDependenciesTool,
  selectDependencyTypeTool,
  selectPackageTool,
} from './panels/DependenciesPanel/tools';

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

export { DependenciesPanel } from './panels/DependenciesPanel';

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
  PackageLayer,
  DependencyItem,
  PackageSummary,
  PackagesSliceData,
} from './panels/DependenciesPanel/types';
