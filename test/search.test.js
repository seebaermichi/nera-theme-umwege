// The fixture's search pages (plugin-search as an optional peer), English and
// German: standard pages whose body is the plugin's interface, each on its own
// language's index, the only pages in any variant that load a script —
// exactly plugin-search's, once, at the end of <body>. Without plugins they do
// not exist.
import fs from 'fs'
import path from 'path'
import { describe, expect, inject, it } from 'vitest'
import { attr, countTags, elementByClass, page, pages, tags } from './helpers/html.js'

const builds = inject('builds')
const scriptSrcs = (html) => tags(html, 'script').map((attrs) => attr(attrs, 'src'))
const searchInput = (html) => tags(html, 'input').find((attrs) => /search__input/.test(attrs))
const readIndex = (publicDir, file) => JSON.parse(fs.readFileSync(path.join(publicDir, file), 'utf-8'))
const DE_PAGE = path.join('de', 'suche.html')

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
        const input = searchInput(body)
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
        const index = readIndex(builds.default.public, 'search-index.json')
        expect(index.length).toBeGreaterThan(0)
        for (const entry of index) {
            expect(entry.lang, entry.href).toBe('en')
            expect(entry.href, entry.href).not.toMatch(/^\/de\//)
            // the configured fields, plus the `lang` group_by_lang adds
            expect(Object.keys(entry).every((key) => ['title', 'description', 'content', 'href', 'lang'].includes(key)), entry.href).toBe(true)
        }
        expect(index.some((entry) => entry.href === '/posts/dolomites-without-a-car.html')).toBe(true)
    })

    it('is, with its German twin, the only page with a <script>, in every variant', () => {
        const expected = { noplugins: [], onelang: ['search.html'] }
        for (const name of ['default', 'overrides', 'allposts', 'sub', 'onelang', 'noplugins']) {
            const withScript = pages(builds[name].public).filter(({ html: h }) => countTags(h, 'script') > 0).map(({ file }) => file)
            expect(withScript, name).toEqual(expected[name] || [DE_PAGE, 'search.html'])
        }
    })

    it('prefixes the script and the index with base_path', () => {
        for (const [file, index] of [['search.html', '/sub/search-index.json'], [DE_PAGE, '/sub/search-index.de.json']]) {
            const sub = page(builds.sub.public, file)
            expect(scriptSrcs(sub), file).toEqual(['/sub/js/search.js'])
            expect(attr(searchInput(sub), 'data-search-index'), file).toBe(index)
        }
    })

    it('does not exist without plugins (no page, no script, no index)', () => {
        const pub = builds.noplugins.public
        for (const file of ['search.html', DE_PAGE, path.join('js', 'search.js'), 'search-index.json', 'search-index.de.json']) {
            expect(fs.existsSync(path.join(pub, file)), file).toBe(false)
        }
    })
})

describe('German search page', () => {
    const html = page(builds.default.public, DE_PAGE)

    it('renders the German header and the plugin\'s labels from the site\'s translations', () => {
        const header = elementByClass(html, 'header', 'page__header')
        expect(header).toContain('<h1 class="page__title">Suche</h1>')
        expect(countTags(html, 'h1')).toBe(1)
        const input = searchInput(elementByClass(html, 'div', 'page__body'))
        expect(attr(input, 'aria-label')).toBe('Suche')
        expect(attr(input, 'placeholder')).toBe('Reisen durchsuchen …')
        expect(scriptSrcs(html)).toEqual(['/js/search.js'])
    })

    it('loads the German index (meta.searchIndexPath, not the default app.searchIndexPath)', () => {
        expect(attr(searchInput(html), 'data-search-index')).toBe('/search-index.de.json')
        expect(attr(searchInput(page(builds.default.public, 'search.html')), 'data-search-index')).toBe('/search-index.json')
    })

    it('writes the German index with German pages only', () => {
        const index = readIndex(builds.default.public, 'search-index.de.json')
        expect(index.length).toBeGreaterThan(0)
        for (const entry of index) {
            expect(entry.lang, entry.href).toBe('de')
            expect(entry.href, entry.href).toMatch(/^\/de\//)
        }
        expect(index.some((entry) => entry.href === '/de/posts/dolomites-without-a-car.html')).toBe(true)
    })

    it('is paired with the English page by the language switch', () => {
        const switchLinks = (h) => tags(h, 'a').filter((a) => /lang-switch__link/.test(a))
        const [toDe] = switchLinks(page(builds.default.public, 'search.html'))
        expect(attr(toDe, 'href')).toBe('/de/suche.html')
        expect(attr(toDe, 'hreflang')).toBe('de')
        const [toEn] = switchLinks(html)
        expect(attr(toEn, 'href')).toBe('/search.html')
        expect(attr(toEn, 'hreflang')).toBe('en')
    })
})

describe('The "Search" menu item', () => {
    const navLinks = (h) => tags(elementByClass(h, 'header', 'site-header'), 'a').filter((a) => /nav__link/.test(a))
    const searchLink = (h, href) => navLinks(h).find((a) => attr(a, 'href') === href)

    it('is in both menus, and active on the search page only', () => {
        for (const [home, file, href] of [['index.html', 'search.html', '/search.html'], [path.join('de', 'index.html'), DE_PAGE, '/de/suche.html']]) {
            const onHome = searchLink(page(builds.default.public, home), href)
            expect(onHome, home).toBeDefined()
            expect(attr(onHome, 'class'), home).not.toMatch(/nav__link--active\b/)
            const onSearch = searchLink(page(builds.default.public, file), href)
            expect(attr(onSearch, 'class'), file).toMatch(/\bnav__link--active\b/)
        }
        expect(navLinks(page(builds.default.public, 'index.html')).map((a) => attr(a, 'href'))).not.toContain('/de/suche.html')
    })
})
