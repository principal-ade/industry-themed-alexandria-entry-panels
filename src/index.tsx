import { LocalProjectsPanel } from './panels/LocalProjectsPanel';
import type { PanelDefinition, PanelContextValue } from './types';
import { localProjectsPanelTools } from './panels/LocalProjectsPanel/tools';

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

/**
 * Export panel components for direct use
 */
export {
  LocalProjectsPanel,
  LocalProjectsPanelPreview,
  LocalProjectCard,
  RepositoryAvatar,
} from './panels/LocalProjectsPanel';

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
