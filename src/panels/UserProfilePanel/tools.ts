/**
 * UTCP Tools for UserProfilePanel
 *
 * These tools allow AI agents to interact with the User Profile panel
 * through the Universal Tool Communication Protocol.
 */

import type { PanelTool, PanelToolsMetadata } from '../../types';

const PANEL_ID = 'industry-theme.user-profile';

/**
 * View organizations tool
 * Switches the panel view to show organizations
 */
export const viewOrganizationsTool: PanelTool = {
  name: 'view_user_organizations',
  description:
    "Switch to the organizations tab to view the user's GitHub organizations",
  inputs: {
    type: 'object',
    properties: {},
    required: [],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['view', 'organizations', 'user'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:set-view`,
  },
};

/**
 * View starred repositories tool
 * Switches the panel view to show starred repositories
 */
export const viewStarredTool: PanelTool = {
  name: 'view_user_starred',
  description:
    "Switch to the starred tab to view the user's starred GitHub repositories",
  inputs: {
    type: 'object',
    properties: {},
    required: [],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['view', 'starred', 'repositories', 'user'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:set-view`,
  },
};

/**
 * Select organization tool
 * Selects an organization to view its details
 */
export const selectOrganizationTool: PanelTool = {
  name: 'select_organization',
  description:
    'Select a GitHub organization to view its details and repositories',
  inputs: {
    type: 'object',
    properties: {
      orgLogin: {
        type: 'string',
        description: 'The organization login/username to select',
      },
    },
    required: ['orgLogin'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      selectedOrganization: { type: 'string' },
    },
  },
  tags: ['select', 'organization', 'navigation'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-organization`,
  },
};

/**
 * Select repository tool
 * Selects a starred repository to view its details
 */
export const selectRepositoryTool: PanelTool = {
  name: 'select_starred_repository',
  description: 'Select a starred repository to view its details',
  inputs: {
    type: 'object',
    properties: {
      owner: {
        type: 'string',
        description: 'The repository owner (user or organization)',
      },
      repo: {
        type: 'string',
        description: 'The repository name',
      },
    },
    required: ['owner', 'repo'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      selectedRepository: { type: 'string' },
    },
  },
  tags: ['select', 'repository', 'starred', 'navigation'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-repository`,
  },
};

/**
 * Clone repository tool
 * Initiates cloning a starred repository
 */
export const cloneRepositoryTool: PanelTool = {
  name: 'clone_starred_repository',
  description:
    "Clone one of the user's starred repositories to your local machine",
  inputs: {
    type: 'object',
    properties: {
      owner: {
        type: 'string',
        description: 'The repository owner',
      },
      repo: {
        type: 'string',
        description: 'The repository name',
      },
    },
    required: ['owner', 'repo'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['clone', 'repository', 'starred'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:clone-repository`,
  },
};

/**
 * Filter starred repositories tool
 * Filters the starred repositories by search term
 */
export const filterStarredTool: PanelTool = {
  name: 'filter_starred_repositories',
  description:
    'Filter the starred repositories list by name, description, or language',
  inputs: {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        description: 'Search term to filter repositories',
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
  tags: ['filter', 'search', 'starred', 'repositories'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:filter-starred`,
  },
};

/**
 * All tools for the UserProfilePanel
 */
export const userProfilePanelTools: PanelTool[] = [
  viewOrganizationsTool,
  viewStarredTool,
  selectOrganizationTool,
  selectRepositoryTool,
  cloneRepositoryTool,
  filterStarredTool,
];

/**
 * Tools metadata for registration
 */
export const userProfilePanelToolsMetadata: PanelToolsMetadata = {
  id: PANEL_ID,
  name: 'User Profile Panel',
  description:
    'Tools for viewing user profiles, their organizations, and starred repositories',
  tools: userProfilePanelTools,
};
