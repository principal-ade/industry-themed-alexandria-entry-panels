import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@principal-ade/industry-theme';
import { GitHubProjectsPanel } from './index';
import {
  createMockContext,
  createMockGitHubProjectsActions,
  createMockEvents,
  mockGitHubUserRepositories,
  mockGitHubOrganizations,
  mockGitHubOrgRepositories,
} from '../../mocks/panelContext';
import type { GitHubProjectsSlice } from './types';

const meta: Meta<typeof GitHubProjectsPanel> = {
  title: 'Panels/GitHubProjectsPanel',
  component: GitHubProjectsPanel,
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
type Story = StoryObj<typeof GitHubProjectsPanel>;

/**
 * Default state with user and org repositories
 */
export const Default: Story = {
  render: () => {
    const context = createMockContext();
    const actions = createMockGitHubProjectsActions();
    const events = createMockEvents();

    return (
      <GitHubProjectsPanel
        context={context}
        actions={actions}
        events={events}
      />
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
          'githubProjects',
          {
            scope: 'global',
            name: 'githubProjects',
            data: {
              userRepositories: [],
              organizations: [],
              orgRepositories: {},
              loading: true,
              currentUser: 'developer',
            } as GitHubProjectsSlice,
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
    const actions = createMockGitHubProjectsActions();
    const events = createMockEvents();

    return (
      <GitHubProjectsPanel
        context={context}
        actions={actions}
        events={events}
      />
    );
  },
};

/**
 * Empty state - no repositories
 */
export const Empty: Story = {
  render: () => {
    const context = createMockContext({
      slices: new Map([
        [
          'githubProjects',
          {
            scope: 'global',
            name: 'githubProjects',
            data: {
              userRepositories: [],
              organizations: [],
              orgRepositories: {},
              loading: false,
              currentUser: 'developer',
            } as GitHubProjectsSlice,
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
    const actions = createMockGitHubProjectsActions();
    const events = createMockEvents();

    return (
      <GitHubProjectsPanel
        context={context}
        actions={actions}
        events={events}
      />
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
          'githubProjects',
          {
            scope: 'global',
            name: 'githubProjects',
            data: {
              userRepositories: [],
              organizations: [],
              orgRepositories: {},
              loading: false,
              error:
                'Failed to fetch repositories. Please check your network connection.',
              currentUser: 'developer',
            } as GitHubProjectsSlice,
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
    const actions = createMockGitHubProjectsActions();
    const events = createMockEvents();

    return (
      <GitHubProjectsPanel
        context={context}
        actions={actions}
        events={events}
      />
    );
  },
};

/**
 * User repos only (no organization membership)
 */
export const UserReposOnly: Story = {
  render: () => {
    const context = createMockContext({
      slices: new Map([
        [
          'githubProjects',
          {
            scope: 'global',
            name: 'githubProjects',
            data: {
              userRepositories: mockGitHubUserRepositories,
              organizations: [],
              orgRepositories: {},
              loading: false,
              currentUser: 'developer',
            } as GitHubProjectsSlice,
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
    const actions = createMockGitHubProjectsActions();
    const events = createMockEvents();

    return (
      <GitHubProjectsPanel
        context={context}
        actions={actions}
        events={events}
      />
    );
  },
};

/**
 * Multiple organizations with repositories
 */
export const MultipleOrganizations: Story = {
  render: () => {
    const context = createMockContext({
      slices: new Map([
        [
          'githubProjects',
          {
            scope: 'global',
            name: 'githubProjects',
            data: {
              userRepositories: mockGitHubUserRepositories,
              organizations: mockGitHubOrganizations,
              orgRepositories: mockGitHubOrgRepositories,
              loading: false,
              currentUser: 'developer',
            } as GitHubProjectsSlice,
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
    const actions = createMockGitHubProjectsActions();
    const events = createMockEvents();

    return (
      <GitHubProjectsPanel
        context={context}
        actions={actions}
        events={events}
      />
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
          'githubProjects',
          {
            scope: 'global',
            name: 'githubProjects',
            data: {
              userRepositories: mockGitHubUserRepositories,
              organizations: mockGitHubOrganizations,
              orgRepositories: mockGitHubOrgRepositories,
              loading: false,
              currentUser: 'developer',
            } as GitHubProjectsSlice,
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
                  name: 'panel-framework-core',
                  path: '/Users/developer/projects/panel-framework-core',
                  registeredAt: '2024-01-15T10:30:00Z',
                  hasViews: false,
                  viewCount: 0,
                  views: [],
                  github: {
                    id: 'principal-ade/panel-framework-core',
                    owner: 'principal-ade',
                    name: 'panel-framework-core',
                    stars: 245,
                    primaryLanguage: 'TypeScript',
                    topics: [],
                    license: 'MIT',
                    lastCommit: '2024-12-01T15:30:00Z',
                    defaultBranch: 'main',
                    isPublic: true,
                    lastUpdated: '2024-12-01T15:30:00Z',
                  },
                },
                {
                  name: 'my-awesome-project',
                  path: '/Users/developer/projects/my-awesome-project',
                  registeredAt: '2024-02-20T14:00:00Z',
                  hasViews: false,
                  viewCount: 0,
                  views: [],
                  github: {
                    id: 'developer/my-awesome-project',
                    owner: 'developer',
                    name: 'my-awesome-project',
                    stars: 42,
                    primaryLanguage: 'TypeScript',
                    topics: [],
                    license: 'MIT',
                    lastCommit: '2024-11-25T09:00:00Z',
                    defaultBranch: 'main',
                    isPublic: true,
                    lastUpdated: '2024-11-25T09:00:00Z',
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
    const actions = createMockGitHubProjectsActions();
    const events = createMockEvents();

    return (
      <GitHubProjectsPanel
        context={context}
        actions={actions}
        events={events}
      />
    );
  },
};
