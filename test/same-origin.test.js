// §S7 / §S15 "Same origin only": every src, srcset and stylesheet href of the
// built pages is root-absolute or a fragment; every url() in the built CSS is
// root-absolute, a fragment, or — the theme's fonts — relative, resolving to a
// file the build wrote inside /fonts/; no http(s):// outside comments, no
// @import; a foreign extra_css entry is not linked.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { ROOT } from './helpers/site.js'
import { attr, listFiles, pages, tags } from './helpers/html.js'

const builds = inject('builds')
const sameOrigin = (url) => /^\/(?![/\\])/.test(url) || url.startsWith('#')

const resourceUrls = (html) => {
    const urls = []
    for (const name of ['img', 'source', 'script', 'iframe', 'video', 'audio']) {
        for (const attrs of tags(html, name)) {
            const src = attr(attrs, 'src')
            if (src !== undefined) urls.push(src)
            const srcset = attr(attrs, 'srcset')
            if (srcset !== undefined) urls.push(...srcset.split(',').map((part) => part.trim().split(/\s+/)[0]))
        }
    }
    for (const attrs of tags(html, 'link')) {
        if (/stylesheet|preload|icon|manifest/.test(attr(attrs, 'rel') || '')) urls.push(attr(attrs, 'href'))
    }
    return urls
}

describe('Same origin only', () => {
    for (const name of ['default', 'overrides']) {
        it(`${name}: every src, srcset and stylesheet href is root-absolute or a fragment`, () => {
            let count = 0
            for (const { file, html } of pages(builds[name].public)) {
                for (const url of resourceUrls(html)) {
                    count++
                    expect(sameOrigin(url), `${file}: ${url}`).toBe(true)
                }
            }
            expect(count).toBeGreaterThan(30)
        })

        it(`${name}: every url() in the built CSS is root-absolute or a fragment`, () => {
            for (const file of listFiles(builds[name].public, ['.css'])) {
                const css = fs.readFileSync(path.join(builds[name].public, file), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '')
                for (const [, , url] of css.matchAll(/url\(\s*(['"]?)([^'")]*)\1\s*\)/g)) {
                    if (file === path.join('css', 'theme.css')) {
                        // §S11.2: relative, so it survives base_path; inside /fonts/
                        expect(url, url).toMatch(/^\.\.\/fonts\/umwege\/[a-z0-9-]+\.woff2$/)
                        const target = path.resolve(builds[name].public, 'css', url)
                        expect(target.startsWith(path.join(builds[name].public, 'fonts') + path.sep), url).toBe(true)
                        expect(fs.existsSync(target), url).toBe(true)
                    } else {
                        expect(sameOrigin(url) || url.startsWith('data:'), `${file}: ${url}`).toBe(true)
                    }
                }
                expect(css, file).not.toMatch(/@import/)
                expect(css, file).not.toMatch(/https?:\/\//)
            }
        })
    }

    it('the theme\'s own CSS names fonts only, with relative URLs and font-display: swap (§S11.2)', () => {
        const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'theme.css'), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '')
        expect(css).not.toMatch(/@import/)
        const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1])
        expect(faces.length).toBe(6)
        for (const face of faces) {
            expect(face).toMatch(/font-display:\s*swap/)
            expect(face).toMatch(/unicode-range:/)
            expect(face).toMatch(/src:\s*url\('\.\.\/fonts\/umwege\/[a-z0-9-]+\.woff2'\)/)
        }
        // every url() sits in an @font-face, and @font-face rules come first
        expect(css.match(/url\(/g).length).toBe(faces.length)
        expect(css.trim().startsWith('@font-face')).toBe(true)
        for (const [, , url] of css.matchAll(/url\(\s*(['"]?)([^'")]*)\1\s*\)/g)) {
            expect(fs.existsSync(path.resolve(ROOT, 'assets', 'css', url)), url).toBe(true)
        }
    })

    it('assets/ contains no http:// or https:// in the CSS, and only the theme\'s fonts', () => {
        for (const file of listFiles(path.join(ROOT, 'assets'), ['.css', '.svg', '.json', '.webmanifest', '.html'])) {
            const text = fs.readFileSync(path.join(ROOT, 'assets', file), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '')
            expect(text, file).not.toMatch(/https?:\/\//)
        }
        for (const file of listFiles(path.join(ROOT, 'assets'), ['.woff', '.woff2', '.ttf', '.otf', '.eot'])) {
            expect(file).toMatch(/^fonts\/umwege\/[a-z0-9-]+\.woff2$/)
        }
    })

    it('links root-absolute extra_css entries and drops every other one', () => {
        for (const { file, html } of pages(builds.overrides.public)) {
            const stylesheets = tags(html, 'link').filter((a) => attr(a, 'rel') === 'stylesheet').map((a) => attr(a, 'href'))
            expect(stylesheets, file).toEqual(['/css/theme.css', '/css/site.css'])
            expect(html, file).not.toMatch(/example\.org\/[xyztrn]\.css/)
            expect(html, file).not.toContain('relative.css')
        }
    })
})
