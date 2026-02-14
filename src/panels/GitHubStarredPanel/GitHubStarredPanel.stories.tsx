import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@principal-ade/industry-theme';
import { GitHubStarredPanel } from './index';
import {
  createMockContext,
  createMockGitHubStarredActions,
  createMockEvents,
  mockGitHubStarredRepositories,
} from '../../mocks/panelContext';
import type { GitHubStarredSlice } from './types';

const meta: Meta<typeof GitHubStarredPanel> = {
  title: 'Panels/GitHubStarredPanel',
  component: GitHubStarredPanel,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ height: '600px', width: '400px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof GitHubStarredPanel>;

/**
 * Default state with starred repositories
 */
export const Default: Story = {
  render: () => {
    const context = createMockContext();
    const actions = createMockGitHubStarredActions();
    const events = createMockEvents();

    return (
      <GitHubStarredPanel context={context} actions={actions} events={events} />
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
          'githubStarred',
          {
            scope: 'global',
            name: 'githubStarred',
            data: { repositories: [], loading: true } as GitHubStarredSlice,
            loading: true,
            error: null,
            refresh: async () => {},
          },
        ],
        [
          'alexandriaRepositories',
          {
            scope: 'global',
            name: 'alexandriaRepositories',
            data: { repositories: [], loading: false },
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockGitHubStarredActions();
    const events = createMockEvents();

    return (
      <GitHubStarredPanel context={context} actions={actions} events={events} />
    );
  },
};

/**
 * Empty state - no starred repositories
 */
export const Empty: Story = {
  render: () => {
    const context = createMockContext({
      slices: new Map([
        [
          'githubStarred',
          {
            scope: 'global',
            name: 'githubStarred',
            data: { repositories: [], loading: false } as GitHubStarredSlice,
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
        [
          'alexandriaRepositories',
          {
            scope: 'global',
            name: 'alexandriaRepositories',
            data: { repositories: [], loading: false },
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockGitHubStarredActions();
    const events = createMockEvents();

    return (
      <GitHubStarredPanel context={context} actions={actions} events={events} />
    );
  },
};

/**
 * Error state
 */
export const Error: Story = {
  render: () => {
    const context = createMockContext({
      slices: new Map([
        [
          'githubStarred',
          {
            scope: 'global',
            name: 'githubStarred',
            data: {
              repositories: [],
              loading: false,
              error:
                'Failed to fetch starred repositories. Please check your network connection.',
            } as GitHubStarredSlice,
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
        [
          'alexandriaRepositories',
          {
            scope: 'global',
            name: 'alexandriaRepositories',
            data: { repositories: [], loading: false },
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockGitHubStarredActions();
    const events = createMockEvents();

    return (
      <GitHubStarredPanel context={context} actions={actions} events={events} />
    );
  },
};

/**
 * With some repositories already cloned locally
 */
export const WithClonedRepos: Story = {
  render: () => {
    const context = createMockContext({
      slices: new Map([
        [
          'githubStarred',
          {
            scope: 'global',
            name: 'githubStarred',
            data: {
              repositories: mockGitHubStarredRepositories,
              loading: false,
            } as GitHubStarredSlice,
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
        [
          'alexandriaRepositories',
          {
            scope: 'global',
            name: 'alexandriaRepositories',
            data: {
              repositories: [
                {
                  name: 'react',
                  path: '/Users/developer/projects/react',
                  registeredAt: '2024-01-15T10:30:00Z',
                  hasViews: false,
                  viewCount: 0,
                  views: [],
                  github: {
                    id: 'facebook/react',
                    owner: 'facebook',
                    name: 'react',
                    stars: 220000,
                    primaryLanguage: 'JavaScript',
                    topics: [],
                    license: 'MIT',
                    lastCommit: '2024-12-01T10:00:00Z',
                    defaultBranch: 'main',
                    isPublic: true,
                    lastUpdated: '2024-12-01T10:00:00Z',
                  },
                },
                {
                  name: 'typescript',
                  path: '/Users/developer/projects/typescript',
                  registeredAt: '2024-02-20T14:00:00Z',
                  hasViews: false,
                  viewCount: 0,
                  views: [],
                  github: {
                    id: 'microsoft/typescript',
                    owner: 'microsoft',
                    name: 'typescript',
                    stars: 98000,
                    primaryLanguage: 'TypeScript',
                    topics: [],
                    license: 'Apache-2.0',
                    lastCommit: '2024-11-28T15:30:00Z',
                    defaultBranch: 'main',
                    isPublic: true,
                    lastUpdated: '2024-11-28T15:30:00Z',
                  },
                },
              ],
              loading: false,
            },
            loading: false,
            error: null,
            refresh: async () => {},
          },
        ],
      ]),
    });
    const actions = createMockGitHubStarredActions();
    const events = createMockEvents();

    return (
      <GitHubStarredPanel context={context} actions={actions} events={events} />
    );
  },
};
