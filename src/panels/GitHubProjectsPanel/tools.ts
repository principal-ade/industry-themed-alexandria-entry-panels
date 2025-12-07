/**
 * GitHubProjectsPanel UTCP Tools
 *
 * Server-safe tools for AI agent interaction with the GitHub Projects panel.
 * These tools emit panel events that the panel component listens to.
 */

import type { PanelTool, PanelToolsMetadata } from '../../types';

const PANEL_ID = 'industry-theme.github-projects';

/**
 * Filter projects by name, owner, or language
 */
export const filterProjectsTool: PanelTool = {
  name: 'filter_github_projects',
  description:
    'Filter the GitHub projects list by repository name, owner, language, or description',
  inputs: {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        description:
          'Search term to filter repositories (matches name, owner, language, or description)',
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
  tags: ['filter', 'search', 'projects', 'github'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:filter`,
  },
};

/**
 * Toggle owner section visibility
 */
export const toggleOwnerSectionTool: PanelTool = {
  name: 'toggle_owner_section',
  description:
    'Expand or collapse an owner section (user or organization) in the projects panel',
  inputs: {
    type: 'object',
    properties: {
      owner: {
        type: 'string',
        description: 'The owner name (username or organization login) to toggle',
      },
    },
    required: ['owner'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      collapsed: { type: 'boolean' },
    },
  },
  tags: ['toggle', 'section', 'projects', 'github'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:toggle-section`,
  },
};

/**
 * Select a project repository
 */
export const selectProjectRepositoryTool: PanelTool = {
  name: 'select_project_repository',
  description: 'Select a project repository by its name or full name (owner/repo)',
  inputs: {
    type: 'object',
    properties: {
      identifier: {
        type: 'string',
        description:
          'Repository identifier - can be the repository name or full name (owner/repo)',
      },
    },
    required: ['identifier'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      repository: {
        type: 'object',
        description: 'The selected repository data',
      },
    },
  },
  tags: ['select', 'projects', 'github', 'repository'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-repository`,
  },
};

/**
 * Clone a project repository
 */
export const cloneProjectRepositoryTool: PanelTool = {
  name: 'clone_project_repository',
  description: 'Clone a project repository to the local machine',
  inputs: {
    type: 'object',
    properties: {
      identifier: {
        type: 'string',
        description:
          'Repository identifier - can be the repository name or full name (owner/repo)',
      },
    },
    required: ['identifier'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      localPath: {
        type: 'string',
        description: 'Path where the repository was cloned',
      },
    },
  },
  tags: ['clone', 'projects', 'github', 'repository'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:clone-repository`,
  },
};

/**
 * All tools for the GitHubProjectsPanel
 */
export const githubProjectsPanelTools: PanelTool[] = [
  filterProjectsTool,
  toggleOwnerSectionTool,
  selectProjectRepositoryTool,
  cloneProjectRepositoryTool,
];

/**
 * Tools metadata for registration
 */
export const githubProjectsPanelToolsMetadata: PanelToolsMetadata = {
  id: PANEL_ID,
  name: 'GitHub Projects Panel',
  description:
    'Tools for browsing and managing your GitHub repositories and organization repositories',
  tools: githubProjectsPanelTools,
};
