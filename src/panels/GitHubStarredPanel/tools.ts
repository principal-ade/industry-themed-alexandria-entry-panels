/**
 * GitHubStarredPanel UTCP Tools
 *
 * Server-safe tools for AI agent interaction with the GitHub Starred panel.
 * These tools emit panel events that the panel component listens to.
 */

import type { PanelTool, PanelToolsMetadata } from '../../types';

const PANEL_ID = 'industry-theme.github-starred';

/**
 * Filter starred repositories by name, owner, or language
 */
export const filterStarredTool: PanelTool = {
  name: 'filter_starred_repositories',
  description:
    'Filter the starred repositories list by repository name, owner, language, or description',
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
  tags: ['filter', 'search', 'starred', 'github'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:filter`,
  },
};

/**
 * Select a starred repository
 */
export const selectStarredRepositoryTool: PanelTool = {
  name: 'select_starred_repository',
  description:
    'Select a starred repository by its name or full name (owner/repo)',
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
  tags: ['select', 'starred', 'github', 'repository'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-repository`,
  },
};

/**
 * Clone a starred repository
 */
export const cloneStarredRepositoryTool: PanelTool = {
  name: 'clone_starred_repository',
  description: 'Clone a starred repository to the local machine',
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
  tags: ['clone', 'starred', 'github', 'repository'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:clone-repository`,
  },
};

/**
 * All tools for the GitHubStarredPanel
 */
export const githubStarredPanelTools: PanelTool[] = [
  filterStarredTool,
  selectStarredRepositoryTool,
  cloneStarredRepositoryTool,
];

/**
 * Tools metadata for registration
 */
export const githubStarredPanelToolsMetadata: PanelToolsMetadata = {
  id: PANEL_ID,
  name: 'GitHub Starred Panel',
  description: 'Tools for browsing and managing starred GitHub repositories',
  tools: githubStarredPanelTools,
};
