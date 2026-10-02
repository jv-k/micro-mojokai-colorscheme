import { defaultCheck } from '../src/plugins/defaults';
import { filterOutdated, mutateRefs, runUnlessDryRun, safeParseJson } from '../src/plugins/helpers';
import type {
  ListOptions,
  MutateOptions,
  PackageRef,
  PackageStatus,
  Plugin,
  PluginContext,
  SearchResult,
} from '../src/plugins/types';

interface NpmListResponse {
  dependencies?: Record<string, { version?: string }>;
}

interface NpmOutdatedEntry {
  current?: string;
  wanted?: string;
  latest?: string;
}

type NpmOutdatedResponse = Record<string, NpmOutdatedEntry>;

async function fetchStatus(ctx: PluginContext, onlyOutdated: boolean): Promise<PackageStatus[]> {
  // npm list may exit non-zero on peer-dep warnings; use run + parse manually.
  const listResult = await ctx.exec.run('npm', ['list', '-g', '--json'], { signal: ctx.signal });
  const listParsed = safeParseJson<NpmListResponse>(listResult.stdout);
  const installed = listParsed?.dependencies ?? {};

  // npm outdated exits 1 when there ARE outdated packages. Don't treat as error.
  const outdatedResult = await ctx.exec.run('npm', ['outdated', '-g', '--json'], {
    signal: ctx.signal,
  });
  const outdatedParsed = safeParseJson<NpmOutdatedResponse>(outdatedResult.stdout) ?? {};

  const result: PackageStatus[] = Object.entries(installed).map(([name, meta]) => {
    const outdated = outdatedParsed[name];
    const status: PackageStatus = {
      ref: { kind: 'npm', name },
      installed: true,
      installedVersion: meta.version,
      updateStatus: outdated !== undefined ? 'outdated' : 'current',
    };
    if (outdated?.latest !== undefined) {
      status.latestVersion = outdated.latest;
    }
    return status;
  });

  return filterOutdated(result, onlyOutdated);
}

const npm: Plugin = {
  manifest: {
    id: 'npm',
    displayName: 'npm (global)',
    category: 'Node.js',
    supportedOS: ['darwin'],
    requires: ['npm'],
    configKeys: ['npm'],
    capabilities: {
      list: true,
      install: true,
      update: true,
      track: true,
      untrack: true,
      outdated: true,
    },
  },

  check: defaultCheck('npm', ['npm']),

  async list(ctx: PluginContext, opts: ListOptions): Promise<PackageStatus[]> {
    return fetchStatus(ctx, opts.onlyOutdated ?? false);
  },

  async install(
    ctx: PluginContext,
    refs: readonly PackageRef[],
    opts: MutateOptions,
  ): Promise<void> {
    await mutateRefs(ctx, refs, opts, (ref) => ['npm', ['install', '-g', ref.name]]);
  },

  async update(
    ctx: PluginContext,
    refs: readonly PackageRef[],
    opts: MutateOptions,
  ): Promise<void> {
    await mutateRefs(ctx, refs, opts, (ref) => ['npm', ['update', '-g', ref.name]]);
  },

  async search(ctx: PluginContext, query: string): Promise<SearchResult[]> {
    const { stdout } = await ctx.exec.run('npm', ['search', '--json', query], {
      signal: ctx.signal,
      kind: 'query',
    });
    const parsed = safeParseJson<Array<{ name?: string; description?: string }>>(stdout);
    if (!Array.isArray(parsed)) return [];
    const results: SearchResult[] = [];
    for (const hit of parsed) {
      if (!hit || typeof hit.name !== 'string') continue;
      results.push(
        hit.description ? { name: hit.name, description: hit.description } : { name: hit.name },
      );
    }
    return results;
  },

  async healthCheck(ctx: PluginContext, opts: MutateOptions): Promise<void> {
    await runUnlessDryRun(ctx, opts, 'npm', ['doctor']);
  },
};

export default npm;
