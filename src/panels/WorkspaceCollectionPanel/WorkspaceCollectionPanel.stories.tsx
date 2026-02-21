import type { Meta, StoryObj } from '@storybook/react-vite';
import { WorkspaceCollectionPanel } from './index';
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
import type { GitHubRepository } from '../shared/github-types';
import type {
  Workspace,
  WorkspaceCollectionSlice,
  WorkspaceCollectionRepositoriesSlice,
  WorkspaceCollectionPanelPropsTyped,
} from './types';

// Mock workspace
const mockWorkspace: Workspace = {
  id: 'workspace-1',
  name: 'Active Projects',
  description: 'Currently active development projects',
  createdAt: Date.now() - 86400000 * 30,
  updatedAt: Date.now(),
};

// Mock GitHub repositories
const mockRepositories: GitHubRepository[] = [
  {
    id: 123456,
    name: 'alexandria-workspace-panel',
    full_name: 'a24z-ai/alexandria-workspace-panel',
    owner: {
      login: 'a24z-ai',
      avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4',
    },
    private: false,
    html_url: 'https://github.com/a24z-ai/alexandria-workspace-panel',
    description: 'Workspace and repository management panel',
    clone_url: 'https://github.com/a24z-ai/alexandria-workspace-panel.git',
    updated_at: new Date().toISOString(),
    pushed_at: new Date().toISOString(),
    language: 'TypeScript',
    stargazers_count: 42,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 234567,
    name: 'data-pipeline',
    full_name: 'company/data-pipeline',
    owner: {
      login: 'company',
      avatar_url: 'https://avatars.githubusercontent.com/u/234567?v=4',
    },
    private: true,
    html_url: 'https://github.com/company/data-pipeline',
    description: 'ETL pipeline for processing large datasets',
    clone_url: 'https://github.com/company/data-pipeline.git',
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    pushed_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    language: 'Python',
    stargazers_count: 128,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 345678,
    name: 'fast-parser',
    full_name: 'rustlang/fast-parser',
    owner: {
      login: 'rustlang',
      avatar_url: 'https://avatars.githubusercontent.com/u/345678?v=4',
    },
    private: false,
    html_url: 'https://github.com/rustlang/fast-parser',
    description: 'High-performance parser written in Rust',
    clone_url: 'https://github.com/rustlang/fast-parser.git',
    updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    pushed_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    language: 'Rust',
    stargazers_count: 892,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 456789,
    name: 'react-components',
    full_name: 'design-system/react-components',
    owner: {
      login: 'design-system',
      avatar_url: 'https://avatars.githubusercontent.com/u/456789?v=4',
    },
    private: false,
    html_url: 'https://github.com/design-system/react-components',
    description:
      'Reusable React components for the design system with TypeScript support and comprehensive documentation',
    clone_url: 'https://github.com/design-system/react-components.git',
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    pushed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    language: 'TypeScript',
    stargazers_count: 256,
    default_branch: 'main',
    fork: false,
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

const meta: Meta<typeof WorkspaceCollectionPanel> = {
  title: 'Panels/WorkspaceCollectionPanel',
  component: WorkspaceCollectionPanel,
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
type Story = StoryObj<typeof WorkspaceCollectionPanel>;

export const Default: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: { name: mockWorkspace.name, path: '' },
      },
      [
        createDataSlice<WorkspaceCollectionSlice>('workspace', 'workspace', {
          workspace: mockWorkspace,
          loading: false,
        }),
        createDataSlice<WorkspaceCollectionRepositoriesSlice>(
          'workspaceCollectionRepositories',
          'workspace',
          {
            repositories: mockRepositories,
            loading: false,
          }
        ),
      ]
    ),
    actions: {
      ...mockActions,
      navigateToRepository: (owner: string, repo: string) => {
        console.log('Navigate to repository:', `${owner}/${repo}`);
      },
      removeRepositoryFromWorkspace: async (
        repoKey: string,
        workspaceId: string
      ) => {
        console.log(
          'Remove repository:',
          repoKey,
          'from workspace:',
          workspaceId
        );
      },
      previewRepository: (repository: GitHubRepository) => {
        console.log('Preview repository:', repository.full_name);
      },
    },
    events: mockEvents,
  } as WorkspaceCollectionPanelPropsTyped,
};

export const NoWorkspaceSelected: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
      },
      [
        createDataSlice<WorkspaceCollectionSlice>('workspace', 'workspace', {
          workspace: null,
          loading: false,
        }),
        createDataSlice<WorkspaceCollectionRepositoriesSlice>(
          'workspaceCollectionRepositories',
          'workspace',
          {
            repositories: [],
            loading: false,
          }
        ),
      ]
    ),
    actions: mockActions,
    events: mockEvents,
  } as WorkspaceCollectionPanelPropsTyped,
};

export const EmptyWorkspace: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: { name: mockWorkspace.name, path: '' },
      },
      [
        createDataSlice<WorkspaceCollectionSlice>('workspace', 'workspace', {
          workspace: mockWorkspace,
          loading: false,
        }),
        createDataSlice<WorkspaceCollectionRepositoriesSlice>(
          'workspaceCollectionRepositories',
          'workspace',
          {
            repositories: [],
            loading: false,
          }
        ),
      ]
    ),
    actions: mockActions,
    events: mockEvents,
  } as WorkspaceCollectionPanelPropsTyped,
};

export const Loading: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: { name: mockWorkspace.name, path: '' },
      },
      [
        createDataSlice<WorkspaceCollectionSlice>('workspace', 'workspace', {
          workspace: mockWorkspace,
          loading: true,
        }),
        createDataSlice<WorkspaceCollectionRepositoriesSlice>(
          'workspaceCollectionRepositories',
          'workspace',
          {
            repositories: [],
            loading: true,
          }
        ),
      ]
    ),
    actions: mockActions,
    events: mockEvents,
  } as WorkspaceCollectionPanelPropsTyped,
};

export const WithError: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: { name: mockWorkspace.name, path: '' },
      },
      [
        createDataSlice<WorkspaceCollectionSlice>('workspace', 'workspace', {
          workspace: mockWorkspace,
          loading: false,
          error: 'Failed to load repositories. Please try again.',
        }),
        createDataSlice<WorkspaceCollectionRepositoriesSlice>(
          'workspaceCollectionRepositories',
          'workspace',
          {
            repositories: mockRepositories.slice(0, 2),
            loading: false,
          }
        ),
      ]
    ),
    actions: mockActions,
    events: mockEvents,
  } as WorkspaceCollectionPanelPropsTyped,
};

export const ManyRepositories: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: { name: 'Large Collection', path: '' },
      },
      [
        createDataSlice<WorkspaceCollectionSlice>('workspace', 'workspace', {
          workspace: {
            ...mockWorkspace,
            name: 'Large Collection',
            description:
              'A workspace with many repositories to test scrolling and filtering',
          },
          loading: false,
        }),
        createDataSlice<WorkspaceCollectionRepositoriesSlice>(
          'workspaceCollectionRepositories',
          'workspace',
          {
            repositories: [
              ...mockRepositories,
              ...Array.from({ length: 20 }, (_, i) => ({
                id: 500000 + i,
                name: `project-${i + 1}`,
                full_name: `org/project-${i + 1}`,
                owner: {
                  login: 'org',
                  avatar_url: `https://avatars.githubusercontent.com/u/${500000 + i}?v=4`,
                },
                private: i % 3 === 0,
                html_url: `https://github.com/org/project-${i + 1}`,
                description: `Project ${i + 1} description - a sample repository for testing`,
                clone_url: `https://github.com/org/project-${i + 1}.git`,
                updated_at: new Date(Date.now() - 86400000 * i).toISOString(),
                pushed_at: new Date(Date.now() - 86400000 * i).toISOString(),
                language: ['TypeScript', 'Python', 'Go', 'Rust', 'JavaScript'][
                  i % 5
                ],
                stargazers_count: Math.floor(Math.random() * 1000),
                default_branch: 'main',
                fork: false,
              })),
            ],
            loading: false,
          }
        ),
      ]
    ),
    actions: {
      ...mockActions,
      navigateToRepository: (owner: string, repo: string) => {
        console.log('Navigate to repository:', `${owner}/${repo}`);
      },
      removeRepositoryFromWorkspace: async (
        repoKey: string,
        workspaceId: string
      ) => {
        console.log(
          'Remove repository:',
          repoKey,
          'from workspace:',
          workspaceId
        );
      },
    },
    events: mockEvents,
  } as WorkspaceCollectionPanelPropsTyped,
};

export const ReadOnly: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: { name: mockWorkspace.name, path: '' },
      },
      [
        createDataSlice<WorkspaceCollectionSlice>('workspace', 'workspace', {
          workspace: mockWorkspace,
          loading: false,
        }),
        createDataSlice<WorkspaceCollectionRepositoriesSlice>(
          'workspaceCollectionRepositories',
          'workspace',
          {
            repositories: mockRepositories,
            loading: false,
          }
        ),
      ]
    ),
    actions: {
      ...mockActions,
      // No navigateToRepository or removeRepositoryFromWorkspace - read only mode
    },
    events: mockEvents,
  } as WorkspaceCollectionPanelPropsTyped,
};

export const PermanentSearch: Story = {
  args: {
    context: createPanelContext(
      {
        type: 'workspace',
        workspace: { name: mockWorkspace.name, path: '' },
      },
      [
        createDataSlice<WorkspaceCollectionSlice>('workspace', 'workspace', {
          workspace: mockWorkspace,
          loading: false,
        }),
        createDataSlice<WorkspaceCollectionRepositoriesSlice>(
          'workspaceCollectionRepositories',
          'workspace',
          {
            repositories: mockRepositories,
            loading: false,
          }
        ),
      ]
    ),
    actions: {
      ...mockActions,
      navigateToRepository: (owner: string, repo: string) => {
        console.log('Navigate to repository:', `${owner}/${repo}`);
      },
      removeRepositoryFromWorkspace: async (
        repoKey: string,
        workspaceId: string
      ) => {
        console.log(
          'Remove repository:',
          repoKey,
          'from workspace:',
          workspaceId
        );
      },
      previewRepository: (repository: GitHubRepository) => {
        console.log('Preview repository:', repository.full_name);
      },
    },
    events: mockEvents,
    defaultShowSearch: true,
  } as unknown as WorkspaceCollectionPanelPropsTyped,
};
