import type { Meta, StoryObj } from '@storybook/react';
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

    return <LocalProjectsPanel context={context} actions={actions} events={events} />;
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
            data: { repositories: [], loading: false } as AlexandriaRepositoriesSlice,
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockLocalProjectsActions();
    const events = createMockEvents();

    return <LocalProjectsPanel context={context} actions={actions} events={events} />;
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
            data: { repositories: [], loading: true } as AlexandriaRepositoriesSlice,
            loading: true,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockLocalProjectsActions();
    const events = createMockEvents();

    return <LocalProjectsPanel context={context} actions={actions} events={events} />;
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

    return <LocalProjectsPanel context={context} actions={actions} events={events} />;
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
        onAddToWorkspace={(entry) => console.log('Add to workspace:', entry.name)}
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
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', width: '100%', maxWidth: '400px' }}>
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
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', display: 'flex', gap: '16px' }}>
      <RepositoryAvatar owner="principal-ade" size={32} />
      <RepositoryAvatar owner="principal-ai" size={32} />
      <RepositoryAvatar owner="facebook" size={32} />
    </div>
  ),
};

export const AvatarSizes: StoryObj<typeof RepositoryAvatar> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <RepositoryAvatar owner="principal-ade" size={24} />
      <RepositoryAvatar owner="principal-ade" size={32} />
      <RepositoryAvatar owner="principal-ade" size={48} />
      <RepositoryAvatar owner="principal-ade" size={64} />
    </div>
  ),
};

export const AvatarFallback: StoryObj<typeof RepositoryAvatar> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', display: 'flex', gap: '16px' }}>
      <RepositoryAvatar
        size={32}
        fallbackIcon={<span style={{ color: '#888', fontWeight: 'bold' }}>P</span>}
      />
      <RepositoryAvatar
        size={32}
        fallbackIcon={<span style={{ color: '#888', fontWeight: 'bold' }}>A</span>}
      />
    </div>
  ),
};
