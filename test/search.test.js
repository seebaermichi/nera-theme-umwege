// The fixture's search page (plugin-search as an optional peer): a standard
// page whose body is the plugin's interface, the only page in any variant
// that loads a script — exactly plugin-search's, once, at the end of <body>.
// Without plugins the page does not exist.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { attr, countTags, elementByClass, page, pages, tags } from './helpers/html.js'

const builds = inject('builds')
const scriptSrcs = (html) => tags(html, 'script').map((attrs) => attr(attrs, 'src'))

describe('Search page', () => {
    const html = page(builds.default.public, 'search.html')

    it('renders the page header, then the plugin\'s input and results list in the body', () => {
        const header = elementByClass(html, 'header', 'page__header')
        expect(header).toContain('<h1 class="page__title">Search</h1>')
        expect(header).toContain('class="page__lead"')
        // the template's own h1 is off (show_title: false): one h1 on the page
        expect(countTags(html, 'h1')).toBe(1)
        expect(html).not.toContain('search__title')

        const body = elementByClass(html, 'div', 'page__body')
        const input = tags(body, 'input').find((attrs) => /search__input/.test(attrs))
        expect(input).toBeDefined()
        expect(attr(input, 'type')).toBe('search')
        expect(attr(input, 'aria-label')).toBe('Search')
        expect(attr(input, 'data-search-index')).toBe('/search-index.json')
        expect(attr(input, 'data-results')).toBe('[data-search__results]')
        expect(body).toMatch(/<ul class="search__results" data-search__results><\/ul>/)
    })

    it('loads plugin-search\'s script once, after main, at the end of <body>', () => {
        expect(scriptSrcs(html)).toEqual(['/js/search.js'])
        const main = html.indexOf('</main>')
        const script = html.indexOf('<script src="/js/search.js"></script>')
        expect(script).toBeGreaterThan(main)
        expect(html.slice(script)).toMatch(/^<script src="\/js\/search\.js"><\/script>\s*<\/body>/)
        expect(fs.existsSync(path.join(builds.default.public, 'js', 'search.js'))).toBe(true)
    })

    it('writes the English index, without the German posts (group_by_lang)', () => {
        const index = JSON.parse(fs.readFileSync(path.join(builds.default.public, 'search-index.json'), 'utf-8'))
        expect(index.length).toBeGreaterThan(0)
        for (const entry of index) {
            expect(entry.lang, entry.href).toBe('en')
            expect(entry.href, entry.href).not.toMatch(/^\/de\//)
            // the configured fields, plus the `lang` group_by_lang adds
            expect(Object.keys(entry).every((key) => ['title', 'description', 'content', 'href', 'lang'].includes(key)), entry.href).toBe(true)
        }
        expect(index.some((entry) => entry.href === '/posts/dolomites-without-a-car.html')).toBe(true)
    })

    it('is the only page with a <script>, in every variant', () => {
        for (const name of ['default', 'overrides', 'allposts', 'sub', 'onelang', 'noplugins']) {
            const withScript = pages(builds[name].public).filter(({ html: h }) => countTags(h, 'script') > 0).map(({ file }) => file)
            expect(withScript, name).toEqual(name === 'noplugins' ? [] : ['search.html'])
        }
    })

    it('prefixes the script and the index with base_path', () => {
        const sub = page(builds.sub.public, 'search.html')
        expect(scriptSrcs(sub)).toEqual(['/sub/js/search.js'])
        const input = tags(sub, 'input').find((attrs) => /search__input/.test(attrs))
        expect(attr(input, 'data-search-index')).toBe('/sub/search-index.json')
    })

    it('does not exist without plugins (no page, no script, no index)', () => {
        const pub = builds.noplugins.public
        expect(fs.existsSync(path.join(pub, 'search.html'))).toBe(false)
        expect(fs.existsSync(path.join(pub, 'js', 'search.js'))).toBe(false)
        expect(fs.existsSync(path.join(pub, 'search-index.json'))).toBe(false)
    })
})
