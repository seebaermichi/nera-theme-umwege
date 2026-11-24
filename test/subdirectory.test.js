// §S7 "Subdirectory deploy": with `base_path: /sub` every theme link and
// stylesheet in the output starts with /sub/.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { attr, pages, tags } from './helpers/html.js'

const builds = inject('builds')

describe('Subdirectory deploy', () => {
    it('prefixes every root-absolute href, src and srcset with /sub/', () => {
        let count = 0
        for (const { file, html } of pages(builds.sub.public)) {
            for (const [, , url] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
                if (/^(https?:|mailto:|#)/.test(url)) continue
                count++
                expect(url, `${file}: ${url}`).toMatch(/^\/sub\//)
            }
            for (const [, set] of html.matchAll(/\ssrcset="([^"]*)"/g)) {
                for (const part of set.split(',')) expect(part.trim(), file).toMatch(/^\/sub\//)
            }
        }
        expect(count).toBeGreaterThan(500)
    })

    it('links the theme\'s stylesheet and the theme\'s own links under /sub/', () => {
        for (const { file, html } of pages(builds.sub.public)) {
            const stylesheets = tags(html, 'link').filter((a) => attr(a, 'rel') === 'stylesheet').map((a) => attr(a, 'href'))
            expect(stylesheets[0], file).toBe('/sub/css/theme.css')
            const brand = tags(html, 'a').find((a) => /site-header__brand/.test(a))
            expect(attr(brand, 'href'), file).toMatch(/^\/sub\/(de\/)?index\.html$/)
        }
    })

    it('writes every font the CSS names under public/fonts/umwege/ (§S15)', () => {
        const pub = builds.sub.public
        const css = fs.readFileSync(path.join(pub, 'css', 'theme.css'), 'utf-8')
        const urls = [...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1])
        expect(urls.length).toBe(6)
        for (const url of urls) {
            const target = path.resolve(pub, 'css', url)
            expect(target.startsWith(path.join(pub, 'fonts', 'umwege') + path.sep), url).toBe(true)
            expect(fs.existsSync(target), url).toBe(true)
        }
    })
})
