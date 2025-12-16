import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import {
  User,
  Building2,
  Star,
  MapPin,
  Link as LinkIcon,
  Mail,
  Calendar,
  GitFork,
  ExternalLink,
  Download,
  Search,
  X,
  Circle,
} from 'lucide-react';
import type { PanelComponentProps } from '../../types';
import type {
  GitHubUserProfile,
  GitHubOrganization,
  GitHubRepository,
  UserProfileSlice,
  UserProfilePanelActions,
  UserProfileView,
  UserPresenceStatus,
} from './types';

// Panel event prefix
const PANEL_ID = 'industry-theme.user-profile';

// Helper to create panel events with required fields
const createPanelEvent = <T,>(type: string, payload: T) => ({
  type,
  source: PANEL_ID,
  timestamp: Date.now(),
  payload,
});

/**
 * Format a date string to a readable format
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Get presence status color
 */
const getPresenceColor = (status: UserPresenceStatus['status']): string => {
  switch (status) {
    case 'online':
      return '#22c55e';
    case 'away':
      return '#eab308';
    case 'offline':
    default:
      return '#6b7280';
  }
};

/**
 * OrganizationCard - Displays a single organization
 */
const OrganizationCard: React.FC<{
  organization: GitHubOrganization;
  onClick?: (org: GitHubOrganization) => void;
}> = ({ organization, onClick }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick?.(organization)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: isHovered
          ? theme.colors.backgroundTertiary
          : theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
    >
      <img
        src={organization.avatar_url}
        alt={organization.login}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: `${theme.fontSizes[1]}px`,
            fontWeight: theme.fontWeights.semibold,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}
        >
          {organization.login}
        </div>
        {organization.description && (
          <div
            style={{
              fontSize: `${theme.fontSizes[0]}px`,
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {organization.description}
          </div>
        )}
      </div>
      <Building2 size={16} style={{ color: theme.colors.textSecondary }} />
    </div>
  );
};

/**
 * RepositoryCard - Displays a single starred repository
 */
const RepositoryCard: React.FC<{
  repository: GitHubRepository;
  onClick?: (repo: GitHubRepository) => void;
  onClone?: (repo: GitHubRepository) => void;
  onOpenInBrowser?: (repo: GitHubRepository) => void;
}> = ({ repository, onClick, onClone, onOpenInBrowser }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick?.(repository)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: isHovered
          ? theme.colors.backgroundTertiary
          : theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: `${theme.fontSizes[1]}px`,
              fontWeight: theme.fontWeights.semibold,
              color: theme.colors.primary,
              fontFamily: theme.fonts.body,
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {repository.full_name}
            </span>
            {repository.fork && (
              <GitFork size={12} style={{ color: theme.colors.textSecondary, flexShrink: 0 }} />
            )}
          </div>
          {repository.description && (
            <div
              style={{
                fontSize: `${theme.fontSizes[0]}px`,
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                marginTop: '4px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {repository.description}
            </div>
          )}
        </div>
        {isHovered && (onClone || onOpenInBrowser) && (
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            {onClone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClone(repository);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.colors.border}`,
                  backgroundColor: theme.colors.backgroundTertiary,
                  color: theme.colors.text,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Clone repository"
              >
                <Download size={14} />
              </button>
            )}
            {onOpenInBrowser && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenInBrowser(repository);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.colors.border}`,
                  backgroundColor: theme.colors.backgroundTertiary,
                  color: theme.colors.text,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title="Open in browser"
              >
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: `${theme.fontSizes[0]}px`,
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.body,
        }}
      >
        {repository.language && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: theme.colors.primary,
              }}
            />
            {repository.language}
          </span>
        )}
        {repository.stargazers_count !== undefined && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} />
            {repository.stargazers_count.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * UserProfilePanelContent - Internal component that uses theme
 */
const UserProfilePanelContent: React.FC<PanelComponentProps> = ({
  context,
  actions,
  events,
}) => {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState<UserProfileView>('organizations');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);

  // Get extended actions
  const panelActions = actions as UserProfilePanelActions;

  // Get user profile data from context slice
  const profileSlice = context.getSlice<UserProfileSlice>('userProfile');
  const user = profileSlice?.data?.user ?? null;
  const organizations = useMemo(
    () => profileSlice?.data?.organizations || [],
    [profileSlice?.data?.organizations]
  );
  const starredRepositories = useMemo(
    () => profileSlice?.data?.starredRepositories || [],
    [profileSlice?.data?.starredRepositories]
  );
  const presence = profileSlice?.data?.presence;
  const loading = profileSlice?.loading ?? false;

  // Filter starred repositories by search
  const filteredStarred = useMemo(() => {
    if (!searchQuery.trim()) return starredRepositories;
    const query = searchQuery.toLowerCase().trim();
    return starredRepositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.full_name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query)
    );
  }, [starredRepositories, searchQuery]);

  // Handle organization selection
  const handleOrganizationSelect = useCallback(
    (organization: GitHubOrganization) => {
      events.emit(
        createPanelEvent(`${PANEL_ID}:organization:selected`, {
          orgLogin: organization.login,
          organization,
        })
      );
      panelActions.viewOrganization?.(organization.login);
    },
    [events, panelActions]
  );

  // Handle repository selection
  const handleRepositorySelect = useCallback(
    (repository: GitHubRepository) => {
      events.emit(
        createPanelEvent(`${PANEL_ID}:repository:selected`, {
          owner: repository.owner.login,
          repo: repository.name,
          repository,
        })
      );
      panelActions.viewRepository?.(repository.owner.login, repository.name);
    },
    [events, panelActions]
  );

  // Handle repository clone
  const handleCloneRepository = useCallback(
    (repository: GitHubRepository) => {
      events.emit(
        createPanelEvent(`${PANEL_ID}:repository:clone-requested`, {
          repository,
        })
      );
      panelActions.cloneRepository?.(repository);
    },
    [events, panelActions]
  );

  // Handle open in browser
  const handleOpenInBrowser = useCallback(
    (repository: GitHubRepository) => {
      panelActions.openInBrowser?.(repository.html_url);
    },
    [panelActions]
  );

  // Handle view change
  const handleViewChange = useCallback(
    (view: UserProfileView) => {
      setActiveView(view);
      setSearchQuery('');
      setShowSearchBox(false);
      events.emit(createPanelEvent(`${PANEL_ID}:view:changed`, { view }));
    },
    [events]
  );

  // Subscribe to panel events
  useEffect(() => {
    const unsubscribers = [
      events.on<{ view: UserProfileView }>(`${PANEL_ID}:set-view`, (event) => {
        if (event.payload?.view) {
          handleViewChange(event.payload.view);
        }
      }),
      events.on<{ orgLogin: string }>(`${PANEL_ID}:select-organization`, (event) => {
        const orgLogin = event.payload?.orgLogin;
        if (orgLogin) {
          const org = organizations.find((o) => o.login === orgLogin);
          if (org) {
            handleOrganizationSelect(org);
          }
        }
      }),
      events.on<{ owner: string; repo: string }>(`${PANEL_ID}:select-repository`, (event) => {
        const { owner, repo } = event.payload || {};
        if (owner && repo) {
          const repository = starredRepositories.find(
            (r) => r.owner.login === owner && r.name === repo
          );
          if (repository) {
            handleRepositorySelect(repository);
          }
        }
      }),
      events.on<{ owner: string; repo: string }>(`${PANEL_ID}:clone-repository`, (event) => {
        const { owner, repo } = event.payload || {};
        if (owner && repo) {
          const repository = starredRepositories.find(
            (r) => r.owner.login === owner && r.name === repo
          );
          if (repository) {
            handleCloneRepository(repository);
          }
        }
      }),
      events.on<{ filter: string }>(`${PANEL_ID}:filter-starred`, (event) => {
        if (event.payload?.filter !== undefined) {
          setSearchQuery(event.payload.filter);
          setShowSearchBox(true);
          setActiveView('starred');
        }
      }),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [
    events,
    organizations,
    starredRepositories,
    handleViewChange,
    handleOrganizationSelect,
    handleRepositorySelect,
    handleCloneRepository,
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
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '360px',
            }}
          >
            <h3
              style={{
                margin: 0,
                color: theme.colors.text,
                fontSize: `${theme.fontSizes[3]}px`,
                fontWeight: theme.fontWeights.semibold,
                fontFamily: theme.fonts.body,
              }}
            >
              Loading profile...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // No user selected state
  if (!user) {
    return (
      <div style={baseContainerStyle}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '360px',
            }}
          >
            <User size={48} style={{ color: theme.colors.textSecondary }} />
            <h3
              style={{
                margin: 0,
                color: theme.colors.text,
                fontSize: `${theme.fontSizes[2]}px`,
                fontWeight: theme.fontWeights.semibold,
                fontFamily: theme.fonts.body,
              }}
            >
              Select a user
            </h3>
            <p
              style={{
                margin: 0,
                color: theme.colors.textSecondary,
                fontSize: `${theme.fontSizes[1]}px`,
                fontFamily: theme.fonts.body,
              }}
            >
              Click on someone in the network to view their profile
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={baseContainerStyle}>
      {/* Panel Header */}
      <div
        style={{
          height: '40px',
          minHeight: '40px',
          padding: '0 16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <User size={18} color={theme.colors.primary} />
        <span
          style={{
            fontSize: `${theme.fontSizes[2]}px`,
            fontWeight: theme.fontWeights.medium,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}
        >
          User Profile
        </span>
      </div>

      {/* User Info */}
      <div
        style={{
          padding: '16px',
          backgroundColor: theme.colors.background,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={user.avatar_url}
              alt={user.login}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            {presence && (
              <Circle
                size={14}
                fill={getPresenceColor(presence.status)}
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  color: getPresenceColor(presence.status),
                }}
              />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: `${theme.fontSizes[3]}px`,
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
            >
              {user.name || user.login}
            </div>
            <div
              style={{
                fontSize: `${theme.fontSizes[1]}px`,
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
              }}
            >
              @{user.login}
            </div>
            {user.bio && (
              <div
                style={{
                  fontSize: `${theme.fontSizes[1]}px`,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                  marginTop: '8px',
                }}
              >
                {user.bio}
              </div>
            )}
          </div>
        </div>

        {/* User meta info */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '12px',
            fontSize: `${theme.fontSizes[0]}px`,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
          }}
        >
          {user.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} />
              {user.location}
            </span>
          )}
          {user.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={12} />
              {user.email}
            </span>
          )}
          {user.company && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={12} />
              {user.company}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            Joined {formatDate(user.created_at)}
          </span>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '12px',
            fontSize: `${theme.fontSizes[1]}px`,
            fontFamily: theme.fonts.body,
          }}
        >
          <span>
            <strong style={{ color: theme.colors.text }}>{user.followers}</strong>{' '}
            <span style={{ color: theme.colors.textSecondary }}>followers</span>
          </span>
          <span>
            <strong style={{ color: theme.colors.text }}>{user.following}</strong>{' '}
            <span style={{ color: theme.colors.textSecondary }}>following</span>
          </span>
          <span>
            <strong style={{ color: theme.colors.text }}>{user.public_repos}</strong>{' '}
            <span style={{ color: theme.colors.textSecondary }}>repos</span>
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.background,
        }}
      >
        <button
          onClick={() => handleViewChange('organizations')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px',
            border: 'none',
            backgroundColor: 'transparent',
            color:
              activeView === 'organizations'
                ? theme.colors.primary
                : theme.colors.textSecondary,
            fontSize: `${theme.fontSizes[1]}px`,
            fontWeight:
              activeView === 'organizations'
                ? theme.fontWeights.semibold
                : theme.fontWeights.medium,
            fontFamily: theme.fonts.body,
            cursor: 'pointer',
            borderBottom:
              activeView === 'organizations'
                ? `2px solid ${theme.colors.primary}`
                : '2px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <Building2 size={16} />
          Organizations ({organizations.length})
        </button>
        <button
          onClick={() => handleViewChange('starred')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px',
            border: 'none',
            backgroundColor: 'transparent',
            color:
              activeView === 'starred'
                ? theme.colors.primary
                : theme.colors.textSecondary,
            fontSize: `${theme.fontSizes[1]}px`,
            fontWeight:
              activeView === 'starred'
                ? theme.fontWeights.semibold
                : theme.fontWeights.medium,
            fontFamily: theme.fonts.body,
            cursor: 'pointer',
            borderBottom:
              activeView === 'starred'
                ? `2px solid ${theme.colors.primary}`
                : '2px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <Star size={16} />
          Starred ({starredRepositories.length})
        </button>
      </div>

      {/* Search box for starred view */}
      {activeView === 'starred' && (
        <div
          style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.background,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.backgroundSecondary,
              }}
            >
              <Search size={16} style={{ color: theme.colors.textSecondary }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter starred repositories..."
                style={{
                  flex: 1,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: theme.colors.text,
                  fontSize: `${theme.fontSizes[1]}px`,
                  fontFamily: theme.fonts.body,
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: theme.colors.textSecondary,
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {activeView === 'organizations' && (
          <>
            {organizations.length === 0 ? (
              <div
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  color: theme.colors.textSecondary,
                }}
              >
                <Building2
                  size={32}
                  style={{ marginBottom: '12px', opacity: 0.5 }}
                />
                <p style={{ margin: 0 }}>No organizations</p>
              </div>
            ) : (
              organizations.map((org) => (
                <OrganizationCard
                  key={org.id}
                  organization={org}
                  onClick={handleOrganizationSelect}
                />
              ))
            )}
          </>
        )}

        {activeView === 'starred' && (
          <>
            {filteredStarred.length === 0 ? (
              <div
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  color: theme.colors.textSecondary,
                }}
              >
                <Star size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>
                  {searchQuery
                    ? `No repositories matching "${searchQuery}"`
                    : 'No starred repositories'}
                </p>
              </div>
            ) : (
              filteredStarred.map((repo) => (
                <RepositoryCard
                  key={repo.id}
                  repository={repo}
                  onClick={handleRepositorySelect}
                  onClone={panelActions.cloneRepository ? handleCloneRepository : undefined}
                  onOpenInBrowser={
                    panelActions.openInBrowser ? handleOpenInBrowser : undefined
                  }
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * UserProfilePanel - View user profiles with their organizations and starred repos
 *
 * Features:
 * - Display user profile header with avatar, bio, stats
 * - Show user's GitHub organizations
 * - Show user's starred repositories with search/filter
 * - Presence status indicator
 * - Clone starred repositories
 *
 * Data Slices:
 * - userProfile: UserProfileSlice object
 *
 * Events Emitted:
 * - industry-theme.user-profile:organization:selected
 * - industry-theme.user-profile:repository:selected
 * - industry-theme.user-profile:repository:clone-requested
 * - industry-theme.user-profile:view:changed
 *
 * Events Listened:
 * - industry-theme.user-profile:set-view
 * - industry-theme.user-profile:select-organization
 * - industry-theme.user-profile:select-repository
 * - industry-theme.user-profile:clone-repository
 * - industry-theme.user-profile:filter-starred
 */
export const UserProfilePanel: React.FC<PanelComponentProps> = (props) => {
  return <UserProfilePanelContent {...props} />;
};

/**
 * UserProfilePanelPreview - Compact preview for panel tabs/thumbnails
 */
export const UserProfilePanelPreview: React.FC = () => {
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
        <User size={16} style={{ color: theme.colors.primary }} />
        <span>User Profile</span>
      </div>
      <div
        style={{
          fontSize: `${theme.fontSizes[0]}px`,
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          marginTop: '4px',
        }}
      >
        View user organizations and starred repos
      </div>
    </div>
  );
};

// Re-export types
export type {
  GitHubUserProfile,
  GitHubOrganization,
  GitHubRepository,
  UserProfileSlice,
  UserProfilePanelActions,
  UserProfileView,
  UserPresenceStatus,
  UserProfileCardProps,
  OrganizationCardProps,
  StarredRepositoryCardProps,
  OrganizationSelectedPayload,
  RepositorySelectedPayload,
  RepositoryCloneRequestedPayload,
  UserProfilePanelEventPayloads,
} from './types';
