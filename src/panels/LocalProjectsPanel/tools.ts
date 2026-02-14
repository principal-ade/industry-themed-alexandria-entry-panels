/**
 * UTCP Tools for LocalProjectsPanel
 *
 * These tools allow AI agents to interact with the Local Projects panel
 * through the Universal Tool Communication Protocol.
 */

import type { PanelTool, PanelToolsMetadata } from '../../types';

const PANEL_ID = 'industry-theme.local-projects';

/**
 * Filter projects tool
 * Allows filtering the project list by search term
 */
export const filterProjectsTool: PanelTool = {
  name: 'filter_projects',
  description: 'Filter the local projects list by name, owner, or path',
  inputs: {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        description:
          'Search term to filter projects (matches name, owner, or path)',
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
  tags: ['filter', 'search', 'projects'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:filter`,
  },
};

/**
 * Select project tool
 * Allows selecting a specific project in the list
 */
export const selectProjectTool: PanelTool = {
  name: 'select_project',
  description: 'Select a project by name or path to view its details',
  inputs: {
    type: 'object',
    properties: {
      identifier: {
        type: 'string',
        description: 'Project name or full path to select',
      },
    },
    required: ['identifier'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      selectedProject: { type: 'string' },
    },
  },
  tags: ['select', 'project', 'navigation'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-repository`,
  },
};

/**
 * Open project tool
 * Allows opening a project in the dev workspace
 */
export const openProjectTool: PanelTool = {
  name: 'open_project',
  description: 'Open a local project in the development workspace',
  inputs: {
    type: 'object',
    properties: {
      identifier: {
        type: 'string',
        description: 'Project name or full path to open',
      },
    },
    required: ['identifier'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['open', 'project', 'workspace'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:open-repository`,
  },
};

/**
 * All tools for the LocalProjectsPanel
 */
export const localProjectsPanelTools: PanelTool[] = [
  filterProjectsTool,
  selectProjectTool,
  openProjectTool,
];

/**
 * Tools metadata for registration
 */
export const localProjectsPanelToolsMetadata: PanelToolsMetadata = {
  id: PANEL_ID,
  name: 'Local Projects Panel',
  description: 'Tools for browsing and managing local Alexandria repositories',
  tools: localProjectsPanelTools,
};
