import React, { useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { DoorClosed, Edit2, Check, X, ExternalLink, Trash2 } from 'lucide-react';
import type { WorkspaceCardProps } from './types';

/**
 * WorkspaceCard - Displays a single workspace with actions
 */
export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  isSelected = false,
  isDefault = false,
  onClick,
  onOpen,
  onDelete,
  onUpdateName,
  themeColor,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(workspace.name);
  const [isSaving, setIsSaving] = useState(false);

  // Use theme color or fallback to primary
  const iconColor = themeColor || theme.colors.primary;

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditedName(workspace.name);
  };

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const trimmedName = editedName.trim();
    if (!trimmedName || trimmedName === workspace.name) {
      setIsEditing(false);
      setEditedName(workspace.name);
      return;
    }

    if (!onUpdateName) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      await onUpdateName(workspace.id, trimmedName);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update workspace name:', error);
      setEditedName(workspace.name);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditing(false);
    setEditedName(workspace.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleClick = () => {
    if (!isEditing) {
      onClick?.(workspace);
    }
  };

  const handleDoubleClick = () => {
    if (!isEditing) {
      onOpen?.(workspace);
    }
  };

  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen?.(workspace);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(workspace);
  };

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    padding: '12px',
    borderRadius: '6px',
    backgroundColor: isSelected
      ? theme.colors.backgroundTertiary
      : isHovered
        ? theme.colors.backgroundTertiary
        : 'transparent',
    border: `1px solid ${
      isSelected
        ? theme.colors.primary || theme.colors.border
        : isHovered
          ? theme.colors.border
          : 'transparent'
    }`,
    cursor: isEditing ? 'default' : 'pointer',
    transition: 'all 0.15s ease',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: theme.colors.text,
    fontSize: `${theme.fontSizes[2]}px`,
    fontWeight: theme.fontWeights.semibold,
    fontFamily: theme.fonts.body,
  };

  const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    flex: 1,
    height: '24px',
    padding: '0 8px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    fontSize: `${theme.fontSizes[1]}px`,
    fontFamily: theme.fonts.body,
    transition: 'all 0.15s ease',
  };

  return (
    <div
      style={cardStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '6px',
          backgroundColor: `color-mix(in srgb, ${iconColor} 12%, transparent)`,
          color: iconColor,
          flexShrink: 0,
        }}
      >
        {workspace.icon ? (
          <span style={{ fontSize: `${theme.fontSizes[4]}px` }}>{workspace.icon}</span>
        ) : (
          <DoorClosed size={28} />
        )}
      </div>

      {/* Content column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: 0,
        }}
      >
        {/* Header row */}
        <div style={headerStyle}>
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                disabled={isSaving}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${theme.colors.border}`,
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  fontSize: `${theme.fontSizes[2]}px`,
                  fontWeight: theme.fontWeights.semibold,
                  fontFamily: theme.fonts.body,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSave}
                disabled={isSaving}
                title="Save (Enter)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: theme.colors.success,
                  color: theme.colors.background,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                  transition: 'opacity 0.15s ease',
                }}
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                title="Cancel (Esc)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: theme.colors.backgroundTertiary,
                  color: theme.colors.text,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                  transition: 'opacity 0.15s ease',
                }}
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <span
                style={{
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {workspace.name}
              </span>
              {isDefault && (
                <span
                  style={{
                    fontSize: `${theme.fontSizes[1]}px`,
                    color: theme.colors.textSecondary,
                    fontWeight: 400,
                    flexShrink: 0,
                  }}
                >
                  Default
                </span>
              )}
            </>
          )}
        </div>

        {/* Description row with action buttons */}
        {!isEditing && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '24px',
              position: 'relative',
            }}
          >
            {/* Description - hidden when hovered */}
            <div
              style={{
                flex: 1,
                fontSize: `${theme.fontSizes[1]}px`,
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
                opacity: isHovered ? 0 : 1,
                transition: 'opacity 0.15s ease',
              }}
              title={workspace.description}
            >
              {workspace.description || '\u00A0'}
            </div>

            {/* Action buttons - cover full width when hovered */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                opacity: isHovered ? 1 : 0,
                pointerEvents: isHovered ? 'auto' : 'none',
                transition: 'opacity 0.15s ease',
              }}
            >
              {onOpen && (
                <button
                  onClick={handleOpenClick}
                  title="Open workspace"
                  style={actionButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                    e.currentTarget.style.color = theme.colors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.textSecondary;
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Open</span>
                </button>
              )}
              {onUpdateName && (
                <button
                  onClick={handleStartEdit}
                  title="Edit workspace name"
                  style={actionButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundTertiary;
                    e.currentTarget.style.color = theme.colors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.textSecondary;
                  }}
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  title="Delete workspace"
                  style={actionButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.colors.error}15`;
                    e.currentTarget.style.color = theme.colors.error;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.textSecondary;
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
