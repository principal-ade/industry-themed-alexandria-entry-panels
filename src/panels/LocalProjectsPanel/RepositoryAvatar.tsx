import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import type { RepositoryAvatarProps } from './types';

/**
 * RepositoryAvatar - Displays repository owner avatar
 *
 * Priority:
 * 1. customAvatarUrl prop
 * 2. GitHub avatar from owner username
 * 3. Fallback icon or initial
 */
export const RepositoryAvatar: React.FC<RepositoryAvatarProps> = ({
  owner,
  customAvatarUrl,
  size = 32,
  fallbackIcon,
}) => {
  const { theme } = useTheme();

  // Use rounded squares for avatar
  const borderRadius = `${Math.min(8, size / 4)}px`;

  // Determine avatar URL
  const avatarUrl =
    customAvatarUrl || (owner ? `https://github.com/${owner}.png` : null);

  const getContent = () => {
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={owner || 'Repository'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            // Hide broken image and show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }

    if (fallbackIcon) {
      return fallbackIcon;
    }

    return null;
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        backgroundColor: theme.colors.backgroundTertiary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {getContent()}
    </div>
  );
};
