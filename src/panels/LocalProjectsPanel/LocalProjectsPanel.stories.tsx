import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LocalProjectsPanel } from './index';
import { LocalProjectCard } from './LocalProjectCard';
import { RepositoryAvatar } from './RepositoryAvatar';
import {
  createMockContext,
  createMockLocalProjectsActions,
  createMockEvents,
  mockAlexandriaRepositories,
} from '../../mocks/panelContext';
import type { AlexandriaRepositoriesSlice } from './types';

/**
 * LocalProjectsPanel - Browse and manage local Alexandria repositories
 *
 * This panel displays a list of locally registered repositories with:
 * - Search/filter functionality
 * - Add new project capability
 * - Open/focus project actions
 * - Remove project from registry
 */
const meta: Meta<typeof LocalProjectsPanel> = {
  title: 'Panels/LocalProjectsPanel',
  component: LocalProjectsPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Local Projects Panel provides a centralized view of all locally registered Alexandria repositories.

## Features
- **Search/Filter**: Quickly find projects by name, owner, or path
- **Add Projects**: Register new local directories as Alexandria projects
- **Open Projects**: Launch projects in the dev workspace
- **Remove Projects**: Unregister projects from Alexandria

## Data Requirements
This panel requires the \`alexandriaRepositories\` data slice to be provided by the host application.

## Events
- \`industry-theme.local-projects:repository-selected\` - Emitted when a project is selected
- \`industry-theme.local-projects:repository-opened\` - Emitted when a project is opened
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LocalProjectsPanel>;

/**
 * Default state with mock repositories
 */
export const Default: Story = {
  render: () => {
    const context = createMockContext();
    const actions = createMockLocalProjectsActions();
    const events = createMockEvents();

    return (
      <LocalProjectsPanel context={context} actions={actions} events={events} />
    );
  },
};

/**
 * Empty state - no repositories registered
 */
export const Empty: Story = {
  render: () => {
    const context = createMockContext({
      slices: new Map([
        [
          'alexandriaRepositories',
          {
            scope: 'global',
            name: 'alexandriaRepositories',
            data: {
              repositories: [],
              loading: false,
            } as AlexandriaRepositoriesSlice,
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockLocalProjectsActions();
    const events = createMockEvents();

    return (
      <LocalProjectsPanel context={context} actions={actions} events={events} />
    );
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => {
    const context = createMockContext({
      slices: new Map([
        [
          'alexandriaRepositories',
          {
            scope: 'global',
            name: 'alexandriaRepositories',
            data: {
              repositories: [],
              loading: true,
            } as AlexandriaRepositoriesSlice,
            loading: true,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockLocalProjectsActions();
    const events = createMockEvents();

    return (
      <LocalProjectsPanel context={context} actions={actions} events={events} />
    );
  },
};

/**
 * Without add button (no selectDirectory action)
 */
export const ReadOnly: Story = {
  render: () => {
    const context = createMockContext();
    const actions = {
      ...createMockLocalProjectsActions(),
      selectDirectory: undefined,
    };
    const events = createMockEvents();

    return (
      <LocalProjectsPanel context={context} actions={actions} events={events} />
    );
  },
};

/**
 * Permanent search mode - search bar always visible with action buttons
 */
export const PermanentSearch: Story = {
  render: () => {
    const context = createMockContext();
    const actions = createMockLocalProjectsActions();
    const events = createMockEvents();

    return (
      <LocalProjectsPanel
        context={context}
        actions={actions}
        events={events}
        defaultShowSearch={true}
      />
    );
  },
};

/**
 * LocalProjectCard component stories
 */
export const CardDefault: StoryObj<typeof LocalProjectCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e' }}>
      <LocalProjectCard
        entry={mockAlexandriaRepositories[0]}
        onSelect={(entry) => console.log('Selected:', entry.name)}
        onOpen={(entry) => console.log('Open:', entry.name)}
        onRemove={(entry) => console.log('Remove:', entry.name)}
      />
    </div>
  ),
};

export const CardSelected: StoryObj<typeof LocalProjectCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e' }}>
      <LocalProjectCard
        entry={mockAlexandriaRepositories[0]}
        isSelected={true}
        onSelect={(entry) => console.log('Selected:', entry.name)}
        onOpen={(entry) => console.log('Open:', entry.name)}
        onRemove={(entry) => console.log('Remove:', entry.name)}
      />
    </div>
  ),
};

export const CardWindowOpen: StoryObj<typeof LocalProjectCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e' }}>
      <LocalProjectCard
        entry={mockAlexandriaRepositories[0]}
        windowState="ready"
        onSelect={(entry) => console.log('Selected:', entry.name)}
        onOpen={(entry) => console.log('Focus:', entry.name)}
        onRemove={(entry) => console.log('Remove:', entry.name)}
      />
    </div>
  ),
};

export const CardWindowOpening: StoryObj<typeof LocalProjectCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e' }}>
      <LocalProjectCard
        entry={mockAlexandriaRepositories[0]}
        windowState="opening"
        onSelect={(entry) => console.log('Selected:', entry.name)}
        onOpen={(entry) => console.log('Open:', entry.name)}
        onRemove={(entry) => console.log('Remove:', entry.name)}
      />
    </div>
  ),
};

export const CardMinimalMode: StoryObj<typeof LocalProjectCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e' }}>
      <LocalProjectCard
        entry={mockAlexandriaRepositories[0]}
        actionMode="minimal"
        onSelect={(entry) => console.log('Selected:', entry.name)}
        onOpen={(entry) => console.log('Open:', entry.name)}
      />
    </div>
  ),
};

export const CardAddToWorkspaceMode: StoryObj<typeof LocalProjectCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e' }}>
      <LocalProjectCard
        entry={mockAlexandriaRepositories[0]}
        actionMode="add-to-workspace"
        onSelect={(entry) => console.log('Selected:', entry.name)}
        onAddToWorkspace={(entry) =>
          console.log('Add to workspace:', entry.name)
        }
      />
    </div>
  ),
};

export const CardLocalOnly: StoryObj<typeof LocalProjectCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e' }}>
      <LocalProjectCard
        entry={mockAlexandriaRepositories[4]} // local-scripts (no GitHub)
        onSelect={(entry) => console.log('Selected:', entry.name)}
        onOpen={(entry) => console.log('Open:', entry.name)}
        onRemove={(entry) => console.log('Remove:', entry.name)}
      />
    </div>
  ),
};

export const CardCompact: StoryObj<typeof LocalProjectCard> = {
  render: () => (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#1a1a2e',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <LocalProjectCard
        entry={mockAlexandriaRepositories[0]}
        compact={true}
        onSelect={(entry) => console.log('Selected:', entry.name)}
        onOpen={(entry) => console.log('Open:', entry.name)}
        onRemove={(entry) => console.log('Remove:', entry.name)}
      />
    </div>
  ),
};

export const CardCompactList: StoryObj<typeof LocalProjectCard> = {
  render: () => (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#1a1a2e',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {mockAlexandriaRepositories.slice(0, 3).map((entry) => (
        <LocalProjectCard
          key={entry.path}
          entry={entry}
          compact={true}
          onSelect={(e) => console.log('Selected:', e.name)}
          onOpen={(e) => console.log('Open:', e.name)}
        />
      ))}
    </div>
  ),
};

/**
 * RepositoryAvatar component stories
 */
export const AvatarWithOwner: StoryObj<typeof RepositoryAvatar> = {
  render: () => (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#1a1a2e',
        display: 'flex',
        gap: '16px',
      }}
    >
      <RepositoryAvatar owner="principal-ade" size={32} />
      <RepositoryAvatar owner="principal-ai" size={32} />
      <RepositoryAvatar owner="facebook" size={32} />
    </div>
  ),
};

export const AvatarSizes: StoryObj<typeof RepositoryAvatar> = {
  render: () => (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#1a1a2e',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <RepositoryAvatar owner="principal-ade" size={24} />
      <RepositoryAvatar owner="principal-ade" size={32} />
      <RepositoryAvatar owner="principal-ade" size={48} />
      <RepositoryAvatar owner="principal-ade" size={64} />
    </div>
  ),
};

export const AvatarFallback: StoryObj<typeof RepositoryAvatar> = {
  render: () => (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#1a1a2e',
        display: 'flex',
        gap: '16px',
      }}
    >
      <RepositoryAvatar
        size={32}
        fallbackIcon={
          <span style={{ color: '#888', fontWeight: 'bold' }}>P</span>
        }
      />
      <RepositoryAvatar
        size={32}
        fallbackIcon={
          <span style={{ color: '#888', fontWeight: 'bold' }}>A</span>
        }
      />
    </div>
  ),
};

/**
 * Drag-and-Drop Demo
 *
 * Tests dragging project cards to an external drop zone.
 * This demonstrates the drag-drop integration for adding projects to collections.
 */
const DragDropDemoComponent = () => {
  const [droppedData, setDroppedData] = useState<string | null>(null);
  const [droppedMetadata, setDroppedMetadata] = useState<any>(null);

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '16px',
        height: '400px',
        backgroundColor: '#1a1a2e',
      }}
    >
      {/* Source: Draggable project cards */}
      <div
        style={{
          flex: 1,
          border: '1px solid #444',
          borderRadius: '8px',
          padding: '16px',
          overflow: 'auto',
        }}
      >
        <h3
          style={{
            color: '#fff',
            marginTop: 0,
            marginBottom: '16px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Drag Source (Project Cards)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mockAlexandriaRepositories.slice(0, 3).map((entry) => (
            <LocalProjectCard
              key={entry.path}
              entry={entry}
              onSelect={(e) => console.log('Selected:', e.name)}
              onOpen={(e) => console.log('Open:', e.name)}
            />
          ))}
        </div>
      </div>

      {/* Target: Drop zone to test */}
      <div
        style={{
          flex: 1,
          border: '2px dashed #3b82f6',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
          e.currentTarget.style.borderColor = '#60a5fa';
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
          e.currentTarget.style.borderColor = '#3b82f6';
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
          e.currentTarget.style.borderColor = '#3b82f6';

          const data = e.dataTransfer.getData('application/x-panel-data');
          if (data) {
            const panelData = JSON.parse(data);
            setDroppedData(panelData.primaryData);
            setDroppedMetadata(panelData.metadata);
          }
        }}
      >
        <h3
          style={{
            color: '#3b82f6',
            marginTop: 0,
            marginBottom: '16px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Drop Zone (Test Area)
        </h3>
        {droppedData ? (
          <div style={{ width: '100%' }}>
            <div
              style={{
                color: '#10b981',
                marginBottom: '12px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              ✓ Project Dropped!
            </div>
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
              }}
            >
              <div style={{ color: '#888', marginBottom: '8px' }}>Path:</div>
              <div
                style={{
                  color: '#fff',
                  marginBottom: '12px',
                  wordBreak: 'break-all',
                }}
              >
                {droppedData}
              </div>
              {droppedMetadata && (
                <>
                  <div style={{ color: '#888', marginBottom: '8px' }}>
                    Metadata:
                  </div>
                  <pre style={{ color: '#fff', margin: 0, overflow: 'auto' }}>
                    {JSON.stringify(droppedMetadata, null, 2)}
                  </pre>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
            <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
              Drag project cards here to test
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const DragDropDemo: StoryObj<typeof LocalProjectCard> = {
  render: () => <DragDropDemoComponent />,
};
