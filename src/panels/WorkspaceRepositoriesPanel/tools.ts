/**
 * Workspace Repositories Panel Tools
 *
 * UTCP-compatible tools for the Workspace Repositories panel.
 */

import type { PanelTool, PanelToolsMetadata } from '@principal-ade/panel-framework-core';

const PANEL_ID = 'industry-theme.workspace-repositories';

/**
 * Tool: Select Repository
 */
export const selectRepositoryTool: PanelTool = {
  name: 'select_workspace_repository',
  description: 'Selects a repository in the workspace panel',
  inputs: {
    type: 'object',
    properties: {
      repositoryPath: {
        type: 'string',
        description: 'Path to the repository to select',
      },
    },
    required: ['repositoryPath'],
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
 * Tool: Refresh Workspace
 */
export const refreshWorkspaceTool: PanelTool = {
  name: 'refresh_workspace',
  description: 'Refreshes the workspace repositories list',
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
 * Tool: Open Repository
 */
export const openRepositoryTool: PanelTool = {
  name: 'open_workspace_repository',
  description: 'Opens a repository from the workspace',
  inputs: {
    type: 'object',
    properties: {
      repositoryPath: {
        type: 'string',
        description: 'Path to the repository to open',
      },
    },
    required: ['repositoryPath'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['workspace', 'repository', 'open'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:open-repository`,
  },
};

/**
 * All tools exported as an array.
 */
export const workspaceRepositoriesPanelTools: PanelTool[] = [
  selectRepositoryTool,
  refreshWorkspaceTool,
  openRepositoryTool,
];

/**
 * Panel tools metadata for registration.
 */
export const workspaceRepositoriesPanelToolsMetadata: PanelToolsMetadata = {
  id: PANEL_ID,
  name: 'Workspace Repositories Panel',
  description: 'Tools provided by the workspace repositories panel',
  tools: workspaceRepositoriesPanelTools,
};
