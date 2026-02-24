import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserProfilePanel } from './index';
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
  GitHubUserProfile,
  GitHubRepository,
  UserProfileSlice,
  UserProfilePanelPropsTyped,
  UserProfilePanelContext,
} from './types';

// Mock user profile
const mockUser: GitHubUserProfile = {
  login: 'octocat',
  id: 583231,
  avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
  name: 'The Octocat',
  company: '@github',
  location: 'San Francisco',
  email: 'octocat@github.com',
  bio: 'Software engineer passionate about open source and building tools that help developers.',
  public_repos: 42,
  public_gists: 8,
  followers: 12500,
  following: 9,
  created_at: '2011-01-25T18:44:36Z',
  updated_at: new Date().toISOString(),
};

// Mock user repositories (projects)
const mockRepositories: GitHubRepository[] = [
  {
    id: 1001,
    name: 'my-awesome-app',
    full_name: 'octocat/my-awesome-app',
    owner: {
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    },
    private: false,
    html_url: 'https://github.com/octocat/my-awesome-app',
    description: 'A really awesome application I built',
    clone_url: 'https://github.com/octocat/my-awesome-app.git',
    updated_at: new Date().toISOString(),
    pushed_at: new Date().toISOString(),
    language: 'TypeScript',
    stargazers_count: 42,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 1002,
    name: 'dotfiles',
    full_name: 'octocat/dotfiles',
    owner: {
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    },
    private: false,
    html_url: 'https://github.com/octocat/dotfiles',
    description: 'My personal configuration files',
    clone_url: 'https://github.com/octocat/dotfiles.git',
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    pushed_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    language: 'Shell',
    stargazers_count: 15,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 1003,
    name: 'hello-world',
    full_name: 'octocat/hello-world',
    owner: {
      login: 'octocat',
      avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    },
    private: false,
    html_url: 'https://github.com/octocat/hello-world',
    description: 'My first repository',
    clone_url: 'https://github.com/octocat/hello-world.git',
    updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    pushed_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    language: 'JavaScript',
    stargazers_count: 5,
    default_branch: 'main',
    fork: false,
  },
];

// Mock collections
const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Frontend Tools',
    description: 'UI libraries and frameworks I use regularly',
    icon: 'folder',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 2,
    members: [
      { repositoryId: 'facebook/react', collectionId: 'col-1', addedAt: Date.now() - 86400000 * 10 },
      { repositoryId: 'vuejs/vue', collectionId: 'col-1', addedAt: Date.now() - 86400000 * 8 },
    ],
  },
  {
    id: 'col-2',
    name: 'Machine Learning',
    description: 'AI and ML libraries',
    icon: 'brain',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now(),
    members: [
      { repositoryId: 'pytorch/pytorch', collectionId: 'col-2', addedAt: Date.now() - 86400000 * 5 },
      { repositoryId: 'tensorflow/tensorflow', collectionId: 'col-2', addedAt: Date.now() - 86400000 * 3 },
    ],
  },
  {
    id: 'col-3',
    name: 'Utilities',
    description: 'Helpful tools and utilities',
    icon: 'tool',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 1,
    members: [],
  },
];

// Mock starred repositories
const mockStarredRepositories: GitHubRepository[] = [
  {
    id: 10270250,
    name: 'react',
    full_name: 'facebook/react',
    owner: {
      login: 'facebook',
      avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4',
    },
    private: false,
    html_url: 'https://github.com/facebook/react',
    description: 'The library for web and native user interfaces.',
    clone_url: 'https://github.com/facebook/react.git',
    updated_at: new Date().toISOString(),
    pushed_at: new Date().toISOString(),
    language: 'JavaScript',
    stargazers_count: 225000,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 11730342,
    name: 'vue',
    full_name: 'vuejs/vue',
    owner: {
      login: 'vuejs',
      avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4',
    },
    private: false,
    html_url: 'https://github.com/vuejs/vue',
    description: 'This is the repo for Vue 2.',
    clone_url: 'https://github.com/vuejs/vue.git',
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    pushed_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    language: 'TypeScript',
    stargazers_count: 207000,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 74293321,
    name: 'svelte',
    full_name: 'sveltejs/svelte',
    owner: {
      login: 'sveltejs',
      avatar_url: 'https://avatars.githubusercontent.com/u/23617963?v=4',
    },
    private: false,
    html_url: 'https://github.com/sveltejs/svelte',
    description: 'Cybernetically enhanced web apps',
    clone_url: 'https://github.com/sveltejs/svelte.git',
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    pushed_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    language: 'JavaScript',
    stargazers_count: 78000,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 29028775,
    name: 'tensorflow',
    full_name: 'tensorflow/tensorflow',
    owner: {
      login: 'tensorflow',
      avatar_url: 'https://avatars.githubusercontent.com/u/15658638?v=4',
    },
    private: false,
    html_url: 'https://github.com/tensorflow/tensorflow',
    description: 'An Open Source Machine Learning Framework for Everyone',
    clone_url: 'https://github.com/tensorflow/tensorflow.git',
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    pushed_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    language: 'C++',
    stargazers_count: 185000,
    default_branch: 'master',
    fork: false,
  },
  {
    id: 21737465,
    name: 'pytorch',
    full_name: 'pytorch/pytorch',
    owner: {
      login: 'pytorch',
      avatar_url: 'https://avatars.githubusercontent.com/u/21003710?v=4',
    },
    private: false,
    html_url: 'https://github.com/pytorch/pytorch',
    description: 'Tensors and Dynamic neural networks in Python with strong GPU acceleration',
    clone_url: 'https://github.com/pytorch/pytorch.git',
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    pushed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    language: 'Python',
    stargazers_count: 82000,
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

/**
 * Helper to create a typed panel context with slices as direct properties
 */
function createTypedPanelContext(
  currentScope: Parameters<typeof createPanelContext>[0],
  slices: {
    userProfile: DataSlice<UserProfileSlice>;
  }
): UserProfilePanelContext {
  const baseContext = createPanelContext(currentScope, [slices.userProfile]);

  return {
    ...baseContext,
    userProfile: slices.userProfile,
  } as UserProfilePanelContext;
}

const meta: Meta<typeof UserProfilePanel> = {
  title: 'Panels/UserProfilePanel',
  component: UserProfilePanel,
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
type Story = StoryObj<typeof UserProfilePanel>;

export const Default: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userProfile: createDataSlice<UserProfileSlice>('userProfile', 'global', {
          user: mockUser,
          collections: mockCollections,
          repositories: mockRepositories,
          starredRepositories: mockStarredRepositories,
          presence: {
            status: 'online',
            statusMessage: 'Working on something cool',
            activeRepository: 'facebook/react',
          },
          loading: false,
        }),
      }
    ),
    actions: {
      ...mockActions,
      viewOrganization: async (orgLogin: string) => {
        console.log('View organization:', orgLogin);
      },
      viewRepository: async (owner: string, repo: string) => {
        console.log('View repository:', `${owner}/${repo}`);
      },
      cloneRepository: async (repository: GitHubRepository) => {
        console.log('Clone repository:', repository.full_name);
      },
      openInBrowser: async (url: string) => {
        console.log('Open in browser:', url);
      },
    },
    events: mockEvents,
  } as unknown as UserProfilePanelPropsTyped,
};

export const NoUserSelected: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userProfile: createDataSlice<UserProfileSlice>('userProfile', 'global', {
          user: null,
          collections: [],
          repositories: [],
          starredRepositories: [],
          loading: false,
        }),
      }
    ),
    actions: mockActions,
    events: mockEvents,
  } as unknown as UserProfilePanelPropsTyped,
};

export const Loading: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userProfile: createDataSlice<UserProfileSlice>(
          'userProfile',
          'global',
          {
            user: null,
            collections: [],
            repositories: [],
            starredRepositories: [],
            loading: true,
          },
          { loading: true }
        ),
      }
    ),
    actions: mockActions,
    events: mockEvents,
  } as unknown as UserProfilePanelPropsTyped,
};

export const WithPresenceAway: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userProfile: createDataSlice<UserProfileSlice>('userProfile', 'global', {
          user: mockUser,
          collections: [],
          repositories: mockRepositories,
          starredRepositories: mockStarredRepositories,
          presence: {
            status: 'away',
            lastSeen: Date.now() - 1800000, // 30 minutes ago
          },
          loading: false,
        }),
      }
    ),
    actions: {
      ...mockActions,
      viewOrganization: async (orgLogin: string) => {
        console.log('View organization:', orgLogin);
      },
      viewRepository: async (owner: string, repo: string) => {
        console.log('View repository:', `${owner}/${repo}`);
      },
    },
    events: mockEvents,
  } as unknown as UserProfilePanelPropsTyped,
};

export const WithPresenceOffline: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userProfile: createDataSlice<UserProfileSlice>('userProfile', 'global', {
          user: mockUser,
          collections: [],
          repositories: mockRepositories,
          starredRepositories: mockStarredRepositories,
          presence: {
            status: 'offline',
            lastSeen: Date.now() - 86400000, // 1 day ago
          },
          loading: false,
        }),
      }
    ),
    actions: {
      ...mockActions,
      viewOrganization: async (orgLogin: string) => {
        console.log('View organization:', orgLogin);
      },
      viewRepository: async (owner: string, repo: string) => {
        console.log('View repository:', `${owner}/${repo}`);
      },
    },
    events: mockEvents,
  } as unknown as UserProfilePanelPropsTyped,
};

export const NoOrganizations: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userProfile: createDataSlice<UserProfileSlice>('userProfile', 'global', {
          user: {
            ...mockUser,
            login: 'newuser',
            name: 'New Developer',
            bio: 'Just getting started with open source!',
            followers: 5,
            following: 20,
            public_repos: 3,
          },
          collections: [],
          repositories: [],
          starredRepositories: mockStarredRepositories.slice(0, 2),
          loading: false,
        }),
      }
    ),
    actions: {
      ...mockActions,
      viewRepository: async (owner: string, repo: string) => {
        console.log('View repository:', `${owner}/${repo}`);
      },
      cloneRepository: async (repository: GitHubRepository) => {
        console.log('Clone repository:', repository.full_name);
      },
    },
    events: mockEvents,
  } as unknown as UserProfilePanelPropsTyped,
};

export const NoStarredRepositories: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userProfile: createDataSlice<UserProfileSlice>('userProfile', 'global', {
          user: mockUser,
          collections: [],
          repositories: mockRepositories,
          starredRepositories: [],
          loading: false,
        }),
      }
    ),
    actions: {
      ...mockActions,
      viewOrganization: async (orgLogin: string) => {
        console.log('View organization:', orgLogin);
      },
    },
    events: mockEvents,
  } as unknown as UserProfilePanelPropsTyped,
};

export const MinimalProfile: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userProfile: createDataSlice<UserProfileSlice>('userProfile', 'global', {
          user: {
            login: 'anonymous-dev',
            id: 12345,
            avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
            name: null,
            company: null,
            location: null,
            email: null,
            bio: null,
            public_repos: 2,
            public_gists: 0,
            followers: 0,
            following: 1,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: new Date().toISOString(),
          },
          collections: [],
          repositories: [],
          starredRepositories: [],
          loading: false,
        }),
      }
    ),
    actions: mockActions,
    events: mockEvents,
  } as unknown as UserProfilePanelPropsTyped,
};

export const ManyStarredRepositories: Story = {
  args: {
    context: createTypedPanelContext(
      {
        type: 'workspace',
      },
      {
        userProfile: createDataSlice<UserProfileSlice>('userProfile', 'global', {
          user: mockUser,
          collections: [],
          repositories: mockRepositories,
          starredRepositories: [
            ...mockStarredRepositories,
            ...Array.from({ length: 20 }, (_, i) => ({
              id: 100000 + i,
              name: `awesome-project-${i + 1}`,
              full_name: `developer/awesome-project-${i + 1}`,
              owner: {
                login: 'developer',
                avatar_url: `https://avatars.githubusercontent.com/u/${100000 + i}?v=4`,
              },
              private: false,
              html_url: `https://github.com/developer/awesome-project-${i + 1}`,
              description: `An awesome project number ${i + 1} with some interesting features`,
              clone_url: `https://github.com/developer/awesome-project-${i + 1}.git`,
              updated_at: new Date(Date.now() - 86400000 * i).toISOString(),
              pushed_at: new Date(Date.now() - 86400000 * i).toISOString(),
              language: ['TypeScript', 'Python', 'Rust', 'Go', 'JavaScript'][i % 5],
              stargazers_count: Math.floor(Math.random() * 10000),
              default_branch: 'main',
              fork: i % 4 === 0,
            })),
          ],
          loading: false,
        }),
      }
    ),
    actions: {
      ...mockActions,
      viewRepository: async (owner: string, repo: string) => {
        console.log('View repository:', `${owner}/${repo}`);
      },
      cloneRepository: async (repository: GitHubRepository) => {
        console.log('Clone repository:', repository.full_name);
      },
      openInBrowser: async (url: string) => {
        console.log('Open in browser:', url);
      },
    },
    events: mockEvents,
  } as unknown as UserProfilePanelPropsTyped,
};
