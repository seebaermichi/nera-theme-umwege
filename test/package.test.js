// §S7 / §S15 "Package": the tarball and the package.json fields of §S2.1 / §S10 / §S11.1.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { describe, expect, it } from 'vitest'
import { PLUGINS, ROOT, SITE } from './helpers/site.js'
import { PLUGIN_CLASSES } from './helpers/contract.js'

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'))

describe('Package', () => {
    it('npm pack lists only package.json, README.md, LICENSE and files under views/, assets/, config/', () => {
        // npm ≤ 11 prints an array of reports, npm 12 an object keyed by
        // package name (the publish workflow installs npm@latest).
        const reports = JSON.parse(
            execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
                cwd: ROOT,
                encoding: 'utf-8',
                stdio: ['ignore', 'pipe', 'ignore'],
            })
        )
        const [report] = Array.isArray(reports) ? reports : Object.values(reports)
        const files = report.files.map((file) => file.path).sort()

        expect(files).toContain('package.json')
        expect(files).toContain('README.md')
        expect(files).toContain('LICENSE')
        for (const file of files) {
            expect(file).toMatch(/^(package\.json|README\.md|LICENSE|(views|assets|config)\/.+)$/)
            expect(file.startsWith('views/vendor/')).toBe(false)
            expect(file.endsWith('.js')).toBe(false)
            // §S15: under assets/ only the stylesheet, the fonts and their licences
            if (file.startsWith('assets/')) {
                expect(file).toMatch(/^assets\/(css\/theme\.css|fonts\/umwege\/[a-z0-9-]+\.woff2|fonts\/umwege\/OFL-[a-z0-9-]+\.txt)$/)
            }
        }
        for (const family of ['fraunces', 'dm-sans']) {
            expect(files).toContain(`assets/fonts/umwege/OFL-${family}.txt`)
        }
        for (const subset of ['latin', 'latin-ext']) {
            expect(files).toContain(`assets/fonts/umwege/fraunces-${subset}-opsz-normal.woff2`)
            expect(files).toContain(`assets/fonts/umwege/fraunces-${subset}-opsz-italic.woff2`)
            expect(files).toContain(`assets/fonts/umwege/dm-sans-${subset}-wght-normal.woff2`)
        }
        expect(files.filter((file) => file.endsWith('.woff2')).length).toBe(6)
    })

    it('has the fields of §S2.1 with the exact values', () => {
        expect(pkg.name).toBe('@nera-static/theme-umwege')
        expect(pkg.description).toBe('Nera blog theme for travel writers: trips with facts, a route and places — presentation only.')
        // The version is the newest CHANGELOG entry, so a release that forgets
        // one of the two fails here.
        const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf-8')
        expect(pkg.version).toBe(changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m)[1])
        expect(pkg.type).toBe('module')
        expect(pkg.license).toBe('MIT')
        expect(pkg.description).toBeTruthy()
        expect(pkg.keywords).toEqual(['nera', 'nera-theme'])
        expect(pkg.files).toEqual(['views', 'assets', 'config'])
        expect(pkg.exports).toEqual({ './package.json': './package.json' })
        expect(pkg.engines).toEqual({ node: '>=22.12.0' })
        expect(pkg.nera).toEqual({ generator: '>=4.15.0' })
        expect(pkg.publishConfig).toEqual({ access: 'public' })
        expect(pkg.repository.url).toBe('git+https://github.com/seebaermichi/nera-theme-umwege.git')
        expect(pkg.bugs.url).toBe('https://github.com/seebaermichi/nera-theme-umwege/issues')
        expect(pkg.homepage).toBe('https://github.com/seebaermichi/nera-theme-umwege#readme')
        expect(pkg.dependencies).toBeUndefined()
    })

    it('declares every plugin Umwege styles as an optional peer at the decided range', () => {
        const expected = Object.fromEntries(
            Object.entries(PLUGIN_CLASSES).map(([name, { range }]) => [name, range])
        )
        expect(pkg.peerDependencies).toEqual(expected)
        expect(Object.keys(pkg.peerDependenciesMeta).sort()).toEqual(Object.keys(expected).sort())
        for (const meta of Object.values(pkg.peerDependenciesMeta)) {
            expect(meta).toEqual({ optional: true })
        }
    })

    it('installs the peers as devDependencies at the same ranges, and the fixture names them', () => {
        const site = JSON.parse(fs.readFileSync(path.join(SITE, 'package.json'), 'utf-8'))
        expect(Object.keys(pkg.peerDependencies).sort()).toEqual([...PLUGINS].sort())
        for (const [name, range] of Object.entries(pkg.peerDependencies)) {
            expect(pkg.devDependencies[name]).toBe(range)
            expect(site.dependencies[name]).toBe(range)
        }
        expect(pkg.devDependencies['@nera-static/nera']).toBe('^1.28.0')
        // plugin-feed is a fixture plugin, not a peer: Umwege styles none of its markup
        expect(pkg.peerDependencies['@nera-static/plugin-feed']).toBeUndefined()
        expect(site.dependencies['@nera-static/plugin-feed']).toBe(pkg.devDependencies['@nera-static/plugin-feed'])
        // so is plugin-link-attributes (new tab for external links): it writes
        // attributes, no classes, so the theme styles `a[target="_blank"]`
        expect(pkg.peerDependencies['@nera-static/plugin-link-attributes']).toBeUndefined()
        expect(site.dependencies['@nera-static/plugin-link-attributes']).toBe(pkg.devDependencies['@nera-static/plugin-link-attributes'])
    })
})
