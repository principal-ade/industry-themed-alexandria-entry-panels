import type { Meta, StoryObj } from '@storybook/react-vite';
import { WorkspaceRepositoriesPanel } from './index';
import {
  createPanelContext,
  createDataSlice,
} from '@principal-ade/panel-framework-core';
import type {
  PanelComponentProps,
  PanelActions,
  PanelEventEmitter,
  PanelEvent,
} from '../../types';
import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library/types';
import type { Workspace, WorkspaceRepositoriesPanelPropsTyped } from './types';

// Mock workspace
const mockWorkspace: Workspace = {
  id: 'workspace-1',
  name: 'Active Projects',
  description: 'Currently active development projects',
  createdAt: Date.now() - 86400000 * 30,
  updatedAt: Date.now(),
  suggestedClonePath: '/Users/developer/workspaces/active',
};

// Mock repositories
const mockRepositories: AlexandriaEntry[] = [
  {
    name: 'alexandria-workspace-panel',
    path: '/Users/developer/projects/alexandria-workspace-panel' as AlexandriaEntry['path'],
    remoteUrl: 'https://github.com/a24z-ai/alexandria-workspace-panel',
    registeredAt: new Date().toISOString(),
    hasViews: true,
    viewCount: 3,
    views: [],
    github: {
      id: 'a24z-ai/alexandria-workspace-panel',
      owner: 'a24z-ai',
      name: 'alexandria-workspace-panel',
      description: 'Workspace and repository management panel',
      stars: 42,
      primaryLanguage: 'TypeScript',
      lastUpdated: new Date().toISOString(),
      isPublic: true,
    },
  },
  {
    name: 'data-pipeline',
    path: '/Users/developer/projects/data-pipeline' as AlexandriaEntry['path'],
    remoteUrl: 'https://github.com/company/data-pipeline',
    registeredAt: new Date().toISOString(),
    hasViews: false,
    viewCount: 0,
    views: [],
    github: {
      id: 'company/data-pipeline',
      owner: 'company',
      name: 'data-pipeline',
      description: 'ETL pipeline for processing large datasets',
      stars: 128,
      primaryLanguage: 'Python',
      lastUpdated: new Date().toISOString(),
      isPublic: false,
    },
  },
  {
    name: 'fast-parser',
    path: '/Users/developer/projects/fast-parser' as AlexandriaEntry['path'],
    remoteUrl: 'https://github.com/rustlang/fast-parser',
    registeredAt: new Date().toISOString(),
    hasViews: true,
    viewCount: 1,
    views: [],
    github: {
      id: 'rustlang/fast-parser',
      owner: 'rustlang',
      name: 'fast-parser',
      description: 'High-performance parser written in Rust',
      stars: 892,
      primaryLanguage: 'Rust',
      lastUpdated: new Date().toISOString(),
      isPublic: true,
    },
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
 * @deprecated This panel is deprecated. Use WorkspaceCollectionPanel instead.
 */
const meta: Meta<typeof WorkspaceRepositoriesPanel> = {
  title: 'Panels/WorkspaceRepositoriesPanel (Deprecated)',
  component: WorkspaceRepositoriesPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '⚠️ **DEPRECATED**: This panel is deprecated. Use `WorkspaceCollectionPanel` instead.',
      },
    },
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
type Story = StoryObj<typeof WorkspaceRepositoriesPanel>;

export const Default: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: {
          name: mockWorkspace.name,
          path: mockWorkspace.suggestedClonePath || '',
        },
      },
      [
        createDataSlice<Workspace>('workspace', 'workspace', mockWorkspace),
        createDataSlice<AlexandriaEntry[]>(
          'workspaceRepositories',
          'workspace',
          mockRepositories
        ),
        createDataSlice<string>('userHomePath', 'global', '/Users/developer'),
      ]
    ),
    actions: mockActions,
    events: mockEvents,
  } as unknown as WorkspaceRepositoriesPanelPropsTyped,
};

export const NoWorkspaceSelected: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
      },
      [
        createDataSlice<Workspace | null>('workspace', 'workspace', null),
        createDataSlice<AlexandriaEntry[]>(
          'workspaceRepositories',
          'workspace',
          []
        ),
        createDataSlice<string>('userHomePath', 'global', '/Users/developer'),
      ]
    ),
    actions: mockActions,
    events: mockEvents,
  } as unknown as WorkspaceRepositoriesPanelPropsTyped,
};

export const EmptyWorkspace: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: {
          name: mockWorkspace.name,
          path: mockWorkspace.suggestedClonePath || '',
        },
      },
      [
        createDataSlice<Workspace>('workspace', 'workspace', mockWorkspace),
        createDataSlice<AlexandriaEntry[]>(
          'workspaceRepositories',
          'workspace',
          []
        ),
        createDataSlice<string>('userHomePath', 'global', '/Users/developer'),
      ]
    ),
    actions: mockActions,
    events: mockEvents,
  } as unknown as WorkspaceRepositoriesPanelPropsTyped,
};

export const Loading: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: {
          name: mockWorkspace.name,
          path: mockWorkspace.suggestedClonePath || '',
        },
      },
      [
        createDataSlice<Workspace>('workspace', 'workspace', mockWorkspace, {
          loading: true,
        }),
        createDataSlice<AlexandriaEntry[]>(
          'workspaceRepositories',
          'workspace',
          [],
          {
            loading: true,
          }
        ),
        createDataSlice<string>('userHomePath', 'global', '/Users/developer'),
      ]
    ),
    actions: mockActions,
    events: mockEvents,
  } as unknown as WorkspaceRepositoriesPanelPropsTyped,
};

export const MixedLocations: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: {
          name: mockWorkspace.name,
          path: mockWorkspace.suggestedClonePath || '',
        },
      },
      [
        createDataSlice<Workspace>('workspace', 'workspace', mockWorkspace),
        createDataSlice<AlexandriaEntry[]>(
          'workspaceRepositories',
          'workspace',
          [
            {
              name: 'project-in-workspace',
              path: '/Users/developer/workspaces/active/project-in-workspace' as AlexandriaEntry['path'],
              remoteUrl: 'https://github.com/company/project-in-workspace',
              registeredAt: new Date().toISOString(),
              hasViews: true,
              viewCount: 2,
              views: [],
              github: {
                id: 'company/project-in-workspace',
                owner: 'company',
                name: 'project-in-workspace',
                description: 'Main application frontend',
                stars: 45,
                primaryLanguage: 'TypeScript',
                lastUpdated: new Date().toISOString(),
                isPublic: true,
              },
            },
            {
              name: 'legacy-api',
              path: '/Users/developer/other-projects/legacy-api' as AlexandriaEntry['path'],
              remoteUrl: 'https://github.com/company/legacy-api',
              registeredAt: new Date().toISOString(),
              hasViews: false,
              viewCount: 0,
              views: [],
              github: {
                id: 'company/legacy-api',
                owner: 'company',
                name: 'legacy-api',
                description: 'Legacy REST API service',
                stars: 23,
                primaryLanguage: 'Python',
                lastUpdated: new Date().toISOString(),
                isPublic: false,
              },
            },
          ]
        ),
        createDataSlice<string>('userHomePath', 'global', '/Users/developer'),
      ]
    ),
    actions: {
      ...mockActions,
      isRepositoryInWorkspaceDirectory: async (repo: AlexandriaEntry) => {
        return repo.path.startsWith('/Users/developer/workspaces/active');
      },
      moveRepositoryToWorkspaceDirectory: async (
        repo: AlexandriaEntry,
        workspaceId: string
      ) => {
        console.log(
          'Move repository:',
          repo.name,
          'to workspace:',
          workspaceId
        );
        return '';
      },
      removeRepositoryFromWorkspace: async (
        repoId: string,
        workspaceId: string
      ) => {
        console.log(
          'Remove repository:',
          repoId,
          'from workspace:',
          workspaceId
        );
      },
    },
    events: mockEvents,
  } as unknown as WorkspaceRepositoriesPanelPropsTyped,
};
