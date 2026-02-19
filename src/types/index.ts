/**
 * Panel Extension Type Definitions
 *
 * Re-exports core types from @principal-ade/panel-framework-core
 * and Alexandria-specific types
 */

// Re-export all core types from panel-framework-core
export type {
  // Core data types
  DataSlice,
  WorkspaceMetadata,
  RepositoryMetadata,
  FileTreeSource,
  ActiveFileSlice,

  // Event system
  PanelEventType,
  PanelEvent,
  PanelEventEmitter,

  // Panel interface
  PanelActions,
  PanelContextValue,
  PanelComponentProps,

  // Panel definition
  PanelMetadata,
  PanelLifecycleHooks,
  PanelDefinition,
  PanelModule,

  // Registry types
  PanelRegistryEntry,
  PanelLoader,
  PanelRegistryConfig,

  // Tool types (UTCP-compatible)
  PanelTool,
  PanelToolsMetadata,
  JsonSchema,
  PanelEventCallTemplate,
} from '@principal-ade/panel-framework-core';

// Re-export Alexandria-specific shared types
export type {
  AlexandriaPanelsActions,
  AlexandriaPanelsContext,
  AlexandriaPanelProps,
} from './alexandria-panel-types';

// Re-export all individual panel types
export type * from './alexandria-panel-types';
