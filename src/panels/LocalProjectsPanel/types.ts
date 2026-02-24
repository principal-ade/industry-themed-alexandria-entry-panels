/**
 * LocalProjectsPanel Type Definitions
 *
 * Types for the Local Projects panel, extending core-library types
 */

import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library';
import type { Collection } from '@principal-ai/alexandria-collections';
import type { PanelActions, DataSlice, PanelComponentProps } from '../../types';
import type { UserCollectionsSlice } from '../UserCollectionsPanel/types';

/**
 * Discovered repository - a git repo found but not tracked in Alexandria
 */
export interface DiscoveredRepository {
  /** Absolute path to the repository */
  path: string;
  /** Repository name (directory name) */
  name: string;
  /** Always false for discovered repos */
  isTracked: false;
}

/**
 * Data slice for Alexandria repositories
 * Provided by the host application through panel context
 */
export interface AlexandriaRepositoriesSlice {
  /** List of registered local repositories */
  repositories: AlexandriaEntry[];
  /** List of discovered but untracked repositories */
  discoveredRepositories?: DiscoveredRepository[];
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
   * Remove a local repository from Alexandria
   * @param name - Repository name
   * @param deleteLocal - Whether to delete local files
   */
  removeLocalRepository?: (name: string, deleteLocal: boolean) => Promise<void>;

  /**
   * Open a local repository in dev workspace
   * @param entry - Alexandria entry to open
   */
  openLocalRepository?: (entry: AlexandriaEntry) => Promise<void>;

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
  getRepositoryWindowState?: (
    entry: AlexandriaEntry
  ) => Promise<RepositoryWindowState>;

  /**
   * Track a discovered repository (add to Alexandria)
   * @param name - Repository name
   * @param path - Local path to the repository
   */
  trackRepository?: (name: string, path: string) => Promise<void>;
}

/**
 * Action mode for LocalProjectCard
 * Controls which action buttons are displayed
 */
export type CardActionMode =
  | 'default' // Show open and remove buttons
  | 'add-to-workspace' // Show "Add to workspace" button only
  | 'minimal' // Show only open button
  | 'workspace' // Show open, move, and remove-from-workspace buttons
  | 'discovered'; // Show track and open buttons (for untracked repos)

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
  /** Callback when add to workspace button is clicked */
  onAddToWorkspace?: (entry: AlexandriaEntry) => void;
  /** Callback when remove from workspace button is clicked */
  onRemoveFromWorkspace?: (entry: AlexandriaEntry) => void;
  /** Callback when move to workspace button is clicked */
  onMoveToWorkspace?: (entry: AlexandriaEntry) => void;
  /** Callback when track button is clicked (for discovered repos) */
  onTrack?: (entry: AlexandriaEntry) => void;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Window state for the repository */
  windowState?: RepositoryWindowState;
  /** Whether to show the compact version of the card */
  compact?: boolean;
  /** Whether the repository is in the workspace directory */
  isInWorkspaceDirectory?: boolean;
  /** Workspace path to strip from displayed path */
  workspacePath?: string;
  /** User home path to strip from displayed path (replaced with ~) */
  userHomePath?: string;
  /** Whether to disable the copy paths functionality */
  disableCopyPaths?: boolean;
  /** Whether this repository is in the selected collection */
  isInSelectedCollection?: boolean;
  /** Name of the selected collection (for tooltip) */
  selectedCollectionName?: string;
}

/**
 * Context interface for LocalProjectsPanel
 * Declares which slices this panel requires
 */
export interface LocalProjectsPanelContext {
  /** Alexandria repositories data slice (required) */
  alexandriaRepositories: DataSlice<AlexandriaRepositoriesSlice>;
  /** User collections data slice (optional - used for visual indicators) */
  userCollections?: DataSlice<UserCollectionsSlice>;
  /** Selected collection (optional - used in WorldsView) */
  selectedCollection?: Collection | null;
}

/**
 * Props type for LocalProjectsPanel component
 */
export type LocalProjectsPanelPropsTyped = PanelComponentProps<
  LocalProjectsPanelActions,
  LocalProjectsPanelContext
>;

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
  filter: { filter: string };
  /** Select project event */
  'select-repository': { identifier: string };
  /** Open project event */
  'open-repository': { identifier: string };
  /** Repository selected notification */
  'repository-selected': { entry: AlexandriaEntry };
  /** Repository opened notification */
  'repository-opened': { entry: AlexandriaEntry };
}
