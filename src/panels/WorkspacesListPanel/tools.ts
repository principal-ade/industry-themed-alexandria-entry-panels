/**
 * UTCP Tools for WorkspacesListPanel
 *
 * These tools allow AI agents to interact with the Workspaces List panel
 * through the Universal Tool Communication Protocol.
 */

import type { PanelTool, PanelToolsMetadata } from '../../types';

const PANEL_ID = 'industry-theme.workspaces-list';

/**
 * Filter workspaces tool
 * Allows filtering the workspace list by search term
 */
export const filterWorkspacesTool: PanelTool = {
  name: 'filter_workspaces',
  description:
    'Filter the workspaces list by workspace name, description, or repository names within workspaces',
  inputs: {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        description:
          'Search term to filter workspaces (matches workspace name, description, or repository names)',
      },
    },
    required: ['filter'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['filter', 'search', 'workspaces'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:filter`,
  },
};

/**
 * Select workspace tool
 * Allows selecting a specific workspace in the list
 */
export const selectWorkspaceTool: PanelTool = {
  name: 'select_workspace',
  description: 'Select a workspace by its ID to view its details and repositories',
  inputs: {
    type: 'object',
    properties: {
      workspaceId: {
        type: 'string',
        description: 'The workspace ID to select',
      },
    },
    required: ['workspaceId'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      selectedWorkspace: { type: 'string' },
    },
  },
  tags: ['select', 'workspace', 'navigation'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-workspace`,
  },
};

/**
 * Open workspace tool
 * Allows opening a workspace in a new window
 */
export const openWorkspaceTool: PanelTool = {
  name: 'open_workspace',
  description: 'Open a workspace in a dedicated window for full workspace management',
  inputs: {
    type: 'object',
    properties: {
      workspaceId: {
        type: 'string',
        description: 'The workspace ID to open',
      },
    },
    required: ['workspaceId'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['open', 'workspace', 'window'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:open-workspace`,
  },
};

/**
 * Create workspace tool
 * Allows creating a new workspace
 */
export const createWorkspaceTool: PanelTool = {
  name: 'create_workspace',
  description: 'Create a new workspace with the specified name and optional description',
  inputs: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name for the new workspace',
      },
      description: {
        type: 'string',
        description: 'Optional description for the workspace',
      },
    },
    required: ['name'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      workspaceId: { type: 'string' },
      message: { type: 'string' },
    },
  },
  tags: ['create', 'workspace', 'new'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:create-workspace`,
  },
};

/**
 * All tools for the WorkspacesListPanel
 */
export const workspacesListPanelTools: PanelTool[] = [
  filterWorkspacesTool,
  selectWorkspaceTool,
  openWorkspaceTool,
  createWorkspaceTool,
];

/**
 * Tools metadata for registration
 */
export const workspacesListPanelToolsMetadata: PanelToolsMetadata = {
  id: PANEL_ID,
  name: 'Workspaces List Panel',
  description: 'Tools for browsing and managing workspaces',
  tools: workspacesListPanelTools,
};
