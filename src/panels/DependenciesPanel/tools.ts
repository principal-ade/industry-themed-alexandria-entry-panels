/**
 * Dependencies Panel Tools
 *
 * UTCP-compatible tools for the Dependencies panel extension.
 * These tools can be invoked by AI agents and emit events that panels listen for.
 *
 * IMPORTANT: This file should NOT import any React components to ensure
 * it can be imported server-side without pulling in React dependencies.
 * Use the './tools' subpath export for server-safe imports.
 */

import type { PanelTool, PanelToolsMetadata } from '@principal-ade/utcp-panel-event';

const PANEL_ID = 'principal-ade.dependencies-panel';

/**
 * Tool: Filter Dependencies
 * Allows filtering the dependency list by search term
 */
export const filterDependenciesTool: PanelTool = {
  name: 'filter_dependencies',
  description: 'Filter the dependencies list by package name',
  inputs: {
    type: 'object',
    properties: {
      filter: {
        type: 'string',
        description: 'Search term to filter dependencies by name',
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
  tags: ['filter', 'search', 'dependencies'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:filter`,
  },
};

/**
 * Tool: Select Dependency Type
 * Allows selecting a specific dependency type to filter
 */
export const selectDependencyTypeTool: PanelTool = {
  name: 'select_dependency_type',
  description: 'Filter dependencies by type (production, development, or peer)',
  inputs: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['production', 'development', 'peer', 'all'],
        description: 'The dependency type to filter by',
      },
    },
    required: ['type'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      selectedType: { type: 'string' },
    },
  },
  tags: ['filter', 'type', 'dependencies'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-type`,
  },
};

/**
 * Tool: Select Package (for monorepos)
 * Allows selecting a specific package in a monorepo
 */
export const selectPackageTool: PanelTool = {
  name: 'select_package',
  description: 'Select a package to view its dependencies (for monorepos)',
  inputs: {
    type: 'object',
    properties: {
      packagePath: {
        type: 'string',
        description: 'The path of the package to select',
      },
    },
    required: ['packagePath'],
  },
  outputs: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      selectedPackage: { type: 'string' },
    },
  },
  tags: ['select', 'package', 'monorepo'],
  tool_call_template: {
    call_template_type: 'panel_event',
    event_type: `${PANEL_ID}:select-package`,
  },
};

/**
 * All tools exported as an array.
 */
export const dependenciesPanelTools: PanelTool[] = [
  filterDependenciesTool,
  selectDependencyTypeTool,
  selectPackageTool,
];

/**
 * Panel tools metadata for registration with PanelToolRegistry.
 */
export const dependenciesPanelToolsMetadata: PanelToolsMetadata = {
  id: PANEL_ID,
  name: 'Dependencies Panel',
  description: 'Tools for viewing and exploring package dependencies',
  tools: dependenciesPanelTools,
};
