import React from 'react';
import type { AlexandriaEntry } from '@principal-ai/alexandria-core-library/types';
import type {
  PanelComponentProps,
  PanelContextValue,
  PanelActions,
  PanelEventEmitter,
  PanelEvent,
  PanelEventType,
  DataSlice,
} from '../types';
import type { AlexandriaRepositoriesSlice } from '../panels/LocalProjectsPanel/types';
import type {
  Workspace,
  WorkspacesSlice,
} from '../panels/WorkspaceRepositoriesPanel/types';
import type {
  GitHubRepository,
  GitHubOrganization,
} from '../panels/shared/github-types';
import type { GitHubStarredSlice } from '../panels/GitHubStarredPanel/types';
import type { GitHubProjectsSlice } from '../panels/GitHubProjectsPanel/types';

/**
 * Mock Workspaces for Storybook
 */
export const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'Principal ADE',
    description: 'Development environment for Principal ADE projects',
    icon: '🏛️',
    theme: 'indigo',
    suggestedClonePath: '/Users/developer/workspaces/principal-ade',
    createdAt: Date.now() - 86400000 * 30, // 30 days ago
    updatedAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: 'workspace-2',
    name: 'Personal Projects',
    description: 'Side projects and experiments',
    icon: '🚀',
    theme: 'purple',
    suggestedClonePath: '/Users/developer/workspaces/personal',
    createdAt: Date.now() - 86400000 * 60, // 60 days ago
    updatedAt: Date.now() - 86400000 * 7, // 7 days ago
  },
  {
    id: 'workspace-3',
    name: 'Learning',
    description: 'Tutorials and learning projects',
    icon: '📚',
    theme: 'green',
    suggestedClonePath: '/Users/developer/workspaces/learning',
    createdAt: Date.now() - 86400000 * 90, // 90 days ago
    updatedAt: Date.now() - 86400000 * 14, // 14 days ago
  },
  {
    id: 'workspace-4',
    name: 'Open Source',
    icon: '🌐',
    createdAt: Date.now() - 86400000 * 45, // 45 days ago
    updatedAt: Date.now() - 86400000 * 3, // 3 days ago
  },
];

/**
 * Mock GitHub Starred Repositories for Storybook
 */
export const mockGitHubStarredRepositories: GitHubRepository[] = [
  {
    id: 1001,
    name: 'react',
    full_name: 'facebook/react',
    owner: { login: 'facebook', avatar_url: 'https://github.com/facebook.png' },
    private: false,
    html_url: 'https://github.com/facebook/react',
    description: 'The library for web and native user interfaces.',
    clone_url: 'https://github.com/facebook/react.git',
    updated_at: '2024-12-01T10:00:00Z',
    pushed_at: '2024-12-01T10:00:00Z',
    language: 'JavaScript',
    stargazers_count: 220000,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 1002,
    name: 'typescript',
    full_name: 'microsoft/typescript',
    owner: {
      login: 'microsoft',
      avatar_url: 'https://github.com/microsoft.png',
    },
    private: false,
    html_url: 'https://github.com/microsoft/typescript',
    description:
      'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.',
    clone_url: 'https://github.com/microsoft/typescript.git',
    updated_at: '2024-11-28T15:30:00Z',
    pushed_at: '2024-11-28T15:30:00Z',
    language: 'TypeScript',
    stargazers_count: 98000,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 1003,
    name: 'vscode',
    full_name: 'microsoft/vscode',
    owner: {
      login: 'microsoft',
      avatar_url: 'https://github.com/microsoft.png',
    },
    private: false,
    html_url: 'https://github.com/microsoft/vscode',
    description: 'Visual Studio Code',
    clone_url: 'https://github.com/microsoft/vscode.git',
    updated_at: '2024-12-02T08:00:00Z',
    pushed_at: '2024-12-02T08:00:00Z',
    language: 'TypeScript',
    stargazers_count: 158000,
    default_branch: 'main',
    fork: false,
  },
  {
    id: 1004,
    name: 'tauri',
    full_name: 'tauri-apps/tauri',
    owner: {
      login: 'tauri-apps',
      avatar_url: 'https://github.com/tauri-apps.png',
    },
    private: false,
    html_url: 'https://github.com/tauri-apps/tauri',
    description:
      'Build smaller, faster, and more secure desktop and mobile applications with a web frontend.',
    clone_url: 'https://github.com/tauri-apps/tauri.git',
    updated_at: '2024-11-30T12:00:00Z',
    pushed_at: '2024-11-30T12:00:00Z',
    language: 'Rust',
    stargazers_count: 78000,
    default_branch: 'dev',
    fork: false,
  },
  {
    id: 1005,
    name: 'electron',
    full_name: 'electron/electron',
    owner: { login: 'electron', avatar_url: 'https://github.com/electron.png' },
    private: false,
    html_url: 'https://github.com/electron/electron',
    description:
      'Build cross-platform desktop apps with JavaScript, HTML, and CSS',
    clone_url: 'https://github.com/electron/electron.git',
    updated_at: '2024-12-01T14:00:00Z',
    pushed_at: '2024-12-01T14:00:00Z',
    language: 'C++',
    stargazers_count: 112000,
    default_branch: 'main',
    fork: false,
  },
];

/**
 * Mock GitHub User Repositories for Storybook
 */
export const mockGitHubUserRepositories: GitHubRepository[] = [
  {
    id: 2001,
    name: 'my-awesome-project',
    full_name: 'developer/my-awesome-project',
    owner: {
      login: 'developer',
      avatar_url: 'https://github.com/developer.png',
    },
    private: false,
    html_url: 'https://github.com/developer/my-awesome-project',
    description: 'A showcase of my best work',
    clone_url: 'https://github.com/developer/my-awesome-project.git',
    updated_at: '2024-11-25T09:00:00Z',
    pushed_at: '2024-11-25T09:00:00Z',
    language: 'TypeScript',
    stargazers_count: 42,
    default_branch: 'main',
    fork: false,
    license: 'MIT',
  },
  {
    id: 2002,
    name: 'dotfiles',
    full_name: 'developer/dotfiles',
    owner: {
      login: 'developer',
      avatar_url: 'https://github.com/developer.png',
    },
    private: false,
    html_url: 'https://github.com/developer/dotfiles',
    description: 'My personal configuration files',
    clone_url: 'https://github.com/developer/dotfiles.git',
    updated_at: '2024-10-15T16:30:00Z',
    pushed_at: '2024-10-15T16:30:00Z',
    language: 'Shell',
    stargazers_count: 5,
    default_branch: 'main',
    fork: false,
    license: 'Unlicense',
  },
  {
    id: 2003,
    name: 'private-notes',
    full_name: 'developer/private-notes',
    owner: {
      login: 'developer',
      avatar_url: 'https://github.com/developer.png',
    },
    private: true,
    html_url: 'https://github.com/developer/private-notes',
    description: 'Personal notes and documentation',
    clone_url: 'https://github.com/developer/private-notes.git',
    updated_at: '2024-12-01T20:00:00Z',
    pushed_at: '2024-12-01T20:00:00Z',
    language: 'Markdown',
    stargazers_count: 0,
    default_branch: 'main',
    fork: false,
    license: null,
  },
];

/**
 * Mock GitHub Organizations for Storybook
 */
export const mockGitHubOrganizations: GitHubOrganization[] = [
  {
    id: 3001,
    login: 'principal-ade',
    avatar_url: 'https://github.com/principal-ade.png',
    description: 'Principal ADE Development',
  },
  {
    id: 3002,
    login: 'acme-corp',
    avatar_url: 'https://github.com/acme-corp.png',
    description: 'Acme Corporation',
  },
];

/**
 * Mock GitHub Organization Repositories for Storybook
 */
export const mockGitHubOrgRepositories: Record<string, GitHubRepository[]> = {
  'principal-ade': [
    {
      id: 4001,
      name: 'panel-framework-core',
      full_name: 'principal-ade/panel-framework-core',
      owner: {
        login: 'principal-ade',
        avatar_url: 'https://github.com/principal-ade.png',
      },
      private: false,
      html_url: 'https://github.com/principal-ade/panel-framework-core',
      description: 'Core framework for building extensible panels',
      clone_url: 'https://github.com/principal-ade/panel-framework-core.git',
      updated_at: '2024-12-01T15:30:00Z',
      pushed_at: '2024-12-01T15:30:00Z',
      language: 'TypeScript',
      stargazers_count: 245,
      default_branch: 'main',
      fork: false,
      license: 'MIT',
    },
    {
      id: 4002,
      name: 'industry-theme',
      full_name: 'principal-ade/industry-theme',
      owner: {
        login: 'principal-ade',
        avatar_url: 'https://github.com/principal-ade.png',
      },
      private: false,
      html_url: 'https://github.com/principal-ade/industry-theme',
      description: 'Industry-standard theming system for React applications',
      clone_url: 'https://github.com/principal-ade/industry-theme.git',
      updated_at: '2024-11-28T09:15:00Z',
      pushed_at: '2024-11-28T09:15:00Z',
      language: 'TypeScript',
      stargazers_count: 128,
      default_branch: 'main',
      fork: false,
      license: 'Apache-2.0',
    },
  ],
  'acme-corp': [
    {
      id: 5001,
      name: 'internal-tools',
      full_name: 'acme-corp/internal-tools',
      owner: {
        login: 'acme-corp',
        avatar_url: 'https://github.com/acme-corp.png',
      },
      private: true,
      html_url: 'https://github.com/acme-corp/internal-tools',
      description: 'Internal tooling and utilities',
      clone_url: 'https://github.com/acme-corp/internal-tools.git',
      updated_at: '2024-11-20T11:00:00Z',
      pushed_at: '2024-11-20T11:00:00Z',
      language: 'Python',
      stargazers_count: 0,
      default_branch: 'main',
      fork: false,
      license: null,
    },
    {
      id: 5002,
      name: 'product-api',
      full_name: 'acme-corp/product-api',
      owner: {
        login: 'acme-corp',
        avatar_url: 'https://github.com/acme-corp.png',
      },
      private: true,
      html_url: 'https://github.com/acme-corp/product-api',
      description: 'Main product API service',
      clone_url: 'https://github.com/acme-corp/product-api.git',
      updated_at: '2024-12-02T18:00:00Z',
      pushed_at: '2024-12-02T18:00:00Z',
      language: 'Go',
      stargazers_count: 0,
      default_branch: 'main',
      fork: false,
      license: 'BSD-3-Clause',
    },
  ],
};

/**
 * Mock Alexandria Repositories for Storybook
 */
export const mockAlexandriaRepositories: AlexandriaEntry[] = [
  {
    name: 'panel-framework-core',
    path: '/Users/developer/projects/panel-framework-core' as AlexandriaEntry['path'],
    remoteUrl: 'https://github.com/principal-ade/panel-framework-core',
    registeredAt: '2024-01-15T10:30:00Z',
    hasViews: true,
    viewCount: 3,
    views: [],
    github: {
      id: 'principal-ade/panel-framework-core',
      owner: 'principal-ade',
      name: 'panel-framework-core',
      stars: 245,
      primaryLanguage: 'TypeScript',
      topics: ['react', 'panels', 'framework'],
      license: 'MIT',
      lastCommit: '2024-12-01T15:30:00Z',
      defaultBranch: 'main',
      isPublic: true,
      lastUpdated: '2024-12-01T15:30:00Z',
    },
  },
  {
    name: 'industry-theme',
    path: '/Users/developer/projects/industry-theme' as AlexandriaEntry['path'],
    remoteUrl: 'https://github.com/principal-ade/industry-theme',
    registeredAt: '2024-02-20T14:00:00Z',
    hasViews: true,
    viewCount: 2,
    views: [],
    github: {
      id: 'principal-ade/industry-theme',
      owner: 'principal-ade',
      name: 'industry-theme',
      stars: 128,
      primaryLanguage: 'TypeScript',
      topics: ['design-system', 'theme', 'react'],
      license: 'MIT',
      lastCommit: '2024-11-28T09:15:00Z',
      defaultBranch: 'main',
      isPublic: true,
      lastUpdated: '2024-11-28T09:15:00Z',
    },
  },
  {
    name: 'alexandria-core-library',
    path: '/Users/developer/projects/alexandria-core-library' as AlexandriaEntry['path'],
    remoteUrl: 'https://github.com/principal-ai/alexandria-core-library',
    registeredAt: '2024-03-10T08:45:00Z',
    hasViews: true,
    viewCount: 5,
    views: [],
    github: {
      id: 'principal-ai/alexandria-core-library',
      owner: 'principal-ai',
      name: 'alexandria-core-library',
      stars: 89,
      primaryLanguage: 'TypeScript',
      topics: ['alexandria', 'core', 'library'],
      license: 'MIT',
      lastCommit: '2024-12-02T18:00:00Z',
      defaultBranch: 'main',
      isPublic: true,
      lastUpdated: '2024-12-02T18:00:00Z',
    },
  },
  {
    name: 'my-rust-project',
    path: '/Users/developer/projects/my-rust-project' as AlexandriaEntry['path'],
    registeredAt: '2024-06-01T12:00:00Z',
    hasViews: false,
    viewCount: 0,
    views: [],
    github: {
      id: 'developer/my-rust-project',
      owner: 'developer',
      name: 'my-rust-project',
      stars: 5,
      primaryLanguage: 'Rust',
      topics: ['rust', 'learning'],
      license: 'Apache-2.0',
      lastCommit: '2024-10-15T20:30:00Z',
      defaultBranch: 'main',
      isPublic: false,
      lastUpdated: '2024-10-15T20:30:00Z',
    },
  },
  {
    name: 'local-scripts',
    path: '/Users/developer/scripts/local-scripts' as AlexandriaEntry['path'],
    registeredAt: '2024-08-20T16:30:00Z',
    hasViews: false,
    viewCount: 0,
    views: [],
    // No GitHub info - local only project
  },
];

/**
 * Mock Git Status data for Storybook
 */
const mockGitStatusData = {
  staged: ['src/components/Button.tsx', 'src/styles/theme.css'],
  unstaged: ['README.md', 'package.json'],
  untracked: ['src/new-feature.tsx'],
  deleted: [],
};

/**
 * Create a mock DataSlice
 */
const createMockSlice = <T,>(
  name: string,
  data: T,
  scope: 'workspace' | 'repository' | 'global' = 'repository'
): DataSlice<T> => ({
  scope,
  name,
  data,
  loading: false,
  error: null,
  refresh: async () => {
    // eslint-disable-next-line no-console
    console.log(`[Mock] Refreshing slice: ${name}`);
  },
});

/**
 * Mock Panel Context for Storybook
 */
export const createMockContext = (
  overrides?: Partial<PanelContextValue>
): PanelContextValue => {
  // Create mock data slices
  const mockSlices = new Map<string, DataSlice>([
    ['git', createMockSlice('git', mockGitStatusData)],
    [
      'markdown',
      createMockSlice('markdown', [
        {
          path: 'README.md',
          title: 'Project README',
          lastModified: Date.now() - 3600000,
        },
        {
          path: 'docs/API.md',
          title: 'API Documentation',
          lastModified: Date.now() - 86400000,
        },
      ]),
    ],
    [
      'fileTree',
      createMockSlice('fileTree', {
        name: 'my-project',
        path: '/Users/developer/my-project',
        type: 'directory',
        children: [
          {
            name: 'src',
            path: '/Users/developer/my-project/src',
            type: 'directory',
          },
          {
            name: 'package.json',
            path: '/Users/developer/my-project/package.json',
            type: 'file',
          },
        ],
      }),
    ],
    [
      'quality',
      createMockSlice('quality', {
        coverage: 85,
        issues: 3,
        complexity: 12,
      }),
    ],
    [
      'alexandriaRepositories',
      createMockSlice<AlexandriaRepositoriesSlice>(
        'alexandriaRepositories',
        {
          repositories: mockAlexandriaRepositories,
          loading: false,
        },
        'global'
      ),
    ],
    [
      'workspaces',
      createMockSlice<WorkspacesSlice>(
        'workspaces',
        {
          workspaces: mockWorkspaces,
          defaultWorkspaceId: 'workspace-1',
          loading: false,
        },
        'global'
      ),
    ],
    [
      'githubStarred',
      createMockSlice<GitHubStarredSlice>(
        'githubStarred',
        {
          repositories: mockGitHubStarredRepositories,
          loading: false,
        },
        'global'
      ),
    ],
    [
      'githubProjects',
      createMockSlice<GitHubProjectsSlice>(
        'githubProjects',
        {
          userRepositories: mockGitHubUserRepositories,
          organizations: mockGitHubOrganizations,
          orgRepositories: mockGitHubOrgRepositories,
          loading: false,
          currentUser: 'developer',
        },
        'global'
      ),
    ],
  ]);

  const defaultContext: PanelContextValue = {
    currentScope: {
      type: 'repository',
      workspace: {
        name: 'my-workspace',
        path: '/Users/developer/my-workspace',
      },
      repository: {
        name: 'my-project',
        path: '/Users/developer/my-project',
      },
    },
    slices: mockSlices,
    getSlice: <T,>(name: string): DataSlice<T> | undefined => {
      return mockSlices.get(name) as DataSlice<T> | undefined;
    },
    getWorkspaceSlice: <T,>(name: string): DataSlice<T> | undefined => {
      const slice = mockSlices.get(name);
      return slice?.scope === 'workspace' ? (slice as DataSlice<T>) : undefined;
    },
    getRepositorySlice: <T,>(name: string): DataSlice<T> | undefined => {
      const slice = mockSlices.get(name);
      return slice?.scope === 'repository'
        ? (slice as DataSlice<T>)
        : undefined;
    },
    hasSlice: (name: string, scope?: 'workspace' | 'repository'): boolean => {
      const slice = mockSlices.get(name);
      if (!slice) return false;
      if (!scope) return true;
      return slice.scope === scope;
    },
    isSliceLoading: (
      name: string,
      scope?: 'workspace' | 'repository'
    ): boolean => {
      const slice = mockSlices.get(name);
      if (!slice) return false;
      if (scope && slice.scope !== scope) return false;
      return slice.loading;
    },
    refresh: async (
      scope?: 'workspace' | 'repository',
      slice?: string
    ): Promise<void> => {
      // eslint-disable-next-line no-console
      console.log('[Mock] Context refresh called', { scope, slice });
    },
  };

  // Convert slices Map to direct properties for typed access
  const slicesAsProperties: Record<string, DataSlice> = {};
  const finalSlices = overrides?.slices || mockSlices;
  finalSlices.forEach((slice, key) => {
    slicesAsProperties[key] = slice;
  });

  return { ...defaultContext, ...slicesAsProperties, ...overrides };
};

/**
 * Mock Panel Actions for Storybook
 */
export const createMockActions = (
  overrides?: Partial<PanelActions>
): PanelActions => ({
  openFile: (filePath: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Opening file:', filePath);
  },
  openGitDiff: (filePath: string, status) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Opening git diff:', filePath, status);
  },
  navigateToPanel: (panelId: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Navigating to panel:', panelId);
  },
  notifyPanels: (event) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Notifying panels:', event);
  },
  ...overrides,
});

/**
 * Mock LocalProjectsPanel Actions for Storybook
 */
export const createMockLocalProjectsActions = () => ({
  ...createMockActions(),
  selectDirectory: async () => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Opening directory picker');
    // Simulate returning a selected directory
    return { path: '/Users/developer/new-project', name: 'new-project' };
  },
  registerRepository: async (name: string, path: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Registering repository:', { name, path });
  },
  removeRepository: async (name: string, deleteLocal: boolean) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Removing repository:', { name, deleteLocal });
  },
  openRepository: async (entry: AlexandriaEntry) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Opening repository:', entry.name);
    // Simulate opening delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  focusRepository: async (entry: AlexandriaEntry) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Focusing repository window:', entry.name);
  },
  getRepositoryWindowState: async () => {
    return 'closed' as const;
  },
});

/**
 * Mock WorkspacesListPanel Actions for Storybook
 */
export const createMockWorkspacesListActions = () => ({
  ...createMockActions(),
  createWorkspace: async (name: string, options?: { description?: string }) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Creating workspace:', { name, ...options });
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      description: options?.description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return newWorkspace;
  },
  updateWorkspace: async (workspaceId: string, updates: Partial<Workspace>) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Updating workspace:', { workspaceId, updates });
  },
  deleteWorkspace: async (workspaceId: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Deleting workspace:', workspaceId);
  },
  setDefaultWorkspace: async (workspaceId: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Setting default workspace:', workspaceId);
  },
  openWorkspace: async (workspaceId: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Opening workspace:', workspaceId);
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
  getWorkspaceRepositories: async (workspaceId: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Getting workspace repositories:', workspaceId);
    // Return mock repository names based on workspace
    if (workspaceId === 'workspace-1') {
      return [
        { name: 'panel-framework-core' },
        { name: 'industry-theme' },
        { name: 'alexandria-core-library' },
      ];
    }
    if (workspaceId === 'workspace-2') {
      return [{ name: 'my-rust-project' }];
    }
    return [];
  },
});

/**
 * Mock GitHubStarredPanel Actions for Storybook
 */
export const createMockGitHubStarredActions = () => ({
  ...createMockActions(),
  cloneRepository: async (repo: GitHubRepository) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Cloning repository:', repo.full_name);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  },
  openRepository: async (localPath: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Opening repository:', localPath);
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
  refreshStarred: async () => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Refreshing starred repositories');
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
});

/**
 * Mock GitHubProjectsPanel Actions for Storybook
 */
export const createMockGitHubProjectsActions = () => ({
  ...createMockActions(),
  cloneRepository: async (repo: GitHubRepository) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Cloning repository:', repo.full_name);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  },
  openRepository: async (localPath: string) => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Opening repository:', localPath);
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
  refreshProjects: async () => {
    // eslint-disable-next-line no-console
    console.log('[Mock] Refreshing projects');
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
});

/**
 * Mock Event Emitter for Storybook
 */
export const createMockEvents = (): PanelEventEmitter => {
  const handlers = new Map<
    PanelEventType,
    Set<(event: PanelEvent<unknown>) => void>
  >();

  return {
    emit: (event) => {
      // eslint-disable-next-line no-console
      console.log('[Mock] Emitting event:', event);
      const eventHandlers = handlers.get(event.type);
      if (eventHandlers) {
        eventHandlers.forEach((handler) => handler(event));
      }
    },
    on: (type, handler) => {
      // eslint-disable-next-line no-console
      console.log('[Mock] Subscribing to event:', type);
      if (!handlers.has(type)) {
        handlers.set(type, new Set());
      }
      handlers.get(type)!.add(handler as (event: PanelEvent<unknown>) => void);

      // Return cleanup function
      return () => {
        // eslint-disable-next-line no-console
        console.log('[Mock] Unsubscribing from event:', type);
        handlers
          .get(type)
          ?.delete(handler as (event: PanelEvent<unknown>) => void);
      };
    },
    off: (type, handler) => {
      // eslint-disable-next-line no-console
      console.log('[Mock] Removing event handler:', type);
      handlers
        .get(type)
        ?.delete(handler as (event: PanelEvent<unknown>) => void);
    },
  };
};

/**
 * Mock Panel Props Provider
 * Wraps components with mock context for Storybook
 */
export const MockPanelProvider: React.FC<{
  children: (props: PanelComponentProps) => React.ReactNode;
  contextOverrides?: Partial<PanelContextValue>;
  actionsOverrides?: Partial<PanelActions>;
}> = ({ children, contextOverrides, actionsOverrides }) => {
  const context = createMockContext(contextOverrides);
  const actions = createMockActions(actionsOverrides);
  const events = createMockEvents();

  return <>{children({ context, actions, events })}</>;
};
