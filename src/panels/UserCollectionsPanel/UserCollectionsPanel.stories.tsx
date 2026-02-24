import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserCollectionsPanel } from './index';
import {
  createPanelContext,
  createDataSlice,
} from '@principal-ade/panel-framework-core';
import type {
  PanelActions,
  PanelEventEmitter,
  PanelEvent,
  DataSlice,
} from '../../types';
import type { Collection } from '@principal-ai/alexandria-collections';
import type {
  UserCollectionsSlice,
  UserCollectionsPanelPropsTyped,
  UserCollectionsPanelContext,
} from './types';

// Mock collections
const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Frontend Tools',
    description: 'UI libraries and frameworks',
    icon: 'folder',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 2,
    members: [
      { repositoryId: 'facebook/react', collectionId: 'col-1', addedAt: Date.now() - 86400000 * 10 },
      { repositoryId: 'vuejs/vue', collectionId: 'col-1', addedAt: Date.now() - 86400000 * 8 },
      { repositoryId: 'sveltejs/svelte', collectionId: 'col-1', addedAt: Date.now() - 86400000 * 5 },
    ],
  },
  {
    id: 'col-2',
    name: 'Backend Infrastructure',
    description: 'Server-side tools and databases',
    icon: 'server',
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 1,
    members: [
      { repositoryId: 'nodejs/node', collectionId: 'col-2', addedAt: Date.now() - 86400000 * 20 },
      { repositoryId: 'denoland/deno', collectionId: 'col-2', addedAt: Date.now() - 86400000 * 15 },
    ],
  },
  {
    id: 'col-3',
    name: 'DevOps',
    description: 'CI/CD and deployment tools',
    icon: 'cloud',
    createdAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now() - 86400000 * 7,
    members: [
      { repositoryId: 'docker/compose', collectionId: 'col-3', addedAt: Date.now() - 86400000 * 12 },
      { repositoryId: 'kubernetes/kubernetes', collectionId: 'col-3', addedAt: Date.now() - 86400000 * 10 },
      { repositoryId: 'hashicorp/terraform', collectionId: 'col-3', addedAt: Date.now() - 86400000 * 8 },
      { repositoryId: 'ansible/ansible', collectionId: 'col-3', addedAt: Date.now() - 86400000 * 5 },
    ],
  },
  {
    id: 'col-4',
    name: 'Machine Learning',
    description: 'AI and ML libraries',
    icon: 'brain',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now(),
    members: [
      { repositoryId: 'pytorch/pytorch', collectionId: 'col-4', addedAt: Date.now() - 86400000 * 5 },
      { repositoryId: 'tensorflow/tensorflow', collectionId: 'col-4', addedAt: Date.now() - 86400000 * 3 },
    ],
  },
];

// Mock actions
const mockActions: PanelActions = {
  openFile: (filePath: string) => {
    console.log('Open file:', filePath);
  },
  navigateToPanel: (panelId: string) => {
    console.log('Navigate to panel:', panelId);
  },
  notifyPanels: <T,>(event: PanelEvent<T>) => {
    console.log('Notify panels:', event);
  },
};

// Mock events
const mockEvents: PanelEventEmitter = {
  emit: <T,>(event: PanelEvent<T>) => {
    console.log('Emit event:', event);
  },
  on: <T,>(_type: string, _handler: (event: PanelEvent<T>) => void) => {
    console.log('Subscribe to event:', _type);
    return () => console.log('Unsubscribe from event:', _type);
  },
  off: <T,>(_type: string, _handler: (event: PanelEvent<T>) => void) => {
    console.log('Unsubscribe from event:', _type);
  },
};

/**
 * Helper to create a typed panel context with slices as direct properties
 */
function createTypedPanelContext(
  currentScope: Parameters<typeof createPanelContext>[0],
  slices: {
    userCollections: DataSlice<UserCollectionsSlice>;
  }
): UserCollectionsPanelContext {
  const baseContext = createPanelContext(currentScope, [slices.userCollections]);

  return {
    ...baseContext,
    userCollections: slices.userCollections,
  } as UserCollectionsPanelContext;
}

const meta: Meta<typeof UserCollectionsPanel> = {
  title: 'Panels/UserCollectionsPanel',
  component: UserCollectionsPanel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserCollectionsPanel>;

export const Default: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userCollections: createDataSlice<UserCollectionsSlice>(
          'userCollections',
          'global',
          {
            collections: mockCollections,
            memberships: [],
            loading: false,
            gitHubRepoExists: true,
            gitHubRepoUrl: 'https://github.com/user/web-ade-collections',
          }
        ),
      }
    ),
    actions: {
      ...mockActions,
      createCollection: async (name: string, description?: string) => {
        console.log('Create collection:', name, description);
        return {
          id: `col-${Date.now()}`,
          name,
          description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          members: [],
        };
      },
      deleteCollection: async (collectionId: string) => {
        console.log('Delete collection:', collectionId);
      },
      refreshCollections: async () => {
        console.log('Refresh collections');
      },
    },
    events: mockEvents,
  } as unknown as UserCollectionsPanelPropsTyped,
};

export const Empty: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userCollections: createDataSlice<UserCollectionsSlice>(
          'userCollections',
          'global',
          {
            collections: [],
            memberships: [],
            loading: false,
            gitHubRepoExists: false,
          }
        ),
      }
    ),
    actions: {
      ...mockActions,
      createCollection: async (name: string, description?: string) => {
        console.log('Create collection:', name, description);
        return {
          id: `col-${Date.now()}`,
          name,
          description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          members: [],
        };
      },
      enableGitHubSync: async () => {
        console.log('Enable GitHub sync');
      },
    },
    events: mockEvents,
  } as unknown as UserCollectionsPanelPropsTyped,
};

export const Loading: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userCollections: createDataSlice<UserCollectionsSlice>(
          'userCollections',
          'global',
          {
            collections: [],
            memberships: [],
            loading: true,
          },
          { loading: true }
        ),
      }
    ),
    actions: mockActions,
    events: mockEvents,
  } as unknown as UserCollectionsPanelPropsTyped,
};

export const WithoutGitHubSync: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userCollections: createDataSlice<UserCollectionsSlice>(
          'userCollections',
          'global',
          {
            collections: mockCollections.slice(0, 2),
            memberships: [],
            loading: false,
            gitHubRepoExists: false,
          }
        ),
      }
    ),
    actions: {
      ...mockActions,
      enableGitHubSync: async () => {
        console.log('Enable GitHub sync');
      },
      createCollection: async (name: string, description?: string) => {
        console.log('Create collection:', name, description);
        return {
          id: `col-${Date.now()}`,
          name,
          description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          members: [],
        };
      },
    },
    events: mockEvents,
  } as unknown as UserCollectionsPanelPropsTyped,
};

export const ManyCollections: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userCollections: createDataSlice<UserCollectionsSlice>(
          'userCollections',
          'global',
          {
            collections: [
              ...mockCollections,
              ...Array.from({ length: 12 }, (_, i) => {
                const colId = `col-extra-${i}`;
                return {
                  id: colId,
                  name: `Collection ${i + 1}`,
                  description: `Description for collection ${i + 1}`,
                  icon: 'folder',
                  createdAt: Date.now() - 86400000 * (i + 1),
                  updatedAt: Date.now() - 86400000 * i,
                  members: Array.from(
                    { length: Math.floor(Math.random() * 10) },
                    (_, j) => ({
                      repositoryId: `org/repo-${j}`,
                      collectionId: colId,
                      addedAt: Date.now() - 86400000 * j,
                    })
                  ),
                };
              }),
            ],
            memberships: [],
            loading: false,
            gitHubRepoExists: true,
            gitHubRepoUrl: 'https://github.com/user/web-ade-collections',
          }
        ),
      }
    ),
    actions: {
      ...mockActions,
      createCollection: async (name: string, description?: string) => {
        console.log('Create collection:', name, description);
        return {
          id: `col-${Date.now()}`,
          name,
          description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          members: [],
        };
      },
    },
    events: mockEvents,
  } as unknown as UserCollectionsPanelPropsTyped,
};

export const WithDefaultSearch: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userCollections: createDataSlice<UserCollectionsSlice>(
          'userCollections',
          'global',
          {
            collections: mockCollections,
            memberships: [],
            loading: false,
            gitHubRepoExists: true,
          }
        ),
      }
    ),
    actions: {
      ...mockActions,
      createCollection: async (name: string, description?: string) => {
        console.log('Create collection:', name, description);
        return {
          id: `col-${Date.now()}`,
          name,
          description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          members: [],
        };
      },
    },
    events: mockEvents,
    defaultShowSearch: true,
  } as unknown as UserCollectionsPanelPropsTyped,
};
