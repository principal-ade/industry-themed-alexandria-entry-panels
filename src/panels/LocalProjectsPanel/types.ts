/**
 * LocalProjectsPanel Type Definitions
 *
 * Types for the Local Projects panel, extending core-library types
 */

import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library/types';
import type { PanelActions } from '../../types';

/**
 * Data slice for Alexandria repositories
 * Provided by the host application through panel context
 */
export interface AlexandriaRepositoriesSlice {
  /** List of registered local repositories */
  repositories: AlexandriaEntry[];
  /** Whether repositories are currently loading */
  loading: boolean;
  /** Error message if loading failed */
  error?: string;
}

/**
 * Window state for a repository
 */
export type RepositoryWindowState = 'closed' | 'opening' | 'ready';

/**
 * Extended actions for LocalProjectsPanel
 * These are provided by the host application
 */
export interface LocalProjectsPanelActions extends PanelActions {
  /**
   * Open a directory picker dialog
   * @returns Selected directory info or null if cancelled
   */
  selectDirectory?: () => Promise<{ path: string; name: string } | null>;

  /**
   * Register a new repository in Alexandria
   * @param name - Repository name
   * @param path - Local path to the repository
   */
  registerRepository?: (name: string, path: string) => Promise<void>;

  /**
   * Remove a repository from Alexandria
   * @param name - Repository name
   * @param deleteLocal - Whether to delete local files
   */
  removeRepository?: (name: string, deleteLocal: boolean) => Promise<void>;

  /**
   * Open a repository in dev workspace
   * @param entry - Alexandria entry to open
   */
  openRepository?: (entry: AlexandriaEntry) => Promise<void>;

  /**
   * Focus an already-open repository window
   * @param entry - Alexandria entry to focus
   */
  focusRepository?: (entry: AlexandriaEntry) => Promise<void>;

  /**
   * Check if a repository window is open
   * @param entry - Alexandria entry to check
   * @returns Window state
   */
  getRepositoryWindowState?: (entry: AlexandriaEntry) => Promise<RepositoryWindowState>;
}

/**
 * Action mode for LocalProjectCard
 * Controls which action buttons are displayed
 */
export type CardActionMode =
  | 'default'           // Show open and remove buttons
  | 'add-to-workspace'  // Show "Add to workspace" button only
  | 'minimal'           // Show only open button
  | 'workspace';        // Show open, move, and remove-from-workspace buttons

/**
 * Props for LocalProjectCard component
 */
export interface LocalProjectCardProps {
  /** Alexandria entry data */
  entry: AlexandriaEntry;
  /** Action mode controls which buttons are shown */
  actionMode?: CardActionMode;
  /** Whether this card is currently selected */
  isSelected?: boolean;
  /** Callback when card is clicked/selected */
  onSelect?: (entry: AlexandriaEntry) => void;
  /** Callback when open button is clicked */
  onOpen?: (entry: AlexandriaEntry) => void;
  /** Callback when remove button is clicked */
  onRemove?: (entry: AlexandriaEntry) => void;
  /** Callback for add-to-workspace action */
  onAddToWorkspace?: (entry: AlexandriaEntry) => void;
  /** Callback for remove-from-workspace action (workspace mode) */
  onRemoveFromWorkspace?: (entry: AlexandriaEntry) => void;
  /** Callback for move-to-workspace-directory action (workspace mode) */
  onMoveToWorkspace?: (entry: AlexandriaEntry) => void;
  /** Whether an operation is in progress */
  isLoading?: boolean;
  /** Current window state for this repository */
  windowState?: RepositoryWindowState;
  /** Compact mode - hides path/info, stacks buttons under name */
  compact?: boolean;
  /** Whether repository is in workspace directory (workspace mode) */
  isInWorkspaceDirectory?: boolean | null;
  /** Workspace path for relative path display (workspace mode) */
  workspacePath?: string;
}

/**
 * Props for RepositoryAvatar component
 */
export interface RepositoryAvatarProps {
  /** GitHub owner username for avatar URL */
  owner?: string;
  /** Custom avatar URL (takes precedence over owner) */
  customAvatarUrl?: string | null;
  /** Avatar size in pixels */
  size?: number;
  /** Fallback content when no avatar available */
  fallbackIcon?: React.ReactNode;
}

/**
 * Event payloads for LocalProjectsPanel
 */
export interface LocalProjectsPanelEventPayloads {
  /** Filter projects event */
  'filter': { filter: string };
  /** Select project event */
  'select-repository': { identifier: string };
  /** Open project event */
  'open-repository': { identifier: string };
  /** Repository selected notification */
  'repository-selected': { entry: AlexandriaEntry };
  /** Repository opened notification */
  'repository-opened': { entry: AlexandriaEntry };
}
