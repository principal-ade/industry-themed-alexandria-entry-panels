/**
 * Panel Tools
 *
 * UTCP-compatible tools for this panel extension.
 * These tools can be invoked by AI agents and emit events that panels listen for.
 *
 * IMPORTANT: This file should NOT import any React components to ensure
 * it can be imported server-side without pulling in React dependencies.
 * Use the './tools' subpath export for server-safe imports.
 */

// Re-export all tools from individual panels
export {
  localProjectsPanelTools,
  localProjectsPanelToolsMetadata,
  filterProjectsTool,
  selectProjectTool,
  openProjectTool,
} from '../panels/LocalProjectsPanel/tools';

export {
  workspaceRepositoriesPanelTools,
  workspaceRepositoriesPanelToolsMetadata,
  selectRepositoryTool,
  refreshWorkspaceTool,
  openRepositoryTool,
} from '../panels/WorkspaceRepositoriesPanel/tools';

export {
  workspacesListPanelTools,
  workspacesListPanelToolsMetadata,
  filterWorkspacesTool,
  selectWorkspaceTool,
  openWorkspaceTool,
  createWorkspaceTool,
} from '../panels/WorkspacesListPanel/tools';

export {
  dependenciesPanelTools,
  dependenciesPanelToolsMetadata,
  filterDependenciesTool,
  selectDependencyTypeTool,
  selectPackageTool,
} from '../panels/DependenciesPanel/tools';
