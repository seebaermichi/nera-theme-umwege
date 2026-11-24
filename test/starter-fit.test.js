// §S15 "Starter fit", with the page contents of §S11.7 (Umwege): the home
// shows the title and lead, the three newest posts with a picture as prints,
// the newest post as the boarding pass and the next `blog.home_posts` posts
// as cards, the first as post-card--featured (the pass is not counted,
// decided 2026-11-24); the tags as stamps; the highlight list; the about
// block. The archive groups by year with a count; a tag page has one <h1>;
// a post shows its tags, its series with the current part marked, its facts
// and the prev/next of plugin-page-pagination; a post without a picture
// renders no empty media element.
import { describe, expect, inject, it } from 'vitest'
import { attr, countTags, elementByClass, page, stripTags, tags } from './helpers/html.js'

const builds = inject('builds')
const pub = builds.default.public
const sections = (html, className) => html.split(`<section class="${className}"`).slice(1).map((s) => s.split('</section>')[0])
const cardHrefs = (html) => tags(html, 'a').filter((a) => /post-card__link/.test(a)).map((a) => attr(a, 'href'))

describe('Starter fit: home', () => {
    const html = page(pub, 'index.html')

    it('shows the page title as the one <h1> and the lead on the petrol hero', () => {
        const hero = elementByClass(html, 'section', 'home-hero')
        expect(hero).toMatch(/<h1 class="home-hero__title">Detours worth the trip\.<\/h1>/)
        expect(hero).toMatch(/<p class="home-hero__lead">Umwege is German for the long way round\./)
        expect(countTags(html, 'h1')).toBe(1)
    })

    it('shows the pictures of the three newest posts with a picture as prints, captioned with their location', () => {
        const aside = elementByClass(html, 'div', 'home-hero__aside')
        expect(tags(aside, 'a').map((a) => attr(a, 'href'))).toEqual([
            '/posts/dolomites-without-a-car.html',
            '/posts/norwegian-coast-by-ferry.html',
            '/posts/erg-chebbi-before-the-sun.html',
        ])
        expect(countTags(aside, 'picture')).toBe(3)
        expect([...aside.matchAll(/<span>([^<]+)<\/span>/g)].map((m) => m[1])).toEqual(['Italy', 'Norway', 'Morocco'])
    })

    it('skips posts without a picture for the prints', () => {
        // allposts lists every post, but the prints still need a picture each
        const aside = elementByClass(page(builds.allposts.public, 'index.html'), 'div', 'home-hero__aside')
        expect(countTags(aside, 'a')).toBe(3)
        expect(countTags(aside, 'picture')).toBe(3)
    })

    it('shows the newest post as the boarding pass: label, date, title, its four facts, picture and Read more', () => {
        const [pass] = sections(html, 'home-pass')
        expect(html).toContain('<section class="home-pass" aria-label="Latest post">')
        expect(pass).toMatch(/<p><span>Latest post<\/span><time datetime="2026-11-12">November 12, 2026<\/time><\/p>/)
        expect(pass).toMatch(/<h2><a href="\/posts\/dolomites-without-a-car\.html">Nine days in the Dolomites without a car<\/a><\/h2>/)
        expect(stripTags(elementByClass(pass, 'dl', 'home-pass__facts'))).toBe('Duration 9 days Getting there Night train On foot 132 km Spent €780')
        expect(pass).toMatch(/<picture>[\s\S]*alt="A mountain village in the snow/)
        expect(pass).toMatch(/<a class="button button--primary" href="\/posts\/dolomites-without-a-car\.html">Read more<\/a>/)
    })

    for (const [lang, home, prefix] of [['en', 'index.html', '/posts/'], ['de', 'de/index.html', '/de/posts/']]) {
        it(`${lang}: lists the next five posts after the pass's (home_posts: 5), newest first, the first as post-card--featured`, () => {
            const [list] = sections(page(pub, home), 'post-list')
            expect(cardHrefs(list)).toEqual([
                'norwegian-coast-by-ferry',
                'erg-chebbi-before-the-sun',
                'jaipur-before-the-buses',
                'djerba-in-february',
                'more-churches-than-cafes',
            ].map((slug) => `${prefix}${slug}.html`))
            expect(countTags(list, 'article')).toBe(5)
            expect(list.match(/post-card--featured/g)).toEqual(['post-card--featured'])
            expect(list).toMatch(/<li class="post-list__item">\s*<article class="post-card post-card--featured">/)
        })
    }

    it('counts home_posts after the pass: the default of 7 and a site override', () => {
        expect(cardHrefs(sections(page(builds.overrides.public, 'index.html'), 'post-list')[0])).toEqual([
            '/posts/norwegian-coast-by-ferry.html',
            '/posts/erg-chebbi-before-the-sun.html',
        ])
        const all = sections(page(builds.allposts.public, 'index.html'), 'post-list')[0]
        expect(countTags(all, 'article')).toBe(13)
    })

    it('gives a card its picture with the location chip, title, description and the first three facts', () => {
        const [list] = sections(html, 'post-list')
        const first = list.split('<li class="post-list__item">')[1]
        expect(first).toMatch(/<div class="post-card__media">\s*<picture>[\s\S]*<img class="post-card__image"[^>]*alt="A small ferry crossing a fjord/)
        expect(first).toMatch(/<span class="post-card__location"><svg [^>]*aria-hidden="true"[\s\S]*?<\/svg>Norway<\/span>\s*<\/div>/)
        expect(first).toMatch(/<h3 class="post-card__title"><a class="post-card__link" href="\/posts\/norwegian-coast-by-ferry\.html">Nine ferries up the Norwegian coast<\/a><\/h3>/)
        expect(first).toMatch(/<p class="post-card__excerpt">Bergen to Tromsø without one long-distance bus/)
        expect(stripTags(elementByClass(first, 'ul', 'post-card__facts'))).toBe('14 days Ferry €1,320')
        expect(first).not.toMatch(/<time/)
    })

    it('shows a card without a picture with no media element', () => {
        const [list] = sections(page(builds.allposts.public, 'index.html'), 'post-list')
        const card = list.split('<li class="post-list__item">').find((item) => item.includes('packing-list'))
        expect(card).not.toContain('post-card__media')
        expect(card).not.toContain('<picture')
        expect(card).toMatch(/<p class="post-card__excerpt">Everything I take for three weeks/)
    })

    it('headings are t() keys: Recent posts with the more link All posts, Tags over the stamps', () => {
        const [list] = sections(html, 'post-list')
        expect(list).toMatch(/^>\s*<h2 class="post-list__title">Recent posts<\/h2><a class="post-list__more" href="\/archive\.html">All posts<\/a>/)
        expect(html).toMatch(/<section>\s*<h2>Tags<\/h2>\s*<section class="tag-cloud">/)
    })

    it('shows the highlight list: the tag as heading, the titles of the four newest posts with it', () => {
        const list = elementByClass(html, 'section', 'home-highlight')
        expect(list).toMatch(/^\s*<div>\s*<h2>Road notes<\/h2>/)
        expect(tags(list, 'a').map((a) => attr(a, 'href'))).toEqual([
            '/posts/packing-list.html',
            '/posts/night-trains-worth-the-bunk.html',
            '/posts/what-a-trip-costs.html',
            '/posts/booking-ferries.html',
        ])
        expect(list).toContain('>Three weeks in seven kilos: my packing list</a>')
        expect(list).not.toMatch(/<picture|\/tags\//)
    })

    it('shows the about block: initials, label, name, bio, Read more to author.href', () => {
        const about = elementByClass(html, 'section', 'home-about')
        expect(about).toMatch(/<span class="home-about__mark" aria-hidden="true">LS<\/span>/)
        expect(about).toMatch(/<p>About the author<\/p>\s*<h2>Lena Sommer<\/h2>\s*<p>Bookseller from Freiburg/)
        expect(about).toMatch(/<a class="button" href="\/about\.html">Read more<\/a>/)
        expect(elementByClass(page(pub, 'de/index.html'), 'section', 'home-about')).toMatch(/href="\/de\/ueber-mich\.html">Weiterlesen</)
    })

    it('renders no featured series (§S11.3: Umwege shows none)', () => {
        expect(html).not.toContain('home-series')
    })

    it('leaves out the highlight and about blocks without their keys', () => {
        const plain = page(builds.overrides.public, 'index.html')
        expect(plain).not.toContain('home-highlight')
        expect(plain).not.toContain('home-about')
    })

    it('without plugins keeps the prints and the pass readable, and renders no empty Tags heading', () => {
        const plain = page(builds.noplugins.public, 'index.html')
        expect(stripTags(elementByClass(plain, 'div', 'home-hero__aside'))).toBe('ItalyNorwayMorocco')
        expect(plain).toMatch(/<h2><a href="\/posts\/dolomites-without-a-car\.html">/)
        expect(plain).not.toContain('tag-cloud')
        // the heading is there, theme.css hides a section without the cloud
        expect(plain).toMatch(/<section>\s*<h2>Tags<\/h2>\s*<\/section>/)
    })
})

describe('Starter fit: post', () => {
    const html = page(pub, 'posts/dolomites-without-a-car.html')

    it('shows the header on the band: series line, location chip, author line with published and updated, title, lead', () => {
        const header = elementByClass(html, 'header', 'post__header')
        expect(header).toMatch(/^\s*<p class="post__series">Series: Alps without a car · Part 3<\/p>/)
        expect(header).toMatch(/<p class="post__location"><svg [^>]*aria-hidden="true"[\s\S]*?<\/svg>Italy<\/p>/)
        expect(header).toMatch(/<span class="post-author__mark" aria-hidden="true">LS<\/span><span class="post__author post-author__name">Lena Sommer<\/span>/)
        expect(header).toMatch(/Published <time class="post__date" datetime="2026-11-12">November 12, 2026<\/time>/)
        expect(header).toMatch(/Updated <time class="post__updated" datetime="2026-11-15">November 15, 2026<\/time>/)
        expect(header).toMatch(/<h1 class="post__title">Nine days in the Dolomites without a car<\/h1>\s*<p class="post__lead">Everyone told me you need one\./)
    })

    it('renders the cover through post-media, eagerly, right after the header', () => {
        expect(html).toMatch(/<\/header>\s*<div class="post__media">\s*<picture>[\s\S]*?<img class="post__image" [^>]*alt="A mountain village in the snow[^"]*"[^>]*loading="eager"/)
    })

    it('renders no media element for a post without a picture', () => {
        const plain = page(pub, 'posts/packing-list.html')
        expect(plain).not.toContain('post__media')
        expect(plain).not.toMatch(/<picture|<img/)
        expect(plain).not.toContain('post__location')
    })

    it('shows its facts as four tiles under the cover, before the text', () => {
        const facts = elementByClass(html, 'dl', 'post-facts')
        expect(tags(facts, 'dt').length).toBe(4)
        expect(stripTags(facts)).toBe('Duration 9 days Getting there Night train On foot 132 km Spent €780')
        expect(html.indexOf('class="post-facts"')).toBeGreaterThan(html.indexOf('class="post__media"'))
        expect(html.indexOf('class="post-facts"')).toBeLessThan(html.indexOf('class="post__body"'))
    })

    it('outputs the route as an ordered list, the paired pictures and the yellow box from content', () => {
        const body = elementByClass(html, 'div', 'post__body')
        expect(body).toMatch(/<ol>\s*<li><strong>Day 1: Berlin to Bolzano<\/strong> Night train via Munich, 11 hours<\/li>/)
        expect(countTags(body.split('<ol>')[1].split('</ol>')[0], 'li')).toBe(5)
        expect(body).toMatch(/<p>\s*<picture>[\s\S]*?<\/picture>\s*<picture>[\s\S]*?<\/picture>\s*<\/p>/)
        expect(body).toMatch(/<blockquote>\s*<p><strong>Worth knowing<\/strong> The guest card/)
    })

    it('shows its tags through the post-tags seam', () => {
        const postTags = elementByClass(html, 'div', 'post__tags')
        expect(postTags).toMatch(/<section class="tag-links">/)
        expect(tags(postTags, 'a').map((a) => attr(a, 'href'))).toEqual(['/tags/italy.html', '/tags/mountains.html', '/tags/first-snow.html', '/tags/without-a-car.html', '/tags/night-trains.html'])
    })

    it('lists the parts of its series, the current one marked', () => {
        const part = page(pub, 'posts/hut-to-hut-val-gardena.html')
        expect(part).toMatch(/<nav class="post-series" aria-label="Series">/)
        const series = elementByClass(part, 'nav', 'post-series')
        expect(series).toContain('<h2 class="post-series__title">Alps without a car</h2>')
        const items = series.split('<li ').slice(1)
        expect(items.length).toBe(3)
        expect(items[0]).toMatch(/^class="post-series__item"><span>01<\/span><a href="\/posts\/south-tyrol-wrong-season\.html">/)
        expect(items[1]).toMatch(/^class="post-series__item post-series__item--current"><span>02<\/span><a href="\/posts\/hut-to-hut-val-gardena\.html" aria-current="page">/)
        expect(page(pub, 'de/posts/hut-to-hut-val-gardena.html')).toContain('<p class="post__series">Serie: Alps without a car · Teil 2</p>')
    })

    it('renders no series block or line and no facts for a post without them', () => {
        const plain = page(pub, 'posts/packing-list.html')
        expect(plain).not.toContain('post__series')
        expect(plain).not.toContain('post-series')
        expect(plain).not.toContain('post-facts')
    })

    it('shows previous / next from plugin-page-pagination, with the older post first', () => {
        const pagination = elementByClass(page(pub, 'posts/jaipur-before-the-buses.html'), 'div', 'post__pagination')
        expect(pagination).toMatch(/<nav class="page-pagination" aria-label="Pagination">/)
        expect(pagination).toMatch(/page-pagination__link--previous" href="\/posts\/djerba-in-february\.html">Djerba in February, alone on the beach</)
        expect(pagination).toMatch(/page-pagination__link--next" href="\/posts\/erg-chebbi-before-the-sun\.html">Erg Chebbi before the sun</)
    })

    it('links the feed through the feed-link seam', () => {
        expect(html).toMatch(/<link rel="alternate" type="application\/atom\+xml" href="\/feed\.xml"/)
        expect(page(pub, 'de/index.html')).toMatch(/<link rel="alternate" type="application\/atom\+xml" href="\/de\/feed\.xml"/)
    })
})
