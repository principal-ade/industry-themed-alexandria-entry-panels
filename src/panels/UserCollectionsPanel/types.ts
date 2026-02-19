/**
 * UserCollectionsPanel Type Definitions
 *
 * Types for the User Collections panel - displays and manages
 * user-created repository collections that sync to GitHub.
 */

import type { PanelActions, DataSlice, PanelComponentProps } from '../../types';

/**
 * Collection type - matches @principal-ai/alexandria-collections
 */
export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  theme?: string;
  isDefault?: boolean;
  suggestedClonePath?: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

/**
 * Collection membership - links repositories to collections
 */
export interface CollectionMembership {
  collectionId: string;
  repositoryId: string; // Format: "owner/repo"
  addedAt: number;
  metadata?: {
    pinned?: boolean;
    notes?: string;
    [key: string]: unknown;
  };
}

/**
 * Data slice for user collections
 */
export interface UserCollectionsSlice {
  /** List of user's collections */
  collections: Collection[];
  /** Collection memberships (repos in collections) */
  memberships: CollectionMembership[];
  /** Whether collections are loading */
  loading: boolean;
  /** Whether a save operation is in progress */
  saving?: boolean;
  /** Error message if loading/saving failed */
  error?: string;
  /** Whether GitHub sync is enabled */
  gitHubRepoExists?: boolean;
  /** URL to the GitHub collections repo */
  gitHubRepoUrl?: string | null;
}

/**
 * Extended actions for UserCollectionsPanel
 */
export interface UserCollectionsPanelActions extends PanelActions {
  /**
   * Create a new collection
   * @param name - Collection name
   * @param description - Optional description
   * @param icon - Optional icon name
   */
  createCollection?: (
    name: string,
    description?: string,
    icon?: string
  ) => Promise<Collection | null>;

  /**
   * Update a collection
   * @param collectionId - Collection ID
   * @param updates - Fields to update
   */
  updateCollection?: (
    collectionId: string,
    updates: Partial<Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;

  /**
   * Delete a collection
   * @param collectionId - Collection ID
   */
  deleteCollection?: (collectionId: string) => Promise<void>;

  /**
   * Add a repository to a collection
   * @param collectionId - Collection ID
   * @param repositoryId - Repository identifier (owner/repo format)
   * @param metadata - Optional metadata (pinned, notes)
   */
  addRepository?: (
    collectionId: string,
    repositoryId: string,
    metadata?: { pinned?: boolean; notes?: string }
  ) => Promise<void>;

  /**
   * Remove a repository from a collection
   * @param collectionId - Collection ID
   * @param repositoryId - Repository identifier
   */
  removeRepository?: (
    collectionId: string,
    repositoryId: string
  ) => Promise<void>;

  /**
   * Enable GitHub sync (creates web-ade-collections repo)
   */
  enableGitHubSync?: () => Promise<void>;

  /**
   * Refresh collections from GitHub
   */
  refreshCollections?: () => Promise<void>;

  /**
   * Navigate to a repository (open in browser or app)
   * @param repositoryId - Repository identifier (owner/repo)
   */
  navigateToRepository?: (repositoryId: string) => void;
}

/**
 * Props for CollectionCard component
 */
export interface CollectionCardProps {
  /** Collection data */
  collection: Collection;
  /** Number of repositories in this collection */
  repositoryCount: number;
  /** Whether this collection is selected */
  isSelected?: boolean;
  /** Callback when card is clicked */
  onClick?: (collection: Collection) => void;
  /** Callback when edit button is clicked */
  onEdit?: (collection: Collection) => void;
  /** Callback when delete button is clicked */
  onDelete?: (collection: Collection) => void;
}

/**
 * Collection selected event payload
 */
export interface CollectionSelectedPayload {
  collectionId: string;
  collection: Collection;
}

/**
 * Collection created event payload
 */
export interface CollectionCreatedPayload {
  collectionId: string;
  collection: Collection;
}

/**
 * Collection deleted event payload
 */
export interface CollectionDeletedPayload {
  collectionId: string;
}

/**
 * Repository added to collection event payload
 */
export interface RepositoryAddedPayload {
  collectionId: string;
  repositoryId: string;
}

/**
 * Repository removed from collection event payload
 */
export interface RepositoryRemovedPayload {
  collectionId: string;
  repositoryId: string;
}

/**
 * Context interface for UserCollectionsPanel
 * Declares which slices this panel requires
 */
export interface UserCollectionsPanelContext {
  /** User collections data slice (required) */
  userCollections: DataSlice<UserCollectionsSlice>;
}

/**
 * Props type for UserCollectionsPanel component
 */
export type UserCollectionsPanelPropsTyped = PanelComponentProps<
  UserCollectionsPanelActions,
  UserCollectionsPanelContext
>;

/**
 * Event payloads for UserCollectionsPanel
 */
export interface UserCollectionsPanelEventPayloads {
  /** Select collection event (from tools) */
  'select-collection': { collectionId: string };
  /** Create collection event (from tools) */
  'create-collection': { name: string; description?: string };
  /** Create collection requested - emitted when user clicks add button */
  'create-collection-requested': Record<string, never>;
  /** Delete collection event (from tools) */
  'delete-collection': { collectionId: string };
  /** Add repository event (from tools) */
  'add-repository': { collectionId: string; repositoryId: string };
  /** Remove repository event (from tools) */
  'remove-repository': { collectionId: string; repositoryId: string };
  /** Enable GitHub sync event */
  'enable-github-sync': Record<string, never>;
  /** Refresh collections event */
  'refresh-collections': Record<string, never>;
  /** Collection selected notification */
  'collection:selected': CollectionSelectedPayload;
  /** Collection created notification */
  'collection:created': CollectionCreatedPayload;
  /** Collection deleted notification */
  'collection:deleted': CollectionDeletedPayload;
  /** Repository added notification */
  'collection:repository-added': RepositoryAddedPayload;
  /** Repository removed notification */
  'collection:repository-removed': RepositoryRemovedPayload;
}
