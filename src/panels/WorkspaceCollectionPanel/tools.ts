/**
 * Workspace Collection Panel Tools
 *
 * UTCP-compatible tools for the browser-based Workspace Collection panel.
 */

import type { PanelTool, PanelToolsMetadata } from '@principal-ade/panel-framework-core';

const PANEL_ID = 'industry-theme.workspace-collection';

/**
 * Tool: Filter Repositories
 */
export const filterRepositoriesTool: PanelTool = {
  name: 'filter_workspace_collection',
  description: 'Filters repositories in the workspace collection by search term',
  inputs: {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        description: 'Search term to filter repositories by name, owner, or description',
      },
    },
    required: ['filter'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      matchCount: { type: 'number' },
    },
  },
  tags: ['workspace', 'repository', 'filter', 'search'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:filter`,
  },
};

/**
 * Tool: Select Repository
 */
export const selectRepositoryTool: PanelTool = {
  name: 'select_collection_repository',
  description: 'Selects a repository in the workspace collection panel',
  inputs: {
    type: 'object',
    properties: {
      repositoryKey: {
        type: 'string',
        description: 'Repository identifier in "owner/repo" format or just the repository name',
      },
    },
    required: ['repositoryKey'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['workspace', 'repository', 'select'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-repository`,
  },
};

/**
 * Tool: Navigate to Repository
 */
export const navigateRepositoryTool: PanelTool = {
  name: 'navigate_collection_repository',
  description: 'Navigates to the full repository page for a repository in the workspace',
  inputs: {
    type: 'object',
    properties: {
      repositoryKey: {
        type: 'string',
        description: 'Repository identifier in "owner/repo" format or just the repository name',
      },
    },
    required: ['repositoryKey'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['workspace', 'repository', 'navigate', 'open'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:navigate-repository`,
  },
};

/**
 * Tool: Remove Repository from Workspace
 */
export const removeRepositoryTool: PanelTool = {
  name: 'remove_collection_repository',
  description: 'Removes a repository from the current workspace',
  inputs: {
    type: 'object',
    properties: {
      repositoryKey: {
        type: 'string',
        description: 'Repository identifier in "owner/repo" format or just the repository name',
      },
    },
    required: ['repositoryKey'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['workspace', 'repository', 'remove', 'delete'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:remove-repository`,
  },
};

/**
 * Tool: Refresh Workspace Collection
 */
export const refreshWorkspaceCollectionTool: PanelTool = {
  name: 'refresh_workspace_collection',
  description: 'Refreshes the workspace collection repository list',
  inputs: {
    type: 'object',
    properties: {
      force: {
        type: 'boolean',
        description: 'Force refresh even if data is fresh',
      },
    },
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      repositoryCount: { type: 'number' },
    },
  },
  tags: ['workspace', 'refresh'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:refresh-workspace`,
  },
};

/**
 * All tools exported as an array.
 */
export const workspaceCollectionPanelTools: PanelTool[] = [
  filterRepositoriesTool,
  selectRepositoryTool,
  navigateRepositoryTool,
  removeRepositoryTool,
  refreshWorkspaceCollectionTool,
];

/**
 * Panel tools metadata for registration.
 */
export const workspaceCollectionPanelToolsMetadata: PanelToolsMetadata = {
  id: PANEL_ID,
  name: 'Workspace Collection Panel',
  description: 'Tools provided by the browser-based workspace collection panel',
  tools: workspaceCollectionPanelTools,
};
