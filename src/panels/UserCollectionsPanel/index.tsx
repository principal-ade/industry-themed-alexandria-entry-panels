import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import {
  Search,
  Plus,
  X,
  FolderOpen,
  Settings,
  Cloud,
  CloudOff,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import type { PanelComponentProps } from '../../types';
import type {
  Collection,
  UserCollectionsSlice,
  UserCollectionsPanelActions,
  CollectionCardProps,
} from './types';

// Panel event prefix
const PANEL_ID = 'industry-theme.user-collections';

// Helper to create panel events with required fields
const createPanelEvent = <T,>(type: string, payload: T) => ({
  type,
  source: PANEL_ID,
  timestamp: Date.now(),
  payload,
});

export interface UserCollectionsPanelProps extends PanelComponentProps {
  /** Whether to show the search bar by default */
  defaultShowSearch?: boolean;
}

/**
 * CollectionCard - Individual collection card component
 */
const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  repositoryCount,
  isSelected,
  onClick,
  onEdit,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick?.(collection)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: `1px solid ${
          isSelected
            ? theme.colors.primary
            : isHovered
              ? theme.colors.primary
              : theme.colors.border
        }`,
        backgroundColor: isSelected
          ? `${theme.colors.primary}10`
          : isHovered
            ? theme.colors.backgroundTertiary || theme.colors.highlight
            : theme.colors.background,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
    >
      {/* Edit button */}
      {isHovered && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(collection);
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '4px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textSecondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Edit collection"
        >
          <Settings size={14} />
        </button>
      )}

      {/* Collection icon */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          backgroundColor: `${theme.colors.primary}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
        }}
      >
        <FolderOpen size={16} color={theme.colors.primary} />
      </div>

      {/* Collection name */}
      <div
        style={{
          fontSize: `${theme.fontSizes[2]}px`,
          fontWeight: theme.fontWeights.medium,
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {collection.name}
      </div>

      {/* Description */}
      {collection.description && (
        <div
          style={{
            fontSize: `${theme.fontSizes[1]}px`,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            marginBottom: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {collection.description}
        </div>
      )}

      {/* Repository count */}
      <div
        style={{
          fontSize: `${theme.fontSizes[1]}px`,
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.body,
        }}
      >
        {repositoryCount} {repositoryCount === 1 ? 'repository' : 'repositories'}
      </div>
    </div>
  );
};

/**
 * CreateCollectionCard - Card for creating a new collection
 */
const CreateCollectionCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: `2px dashed ${
          isHovered ? theme.colors.primary : theme.colors.border
        }`,
        backgroundColor: isHovered
          ? theme.colors.backgroundTertiary || theme.colors.highlight
          : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100px',
        gap: '8px',
      }}
    >
      <Plus
        size={24}
        color={isHovered ? theme.colors.primary : theme.colors.textSecondary}
      />
      <span
        style={{
          fontSize: `${theme.fontSizes[1]}px`,
          color: isHovered ? theme.colors.primary : theme.colors.textSecondary,
          fontFamily: theme.fonts.body,
        }}
      >
        New Collection
      </span>
    </div>
  );
};

/**
 * UserCollectionsPanelContent - Internal component that uses theme
 */
const UserCollectionsPanelContent: React.FC<UserCollectionsPanelProps> = ({
  context,
  actions,
  events,
  defaultShowSearch = false,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(defaultShowSearch);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  // Get extended actions
  const panelActions = actions as UserCollectionsPanelActions;

  // Get collections from context slice
  const collectionsSlice = context.getSlice<UserCollectionsSlice>('userCollections');
  const collections = useMemo(
    () => collectionsSlice?.data?.collections || [],
    [collectionsSlice?.data?.collections]
  );
  const memberships = useMemo(
    () => collectionsSlice?.data?.memberships || [],
    [collectionsSlice?.data?.memberships]
  );
  const loading = collectionsSlice?.loading ?? false;
  const saving = collectionsSlice?.data?.saving ?? false;
  const gitHubRepoExists = collectionsSlice?.data?.gitHubRepoExists ?? false;
  const gitHubRepoUrl = collectionsSlice?.data?.gitHubRepoUrl ?? null;

  // Get repository count for a collection
  const getRepoCount = useCallback(
    (collectionId: string) => {
      return memberships.filter((m) => m.collectionId === collectionId).length;
    },
    [memberships]
  );

  // Filter and sort collections
  const sortedCollections = useMemo(() => {
    let filtered = collections;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = collections.filter((collection) => {
        // Search by collection name
        if (collection.name.toLowerCase().includes(query)) {
          return true;
        }

        // Search by description
        if (collection.description?.toLowerCase().includes(query)) {
          return true;
        }

        return false;
      });
    }

    // Sort by name alphabetically
    return [...filtered].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }, [collections, searchQuery]);

  // Handle collection selection
  const handleCollectionSelect = useCallback(
    (collection: Collection) => {
      setSelectedCollectionId(collection.id);
      events.emit(
        createPanelEvent(`${PANEL_ID}:collection:selected`, {
          collectionId: collection.id,
          collection,
        })
      );
    },
    [events]
  );

  // Handle collection edit
  const handleEditCollection = useCallback(
    (collection: Collection) => {
      events.emit(
        createPanelEvent(`${PANEL_ID}:edit-collection-requested`, {
          collectionId: collection.id,
          collection,
        })
      );
    },
    [events]
  );

  // Handle create collection - emits event for host app to show modal
  const handleCreateCollection = useCallback(() => {
    events.emit(createPanelEvent(`${PANEL_ID}:create-collection-requested`, {}));
  }, [events]);

  // Handle enable GitHub sync
  const handleEnableGitHubSync = useCallback(async () => {
    if (panelActions.enableGitHubSync) {
      try {
        await panelActions.enableGitHubSync();
        events.emit(createPanelEvent(`${PANEL_ID}:github-sync-enabled`, {}));
      } catch (error) {
        console.error('Failed to enable GitHub sync:', error);
      }
    }
  }, [panelActions, events]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (panelActions.refreshCollections) {
      await panelActions.refreshCollections();
    } else {
      await context.refresh(undefined, 'userCollections');
    }
  }, [panelActions, context]);

  // Subscribe to panel events
  useEffect(() => {
    const unsubscribers = [
      // Select collection event from tools
      events.on<{ collectionId: string }>(`${PANEL_ID}:select-collection`, (event) => {
        const collectionId = event.payload?.collectionId;
        if (collectionId) {
          const collection = collections.find((c) => c.id === collectionId);
          if (collection) {
            handleCollectionSelect(collection);
          }
        }
      }),

      // Create collection event from tools
      events.on<{ name: string; description?: string }>(
        `${PANEL_ID}:create-collection`,
        async (event) => {
          const { name, description } = event.payload || {};
          if (name && panelActions.createCollection) {
            try {
              const collection = await panelActions.createCollection(name, description);
              if (collection) {
                events.emit(
                  createPanelEvent(`${PANEL_ID}:collection:created`, {
                    collectionId: collection.id,
                    collection,
                  })
                );
              }
            } catch (error) {
              console.error('Failed to create collection:', error);
            }
          }
        }
      ),

      // Delete collection event from tools
      events.on<{ collectionId: string }>(
        `${PANEL_ID}:delete-collection`,
        async (event) => {
          const { collectionId } = event.payload || {};
          if (collectionId && panelActions.deleteCollection) {
            try {
              await panelActions.deleteCollection(collectionId);
              events.emit(
                createPanelEvent(`${PANEL_ID}:collection:deleted`, {
                  collectionId,
                })
              );
            } catch (error) {
              console.error('Failed to delete collection:', error);
            }
          }
        }
      ),

      // Enable GitHub sync event
      events.on(`${PANEL_ID}:enable-github-sync`, handleEnableGitHubSync),

      // Refresh collections event
      events.on(`${PANEL_ID}:refresh-collections`, handleRefresh),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [
    events,
    collections,
    handleCollectionSelect,
    handleEnableGitHubSync,
    handleRefresh,
    panelActions,
  ]);

  const baseContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
  };

  // Loading state
  if (loading) {
    return (
      <div style={baseContainerStyle}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Loader2
            size={24}
            color={theme.colors.textSecondary}
            style={{ animation: 'spin 1s linear infinite' }}
          />
          <span
            style={{
              fontSize: `${theme.fontSizes[1]}px`,
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            Loading collections...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={baseContainerStyle}>
      {/* Header with search and create buttons */}
      <div
        style={{
          position: 'relative',
          height: '40px',
          minHeight: '40px',
          padding: '0 16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            visibility: showSearchBox ? 'hidden' : 'visible',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderOpen size={18} color={theme.colors.primary} />
            <span
              style={{
                fontSize: `${theme.fontSizes[2]}px`,
                fontWeight: theme.fontWeights.medium,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
            >
              Collections
            </span>
            {collections.length > 0 && (
              <span
                style={{
                  fontSize: `${theme.fontSizes[1]}px`,
                  color: theme.colors.textSecondary,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: theme.colors.background,
                }}
              >
                {collections.length}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* GitHub sync status */}
            {gitHubRepoExists ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: theme.colors.success,
                  fontSize: `${theme.fontSizes[0]}px`,
                  fontFamily: theme.fonts.body,
                }}
                title={gitHubRepoUrl || 'Synced to GitHub'}
              >
                <Cloud size={14} />
              </div>
            ) : (
              <button
                onClick={handleEnableGitHubSync}
                disabled={saving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: `1px solid ${theme.colors.border}`,
                  backgroundColor: 'transparent',
                  color: theme.colors.textSecondary,
                  fontSize: `${theme.fontSizes[0]}px`,
                  fontFamily: theme.fonts.body,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
                title="Enable GitHub sync"
              >
                <CloudOff size={12} />
              </button>
            )}

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={loading || saving}
              style={{
                background: 'none',
                border: `1px solid transparent`,
                borderRadius: '4px',
                cursor: loading || saving ? 'not-allowed' : 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.textSecondary,
              }}
              title="Refresh collections"
            >
              <RefreshCw size={14} />
            </button>

            {/* Search button */}
            <button
              onClick={() => {
                setShowSearchBox(!showSearchBox);
                if (showSearchBox) {
                  setSearchQuery('');
                }
              }}
              style={{
                background: showSearchBox
                  ? theme.colors.backgroundSecondary
                  : 'none',
                border: `1px solid ${showSearchBox ? theme.colors.border : 'transparent'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showSearchBox
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              }}
              title={showSearchBox ? 'Close search' : 'Search collections'}
            >
              <Search size={16} />
            </button>

            {/* Create button */}
            <button
              onClick={handleCreateCollection}
              style={{
                padding: '4px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Create new collection"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Search overlay */}
        {showSearchBox && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              backgroundColor: theme.colors.backgroundSecondary,
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={16}
                color={theme.colors.textSecondary}
                style={{
                  position: 'absolute',
                  left: '10px',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Filter collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '6px 32px 6px 32px',
                  fontSize: `${theme.fontSizes[1]}px`,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '4px',
                  outline: 'none',
                  fontFamily: theme.fonts.body,
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.textSecondary,
                  }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setShowSearchBox(false);
                setSearchQuery('');
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                marginLeft: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.textSecondary,
              }}
              title="Close search"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
        }}
      >
        {/* Grid of collections */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px',
          }}
        >
          {/* Create new collection card */}
          <CreateCollectionCard onClick={handleCreateCollection} />

          {/* Existing collections */}
          {sortedCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              repositoryCount={getRepoCount(collection.id)}
              isSelected={collection.id === selectedCollectionId}
              onClick={handleCollectionSelect}
              onEdit={handleEditCollection}
            />
          ))}
        </div>

        {/* No results message */}
        {sortedCollections.length === 0 && searchQuery.trim() && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            <p style={{ margin: 0 }}>
              No collections found matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Empty state - no collections */}
        {collections.length === 0 && !searchQuery.trim() && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontSize: `${theme.fontSizes[2]}px` }}>
              No collections yet
            </p>
            <p style={{ margin: 0, fontSize: `${theme.fontSizes[1]}px` }}>
              Create a collection to organize your repositories
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * UserCollectionsPanel - Browse and manage user repository collections
 *
 * Features:
 * - Grid view of all collections
 * - Search/filter by collection name or description
 * - Create new collections
 * - Edit/delete collections
 * - GitHub sync status indicator
 * - Enable GitHub sync for cross-device persistence
 *
 * Data Slices:
 * - userCollections: UserCollectionsSlice object
 *
 * Events Emitted:
 * - industry-theme.user-collections:collection:selected
 * - industry-theme.user-collections:collection:created
 * - industry-theme.user-collections:collection:deleted
 * - industry-theme.user-collections:create-collection-requested
 * - industry-theme.user-collections:edit-collection-requested
 *
 * Events Listened:
 * - industry-theme.user-collections:select-collection
 * - industry-theme.user-collections:create-collection
 * - industry-theme.user-collections:delete-collection
 * - industry-theme.user-collections:enable-github-sync
 * - industry-theme.user-collections:refresh-collections
 */
export const UserCollectionsPanel: React.FC<UserCollectionsPanelProps> = (props) => {
  return <UserCollectionsPanelContent {...props} />;
};

/**
 * UserCollectionsPanelPreview - Compact preview for panel tabs/thumbnails
 */
export const UserCollectionsPanelPreview: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: '12px',
        fontSize: `${theme.fontSizes[0]}px`,
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: theme.fontWeights.semibold,
        }}
      >
        <FolderOpen size={16} style={{ color: theme.colors.primary }} />
        <span>Collections</span>
      </div>
      <div
        style={{
          fontSize: `${theme.fontSizes[0]}px`,
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          marginTop: '4px',
        }}
      >
        Organize repositories into collections
      </div>
    </div>
  );
};

// Re-export types
export type {
  Collection,
  CollectionMembership,
  UserCollectionsSlice,
  UserCollectionsPanelActions,
  CollectionCardProps,
  CollectionSelectedPayload,
  CollectionCreatedPayload,
  CollectionDeletedPayload,
  RepositoryAddedPayload,
  RepositoryRemovedPayload,
  UserCollectionsPanelEventPayloads,
} from './types';
