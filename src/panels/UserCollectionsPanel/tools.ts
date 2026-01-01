/**
 * UTCP Tools for UserCollectionsPanel
 *
 * These tools allow AI agents to interact with the User Collections panel
 * through the Universal Tool Communication Protocol.
 */

import type { PanelTool, PanelToolsMetadata } from '../../types';

const PANEL_ID = 'industry-theme.user-collections';

/**
 * Filter collections tool
 * Allows filtering the collection list by search term
 */
export const filterCollectionsTool: PanelTool = {
  name: 'filter_collections',
  description:
    'Filter the collections list by collection name or description',
  inputs: {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        description:
          'Search term to filter collections (matches collection name or description)',
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
  tags: ['filter', 'search', 'collections'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:filter`,
  },
};

/**
 * Select collection tool
 * Allows selecting a specific collection in the list
 */
export const selectCollectionTool: PanelTool = {
  name: 'select_collection',
  description: 'Select a collection by its ID to view its repositories',
  inputs: {
    type: 'object',
    properties: {
      collectionId: {
        type: 'string',
        description: 'The collection ID to select',
      },
    },
    required: ['collectionId'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      selectedCollection: { type: 'string' },
    },
  },
  tags: ['select', 'collection', 'navigation'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-collection`,
  },
};

/**
 * Create collection tool
 * Allows creating a new collection
 */
export const createCollectionTool: PanelTool = {
  name: 'create_collection',
  description: 'Create a new collection with the specified name and optional description',
  inputs: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name for the new collection',
      },
      description: {
        type: 'string',
        description: 'Optional description for the collection',
      },
    },
    required: ['name'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      collectionId: { type: 'string' },
      message: { type: 'string' },
    },
  },
  tags: ['create', 'collection', 'new'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:create-collection`,
  },
};

/**
 * Delete collection tool
 * Allows deleting a collection
 */
export const deleteCollectionTool: PanelTool = {
  name: 'delete_collection',
  description: 'Delete a collection by its ID',
  inputs: {
    type: 'object',
    properties: {
      collectionId: {
        type: 'string',
        description: 'The collection ID to delete',
      },
    },
    required: ['collectionId'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['delete', 'collection', 'remove'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:delete-collection`,
  },
};

/**
 * Add repository to collection tool
 * Allows adding a repository to a collection
 */
export const addRepositoryTool: PanelTool = {
  name: 'add_repository_to_collection',
  description: 'Add a repository to a collection by specifying the collection ID and repository identifier (owner/repo format)',
  inputs: {
    type: 'object',
    properties: {
      collectionId: {
        type: 'string',
        description: 'The collection ID to add the repository to',
      },
      repositoryId: {
        type: 'string',
        description: 'The repository identifier in owner/repo format (e.g., "facebook/react")',
      },
    },
    required: ['collectionId', 'repositoryId'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['add', 'repository', 'collection'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:add-repository`,
  },
};

/**
 * Remove repository from collection tool
 * Allows removing a repository from a collection
 */
export const removeRepositoryTool: PanelTool = {
  name: 'remove_repository_from_collection',
  description: 'Remove a repository from a collection',
  inputs: {
    type: 'object',
    properties: {
      collectionId: {
        type: 'string',
        description: 'The collection ID to remove the repository from',
      },
      repositoryId: {
        type: 'string',
        description: 'The repository identifier in owner/repo format',
      },
    },
    required: ['collectionId', 'repositoryId'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  tags: ['remove', 'repository', 'collection'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:remove-repository`,
  },
};

/**
 * Enable GitHub sync tool
 * Allows enabling GitHub sync for collections
 */
export const enableGitHubSyncTool: PanelTool = {
  name: 'enable_github_sync',
  description: 'Enable GitHub sync to persist collections to a web-ade-collections repository',
  inputs: {
    type: 'object',
    properties: {},
    required: [],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      repoUrl: { type: 'string' },
      message: { type: 'string' },
    },
  },
  tags: ['github', 'sync', 'enable'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:enable-github-sync`,
  },
};

/**
 * Refresh collections tool
 * Allows refreshing collections from GitHub
 */
export const refreshCollectionsTool: PanelTool = {
  name: 'refresh_collections',
  description: 'Refresh collections from GitHub to get the latest data',
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
  tags: ['refresh', 'collections', 'sync'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:refresh-collections`,
  },
};

/**
 * All tools for the UserCollectionsPanel
 */
export const userCollectionsPanelTools: PanelTool[] = [
  filterCollectionsTool,
  selectCollectionTool,
  createCollectionTool,
  deleteCollectionTool,
  addRepositoryTool,
  removeRepositoryTool,
  enableGitHubSyncTool,
  refreshCollectionsTool,
];

/**
 * Tools metadata for registration
 */
export const userCollectionsPanelToolsMetadata: PanelToolsMetadata = {
  id: PANEL_ID,
  name: 'User Collections Panel',
  description: 'Tools for browsing and managing user repository collections',
  tools: userCollectionsPanelTools,
};
