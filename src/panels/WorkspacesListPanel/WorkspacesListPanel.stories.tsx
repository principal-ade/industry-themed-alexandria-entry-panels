import type { Meta, StoryObj } from '@storybook/react';
import { WorkspacesListPanel } from './index';
import { WorkspaceCard } from './WorkspaceCard';
import {
  createMockContext,
  createMockWorkspacesListActions,
  createMockEvents,
  mockWorkspaces,
} from '../../mocks/panelContext';
import type { WorkspacesSlice } from './types';

/**
 * WorkspacesListPanel - Browse and manage workspaces
 *
 * This panel displays a list of workspaces with:
 * - Search/filter functionality by workspace name or repository names
 * - Create new workspace capability
 * - Edit workspace names inline
 * - Open/delete workspace actions
 * - Default workspace highlighting
 */
const meta: Meta<typeof WorkspacesListPanel> = {
  title: 'Panels/WorkspacesListPanel',
  component: WorkspacesListPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Workspaces List Panel provides a centralized view of all workspaces.

## Features
- **Search/Filter**: Find workspaces by name, description, or repository names within them
- **Create Workspaces**: Add new workspaces with custom names
- **Edit Names**: Inline editing of workspace names
- **Open Workspaces**: Launch workspaces in dedicated windows
- **Delete Workspaces**: Remove workspaces with confirmation
- **Default Highlighting**: Default workspace is displayed first with a label

## Data Requirements
This panel requires the \`workspaces\` data slice to be provided by the host application.

## Events
- \`industry-theme.workspaces-list:workspace:selected\` - Emitted when a workspace is selected
- \`industry-theme.workspaces-list:workspace:opened\` - Emitted when a workspace is opened
- \`industry-theme.workspaces-list:workspace:created\` - Emitted when a workspace is created
- \`industry-theme.workspaces-list:workspace:deleted\` - Emitted when a workspace is deleted
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
type Story = StoryObj<typeof WorkspacesListPanel>;

/**
 * Default state with mock workspaces
 */
export const Default: Story = {
  render: () => {
    const context = createMockContext();
    const actions = createMockWorkspacesListActions();
    const events = createMockEvents();

    return <WorkspacesListPanel context={context} actions={actions} events={events} />;
  },
};

/**
 * Empty state - no workspaces
 */
export const Empty: Story = {
  render: () => {
    const context = createMockContext({
      slices: new Map([
        [
          'workspaces',
          {
            scope: 'global',
            name: 'workspaces',
            data: {
              workspaces: [],
              defaultWorkspaceId: null,
              loading: false,
            } as WorkspacesSlice,
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockWorkspacesListActions();
    const events = createMockEvents();

    return <WorkspacesListPanel context={context} actions={actions} events={events} />;
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
          'workspaces',
          {
            scope: 'global',
            name: 'workspaces',
            data: {
              workspaces: [],
              defaultWorkspaceId: null,
              loading: true,
            } as WorkspacesSlice,
            loading: true,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockWorkspacesListActions();
    const events = createMockEvents();

    return <WorkspacesListPanel context={context} actions={actions} events={events} />;
  },
};

/**
 * Read-only mode (no create/delete actions)
 */
export const ReadOnly: Story = {
  render: () => {
    const context = createMockContext();
    const actions = {
      ...createMockWorkspacesListActions(),
      createWorkspace: undefined,
      deleteWorkspace: undefined,
      updateWorkspace: undefined,
    };
    const events = createMockEvents();

    return <WorkspacesListPanel context={context} actions={actions} events={events} />;
  },
};

/**
 * Many workspaces (scrolling test)
 */
export const ManyWorkspaces: Story = {
  render: () => {
    const manyWorkspaces = [
      ...mockWorkspaces,
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `workspace-extra-${i}`,
        name: `Workspace ${i + 5}`,
        description: `Description for workspace ${i + 5}`,
        createdAt: Date.now() - 86400000 * (i + 1),
        updatedAt: Date.now() - 86400000 * i,
      })),
    ];

    const context = createMockContext({
      slices: new Map([
        [
          'workspaces',
          {
            scope: 'global',
            name: 'workspaces',
            data: {
              workspaces: manyWorkspaces,
              defaultWorkspaceId: 'workspace-1',
              loading: false,
            } as WorkspacesSlice,
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockWorkspacesListActions();
    const events = createMockEvents();

    return <WorkspacesListPanel context={context} actions={actions} events={events} />;
  },
};

/**
 * WorkspaceCard component stories
 */
export const CardDefault: StoryObj<typeof WorkspaceCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', maxWidth: '400px' }}>
      <WorkspaceCard
        workspace={mockWorkspaces[0]}
        onClick={(ws) => console.log('Clicked:', ws.name)}
        onOpen={(ws) => console.log('Open:', ws.name)}
        onDelete={(ws) => console.log('Delete:', ws.name)}
        onUpdateName={async (id, name) => console.log('Update name:', id, name)}
      />
    </div>
  ),
};

export const CardSelected: StoryObj<typeof WorkspaceCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', maxWidth: '400px' }}>
      <WorkspaceCard
        workspace={mockWorkspaces[0]}
        isSelected={true}
        onClick={(ws) => console.log('Clicked:', ws.name)}
        onOpen={(ws) => console.log('Open:', ws.name)}
        onDelete={(ws) => console.log('Delete:', ws.name)}
        onUpdateName={async (id, name) => console.log('Update name:', id, name)}
      />
    </div>
  ),
};

export const CardDefault_IsDefault: StoryObj<typeof WorkspaceCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', maxWidth: '400px' }}>
      <WorkspaceCard
        workspace={mockWorkspaces[0]}
        isDefault={true}
        onClick={(ws) => console.log('Clicked:', ws.name)}
        onOpen={(ws) => console.log('Open:', ws.name)}
        onDelete={(ws) => console.log('Delete:', ws.name)}
        onUpdateName={async (id, name) => console.log('Update name:', id, name)}
      />
    </div>
  ),
};

export const CardWithoutDescription: StoryObj<typeof WorkspaceCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', maxWidth: '400px' }}>
      <WorkspaceCard
        workspace={mockWorkspaces[3]} // Open Source - no description
        onClick={(ws) => console.log('Clicked:', ws.name)}
        onOpen={(ws) => console.log('Open:', ws.name)}
      />
    </div>
  ),
};

export const CardMinimal: StoryObj<typeof WorkspaceCard> = {
  render: () => (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', maxWidth: '400px' }}>
      <WorkspaceCard
        workspace={mockWorkspaces[1]}
        onClick={(ws) => console.log('Clicked:', ws.name)}
      />
    </div>
  ),
};

export const CardList: StoryObj<typeof WorkspaceCard> = {
  render: () => (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#1a1a2e',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {mockWorkspaces.map((workspace, index) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          isDefault={index === 0}
          onClick={(ws) => console.log('Clicked:', ws.name)}
          onOpen={(ws) => console.log('Open:', ws.name)}
          onDelete={(ws) => console.log('Delete:', ws.name)}
          onUpdateName={async (id, name) => console.log('Update name:', id, name)}
        />
      ))}
    </div>
  ),
};
