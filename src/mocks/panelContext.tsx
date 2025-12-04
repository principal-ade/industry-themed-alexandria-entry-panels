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
import type { PackagesSliceData, PackageLayer } from '../panels/DependenciesPanel/types';

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
 * Mock Package Layer for Storybook
 */
const createMockPackageLayer = (
  name: string,
  path: string,
  deps: Record<string, string>,
  devDeps: Record<string, string>,
  peerDeps: Record<string, string> = {}
): PackageLayer => ({
  id: `package-${name}`,
  name: `Package: ${name}`,
  type: 'package',
  enabled: true,
  derivedFrom: {
    fileSets: [],
    derivationType: 'presence',
    description: `Package ${name}`,
  },
  packageData: {
    name,
    version: '1.0.0',
    path,
    manifestPath: `${path}/package.json`,
    packageManager: 'npm',
    dependencies: deps,
    devDependencies: devDeps,
    peerDependencies: peerDeps,
    isMonorepoRoot: false,
    isWorkspace: false,
  },
});

/**
 * Mock Packages data for Storybook
 */
const mockPackagesData: PackagesSliceData = {
  packages: [
    createMockPackageLayer(
      'my-project',
      '',
      {
        'react': '^19.0.0',
        'react-dom': '^19.0.0',
        'lodash': '^4.17.21',
        'axios': '^1.6.0',
        'zustand': '^4.4.0',
      },
      {
        'typescript': '^5.3.0',
        'vite': '^5.0.0',
        'vitest': '^1.0.0',
        'eslint': '^8.55.0',
        '@types/react': '^18.2.0',
      },
      {
        'react': '>=18.0.0',
      }
    ),
  ],
  summary: {
    isMonorepo: false,
    rootPackageName: 'my-project',
    totalPackages: 1,
    workspacePackages: [{ name: 'my-project', path: '' }],
    totalDependencies: 5,
    totalDevDependencies: 5,
    availableScripts: ['build', 'dev', 'test'],
  },
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
      'packages',
      createMockSlice<PackagesSliceData>('packages', mockPackagesData),
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
      createMockSlice<AlexandriaRepositoriesSlice>('alexandriaRepositories', {
        repositories: mockAlexandriaRepositories,
        loading: false,
      }, 'global'),
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
      return slice?.scope === 'workspace'
        ? (slice as DataSlice<T>)
        : undefined;
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

  return { ...defaultContext, ...overrides };
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
