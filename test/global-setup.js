// Build every fixture variant once before the test files run, and hand the
// results to them (`inject('builds')`). The temporary copies are removed
// afterwards.
//
// The default variant is built first, alone: plugin-images encodes the
// photographs into its `.nera-cache` (cold: a minute and a half), which is
// then copied back to test/site/.nera-cache (git-ignored, cached in CI), so
// every other variant starts warm and the variants build in parallel.
import fs from 'fs'
import path from 'path'
import { SITE, VARIANTS, buildVariant } from './helpers/site.js'

let builds = {}

export async function setup(project) {
    const first = await buildVariant('default')
    const cache = path.join(first.site, '.nera-cache')
    if (fs.existsSync(cache)) {
        fs.rmSync(path.join(SITE, '.nera-cache'), { recursive: true, force: true })
        fs.cpSync(cache, path.join(SITE, '.nera-cache'), { recursive: true })
    }
    const rest = await Promise.all(Object.keys(VARIANTS).filter((name) => name !== 'default').map(buildVariant))
    builds = Object.fromEntries([first, ...rest].map((result) => [result.name, result]))
    project.provide('builds', builds)
}

export function teardown() {
    for (const { base } of Object.values(builds)) {
        fs.rmSync(base, { recursive: true, force: true })
    }
}
