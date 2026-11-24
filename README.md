# @nera-static/theme-umwege

[![Test](https://github.com/seebaermichi/nera-theme-umwege/actions/workflows/test.yml/badge.svg)](https://github.com/seebaermichi/nera-theme-umwege/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/@nera-static/theme-umwege)](https://www.npmjs.com/package/@nera-static/theme-umwege)

A blog theme for the [Nera](https://github.com/seebaermichi/nera) static site generator, made for travel writers: trips with facts, a route and places. It is presentation only — Pug views, one stylesheet, two self-hosted webfonts and a `config/theme.yaml` of design tokens.

📖 **Documentation:** [nera.js.org](https://nera.js.org)

- **"Umwege"** (German for detours, the long way round): a white page, a petrol band for header, hero and footer with cream text on it, sun yellow and coral as second colours, large radii and pills. Titles in Fraunces 900, text in DM Sans.
- **Trips, not just posts**: the home shows the newest pictures as tilted prints and the newest post as a boarding pass with its facts; cards carry a location chip and fact chips; a post opens with a cover, four coloured fact tiles and an ordered list that reads as the route; the tags become passport stamps.
- **No JavaScript** and **no third-party request**: the fonts are served from your own site, every URL the theme emits is a path on your site, and it works under a `base_path`.
- **Accessible by default**: skip link, one `<main id="main">`, one `<h1>` per page, labelled navigation, visible focus, a language switch with `hreflang` and `lang`, contrast of at least 4.5:1 for every default colour pair, no motion for visitors who asked for less.
- **Plugins are optional**: plugin output reaches a page only through *seams* you fill; without a plugin the seam renders nothing.
- **Interchangeable with the other Nera blog themes**: the same page types, frontmatter and `config/theme.yaml` keys as `@nera-static/theme-stack`, `@nera-static/theme-ansitz` and `@nera-static/theme-blog`, so a blog switches by changing `theme:`.

## Installation

```bash
npm install @nera-static/theme-umwege
```

In your site's `config/app.yaml`:

```yaml
theme: umwege
```

The theme needs Nera's engine, `@nera-static/core`, **4.15.0 or later** (`"nera": { "generator": ">=4.15.0" }`); an older one fails the build with a message naming the range. Keep a `theme/views/` folder in your site (it holds your vendor copies and seam overrides anyway), and remove the `nera new` starter files `theme/views/layouts/layout.pug` and `theme/views/pages/default.pug` if they still carry the `nera:scaffold-default` line, or they hide the theme's files (`nera validate` warns with `theme-shadowed`).

The theme is built for `@nera-static/plugin-images`: without it the pictures that carry the look (the prints, the pass, the cards, the cover) stay empty frames.

## Page types

Set a page's `layout` to one of these:

| `layout:` | for | renders |
|---|---|---|
| `pages/home.pug` | the front page | the hero on the petrol band (the page's `title` as `<h1>`, its `lead`, and the pictures of the three newest posts with an `image` as tilted prints captioned with their `location`), the newest post as a boarding pass ("Latest post", date, title, its `facts`, picture, "Read more"), the next `blog.home_posts` posts as cards ("Recent posts"), the `tag-cloud` seam as passport stamps under "Tags", the highlight list, the about block |
| `pages/post.pug` | one post | header on the petrol band (series line; the `location` chip and the author line with published and updated date; title; lead), the `post-media` seam as a cover overlapping the band when the post has an `image`, its `facts` as four coloured tiles, the body, then the `post-tags` seam, the parts of its series and the `post-pagination` seam |
| `pages/archive.pug` | all posts | page header, body, the posts grouped by year (newest first, with the number of posts), each row with its picture, title, location and day and month; the `tag-cloud` seam (stamps) at the end |
| `pages/tag.pug` | the tag pages of `@nera-static/plugin-tags` | the `tag-overview` seam, which owns the page's `<h1>` |
| `pages/default.pug` | about, legal pages, anything else | page header, body |

The page header is the page's only `<h1>` (from `title`), so **start a page's Markdown at `##`**.

**The home** renders no Markdown body; its `title` and `lead` fill the hero:

```markdown
---
layout: pages/home.pug
title: Detours worth the trip.
lead: Umwege is German for the long way round. I take it on purpose.
archive_href: /archive.html
---
```

**The prints** are the pictures of the three newest posts that have an `image` (a post without one is skipped). **The boarding pass** is the newest post, with or without a picture. **The cards** list the `blog.home_posts` newest posts after the pass's (default 7: one wide card and two rows of three); the pass is not counted. The first card is `post-card--featured`, two columns wide. A card shows the picture with the `location` as a chip, the title, the `description` and the first three `facts` values as chips; cards carry no date.

**Posts** are the pages whose `layout` is listed in `blog.post_layouts` (default `['pages/post.pug']`) and whose language is the current page's, newest first by date, ties broken by URL. Give every post a `date`. Prev/next comes from `@nera-static/plugin-page-pagination`, which pairs pages of the same folder (the older post is "previous"), so keep the posts of one language in a folder of their own (`pages/posts/`, `pages/de/posts/`).

Frontmatter the views read:

| key | type | read by |
|---|---|---|
| `title` | string | every page (`<title>`, the `<h1>`, card and archive titles) |
| `description` | string | every page (`<meta name="description">`); the text of a card |
| `lead` | string | page and post header, the home's hero |
| `robots` | string | `<meta name="robots">` (else `robots` in `config/app.yaml`) |
| `lang` | string | `<html lang>`, the post selection, dates, `t()` (else `lang` in `config/app.yaml`) |
| `slug` | string | the language switch: translations of one page share a `slug` |
| `date` | date | post, the boarding pass, archive (becomes `meta.createdAt`) |
| `updated` | date | post |
| `author` | string | post: the author line (else `author.name` of `config/theme.yaml`) |
| `archive_href` | site path | home: the "All posts" link |
| `image`, `image_alt` | path, string | whether a post has a picture: it shows through the `post-media` and `card-media` seams |
| `location` | string | the chip on a card's picture and in a post's header, the caption of a print, under the title of archive rows. Make it one of the post's `tags` too, so the stamps lead to the same places |
| `tags` | list of strings | `blog.highlight_tag` selects by it; plugin-tags reads the list for the tag links and pages |
| `series`, `series_part` | string, integer | above the title: "Series: `<name>` · Part `<n>`"; under the post: the parts of the series in the page's language, ordered by `series_part`, the current one marked |
| `facts` | list of `{ label, value }`, at most four | four coloured tiles under a post's cover, the same four on the home's boarding pass, the first three values as chips on a card. Values carry their unit: `9 days`, `Night train`, `€780` |

Dates are printed with `toLocaleDateString(<page language>, { year: 'numeric', month: 'long', day: 'numeric' })` in UTC; archive rows print day and month only, under their year.

## Seams: where plugin output goes

A seam is a partial the theme ships empty (or with a plugin-free default). You fill it by putting a file with the same path into your site's `theme/views/`. The theme never reads plugin data itself, so a theme update cannot break on a plugin's data shape. Publish each plugin's templates into your site first (`npx nera-<plugin>`, for example `npx nera-tags`); they land in `theme/views/vendor/plugin-<name>/`.

| seam (`theme/views/…`) | where | in scope | typical override |
|---|---|---|---|
| `partials/head-extra.pug` | end of `<head>` | `app`, `meta` | canonical and alternate links |
| `partials/feed-link.pug` | end of `<head>`, before `head-extra.pug` | `app`, `meta` | plugin-feed |
| `partials/nav-main.pug` | inside the header's `<nav>` | `app`, `meta` | plugin-navigation (a "Feed" entry goes into its menu) |
| `partials/footer-extra.pug` | footer, before the legal links | `app`, `meta` | plugin-social-media-links |
| `partials/scripts-extra.pug` | end of `<body>` | `app`, `meta` | your own `<script type="module">` |
| `partials/post-media.pug` | `div.post__media` of a post with `image` | `meta` | plugin-images, eager |
| `partials/card-media.pug` | a card, an archive row, a print in the home's hero, the stub of the boarding pass | `item` (the post) | plugin-images |
| `partials/post-tags.pug` | `div.post__tags` of a post | `meta` | plugin-tags |
| `partials/post-pagination.pug` | `div.post__pagination` of a post | `meta` | plugin-page-pagination |
| `partials/tag-overview.pug` | `section.tag-page` | `meta`, `app` | plugin-tags. Default without the plugin: `header.page__header` with `h1.page__title`, and the body |
| `partials/tag-cloud.pug` | the home's stamps under "Tags", the end of the archive | `app`, `meta` | plugin-tags (without it the home's "Tags" section is hidden) |

The overrides, ready to copy:

```pug
//- theme/views/partials/feed-link.pug — npx nera-feed (needs `origin` in config/app.yaml)
include /vendor/plugin-feed/feed-link
```

```pug
//- theme/views/partials/nav-main.pug — npx nera-navigation
//- One menu per language (elements.main_en, elements.main_de in config/navigation.yaml).
include /vendor/plugin-navigation/partials/link-list-navigation
+linkListNav(((app.nav || {})[`main_${meta.lang || app.lang}`] || { elements: [] }).elements, '', (meta.lang || app.lang) === app.lang ? '/' : `/${meta.lang}`)
```

```pug
//- theme/views/partials/footer-extra.pug — npx nera-social-media-links
//- Never include fontawesome-cdn-link.pug: it loads icons from a CDN.
include /vendor/plugin-social-media-links/social-media-links
```

```pug
//- theme/views/partials/post-media.pug — npx nera-images
include /vendor/plugin-images/picture
+picture(meta.images && meta.images.image, { alt: meta.image_alt, class: 'post__image', loading: 'eager' })
```

```pug
//- theme/views/partials/card-media.pug
include /vendor/plugin-images/picture
+picture(item.meta.images && item.meta.images.image, { alt: item.meta.image_alt, class: 'post-card__image' })
```

```pug
//- theme/views/partials/post-tags.pug — npx nera-tags
include /vendor/plugin-tags/partials/tag-links
```

```pug
//- theme/views/partials/tag-overview.pug
include /vendor/plugin-tags/pages/tag-overview
```

```pug
//- theme/views/partials/tag-cloud.pug
include /vendor/plugin-tags/partials/tag-cloud
```

```pug
//- theme/views/partials/post-pagination.pug — npx nera-page-pagination
include /vendor/plugin-page-pagination/page-pagination
```

## What a post may contain

Pictures inside a post come from plugin-images' output, which the theme only styles. No raw HTML and no special classes are needed:

- `![alt](src "Caption")` → plugin-images' `figure.nera-image` with rounded corners and its caption underneath;
- two images in one paragraph (`![a](/images/a.jpg) ![b](/images/b.jpg)`) → side by side at 3:2; the paragraph after them reads as their caption (small and muted);
- an ordered list → **the route**: a petrol card with sun dots joined by a dashed line. Start each item with the stop in bold: `1. **Day 1: Berlin to Bolzano** Night train via Munich, 11 hours`;
- a blockquote → a yellow box; a leading `**bold**` reads as its title (`> **Worth knowing** The guest card …`);
- a Markdown table → a sand header row and hairlines;
- a bullet list → coral dots.

## External links in a new tab

The theme sets no `target` itself, but it marks every link that opens a new tab with an arrow (`↗`), so the change of context is visible. To open external links in a new tab:

```bash
npm install @nera-static/plugin-link-attributes
npx nera-link-attributes     # writes config/link-attributes.yaml
```

```yaml
# config/link-attributes.yaml — every link in page content whose href starts with http or www
attributes:
    - target="_blank"
    - rel="noopener noreferrer"
```

```yaml
# config/social-media-links.yaml — the footer's social links too
open_in_new_tab: true
```

`nera check`'s opt-in rule `a11y-target-blank` reports every `target="_blank"`; a site that opens new tabs on purpose leaves it off (its default) or sets `a11y-target-blank: off` in `config/validate.yaml`. Links of the theme itself (header, footer, legal links) are internal and never open a new tab.

## Configuration: `config/theme.yaml`

The theme's `config/theme.yaml` holds every key with a default. Your site's `config/theme.yaml` is deep-merged over it: set only what you change. Arrays are replaced as a whole.

```yaml
label: Umwege
tokens:
    color:
        bg: '#ffffff'            # page background
        surface: '#f6ead4'       # sand: archive rows, chips, the stamps' band, picture frames before they load
        text: '#17231f'          # titles and text
        muted: '#56635e'         # descriptions, captions, counts
        accent: '#0d4b45'        # petrol: header, hero, footer, the route, buttons, year numerals
        accent_text: '#fff3dc'   # cream: text on petrol, the boarding pass
        border: '#dfe5e1'        # hairlines
        focus: '#b8370f'         # the :focus-visible outline
        sun: '#ffcf3f'           # location chips, the yellow box, the route's dots, the current series part
        coral: '#f4603a'         # the highlight band, link underlines, bullets, arrows
        sky: '#cfe8f5'           # the author's initials, the second fact tile
    font:
        body: "'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        heading: "'Fraunces', Georgia, 'Times New Roman', serif"
        mono: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace"
    size:
        base: '1.0625rem'        # body text size
        measure: '41rem'         # width of the reading column
        width: '73rem'           # width of header, lists and footer
        radius: '1.625rem'       # corners of cards, the pass, the series and prev/next
        space: '1.5rem'          # vertical rhythm of running text
extra_css: []
footer_links: []
blog:
    post_layouts: ['pages/post.pug']
    home_posts: 7
    featured_series: ''
    highlight_tag: ''
author:
    name: ''
    bio: ''
    href: ''
```

| key | meaning |
|---|---|
| `tokens.<group>.<name>` | each token becomes the CSS custom property `--theme-<group>-<name>` (`_` → `-`) in an inline `<style>`; a value containing `<`, `>`, `{`, `}` or `;` is dropped. `theme.css` repeats every default, so the page is styled even if the `<style>` is blocked. |
| `extra_css` | stylesheets linked after `theme.css`. Only root-absolute paths (`/css/custom.css`) are linked. |
| `footer_links` | the footer's legal links: `{ label, href }`; `label` goes through `t()`, `href` is a path or a `{ <lang>: path }` map. |
| `blog.post_layouts` | the layouts that make a page a post |
| `blog.home_posts` | how many cards the home shows after the boarding pass (default 7) |
| `blog.featured_series` | not rendered by Umwege; declared so a config written for Stack or Ansitz carries over |
| `blog.highlight_tag` | a tag: the home lists the titles of the newest four posts whose frontmatter `tags` contain it on a coral band, with the tag as its heading. Nothing when no post has it. |
| `author.name`, `author.bio`, `author.href` | the about block on the home (the initials of the name in a sky circle, "About the author", the name, the bio, a "Read more" link to `href`) and the author line of a post. `href` is a path or a `{ <lang>: path }` map. Without `name` neither is rendered; a post's own `author` wins on that post. |

A travel blog with an author and legal pages in English and German:

```yaml
# your site's config/theme.yaml
footer_links:
    - label: Imprint
      href: { en: /imprint.html, de: /de/impressum.html }
    - label: Privacy
      href: { en: /privacy.html, de: /de/datenschutz.html }
blog:
    home_posts: 5
    highlight_tag: Road notes
author:
    name: Lena Sommer
    bio: Bookseller from Freiburg, travelling slowly since 2014.
    href: { en: /about.html, de: /de/ueber-mich.html }
```

**Pictures.** The post's cover runs the full page width, so give `@nera-static/plugin-images` wide enough sizes and let the cover load first:

```yaml
# your site's config/images.yaml
widths: [480, 800, 1600, 2400]
eager_first: false
```

Keep your originals in the assets folder and let the plugin make the sizes; list the folder in `.neraignore` if the originals (with their EXIF and GPS data) should not be published.

**Where a picture is cut.** The theme fills each frame with `object-fit: cover`, centred: a post's cover is 2:1 (4:3 on a phone), the cards 4:5 (4:3 on a phone; the wide first card about 3:4), the boarding pass and the archive rows 4:3, the prints about 1:1. An upright photograph whose subject sits high loses it in the 2:1 cover. Crop the original once with plugin-images' query parameters on the frontmatter `image`, around the subject:

```yaml
image: /images/u-bahn.jpg?ratio=4:3&focus=50,33   # x,y in percent of the original
```

`focus` only takes effect together with `ratio` (a crop). The crop is the picture everywhere the post appears, so pick a ratio between the widest and the tallest frame: `4:3` around the subject keeps it in the 2:1 cover and on a 4:5 card.

A landscape whose subject sits at its lower edge (a ferry on the water, people on a beach) loses it in the 2:1 cover, which cuts a 3:2 photograph at top and bottom. Crop it to the cover's own ratio at the bottom; a subject near the middle of the width then also survives the narrower frames (cards, prints, the pass):

```yaml
image: /images/ferry.jpg?ratio=2:1&focus=50,100
```

**Fonts.** The theme ships its two families as `.woff2` under `assets/fonts/umwege/` (in your output: `/fonts/umwege/`), Latin and Latin Extended subsets each, with `font-display: swap` and relative URLs, so they work under a `base_path`. To use another family, self-host it and name it in `tokens.font.*`; the theme's own files are only downloaded where their family is used.

| family | files | source |
|---|---|---|
| Fraunces (variable weight and optical size, upright and italic) | `fraunces-latin{,-ext}-opsz-{normal,italic}.woff2` | `@fontsource-variable/fraunces` 5.3.0 |
| DM Sans (variable weight) | `dm-sans-latin{,-ext}-wght-normal.woff2` | `@fontsource-variable/dm-sans` 5.3.0 |

Code uses the system's monospace font (`tokens.font.mono`); the theme ships no file for it. Both families are under the SIL Open Font License 1.1; the licence texts ship beside the files (`OFL-<family>.txt`).

## Translations

Every string the theme renders goes through `t()` with an English key, so an English site needs nothing. For other languages add the keys under `translations.<lang>` in `config/app.yaml`:

```yaml
translations:
    en:
        language_name: English
    de:
        language_name: Deutsch
        Skip to content: Zum Inhalt springen
        Main navigation: Hauptnavigation
        Language: Sprache
        Legal: Rechtliches
        Recent posts: Neueste Reisen
        All posts: Alle Reisen
        Latest post: Neueste Reise
        Published: Veröffentlicht
        Updated: Aktualisiert
        Series: Serie
        Part: Teil
        About the author: Über die Autorin
        Read more: Weiterlesen
        Tags: Orte und Themen
        posts: Reisen
        # your footer_links labels
        Imprint: Impressum
        Privacy: Datenschutz
        # plugin-page-pagination
        Pagination: Blätternavigation
```

| key | where |
|---|---|
| `Skip to content` | the skip link |
| `Main navigation`, `Language`, `Legal` | `aria-label` of the header navigation, the language switch, the footer's legal links |
| `Recent posts`, `All posts` | the heading of the home's cards and the link beside it |
| `Latest post` | the label on the boarding pass and its `aria-label` |
| `Tags` | the heading over the home's stamps |
| `Published`, `Updated` | a post's author line |
| `Series`, `Part` | the series line above a post's title, the `aria-label` of a post's series list |
| `About the author`, `Read more` | the home's about block; `Read more` is also the boarding pass's button (and plugin-tags' link text on tag pages) |
| `posts` | the count under a year in the archive ("7 posts") |
| `language_name` | each language's own name in the language switch |

`blog.highlight_tag` is one value for every language: posts of every language that should appear in the highlight list carry the same tag.

The language switch appears when `translations` has two or more languages and another language has a page to link: the page with the same `slug`, else that language's home page.

## Overriding the theme

| to change | do this | keeps theme updates for |
|---|---|---|
| a colour, a font, a width | the token in your `config/theme.yaml` | everything |
| a few CSS rules | `theme/assets/css/custom.css` + `extra_css: ['/css/custom.css']` | everything |
| where plugin output goes | override a seam | every other file |
| one partial or page type | copy it to `theme/views/<same path>` | every other file |
| the whole shell | override `layouts/layout.pug` | page types, partials, CSS |
| a new page type | `theme/views/pages/<name>.pug` with `extends ../layouts/layout.pug` | everything |

The layout defines the blocks `head`, `header`, `main`, `footer` and `scripts`. The views and partials, all part of the contract: `layouts/layout.pug`; `partials/head.pug`, `tokens.pug`, `helpers.pug`, `header.pug`, `lang-switch.pug`, `footer.pug`, `scripts.pug`, `page-header.pug`, `post-card.pug` (one post in a list; `item`, `position` and `featured` in scope), `home-highlight.pug`, `home-series.pug` (empty in Umwege) and `home-about.pug`; the seams above; the five page types.

`partials/helpers.pug` defines `pageLang(page)`, `sameLang(page)`, `homeHref(lang)`, `formatDate(value, lang)`, `isoDate(value)` and `hrefFor(value, lang)`. A layout of your own includes it first. It also defines `themeUmwege`, an object the theme's own views use internally; it is not part of the contract.

The home's "Tags" section has no class of its own: the theme draws its sand band with `.site-main > section:has(> .tag-cloud)` and hides it when the `tag-cloud` seam renders nothing.

### Classes

The theme's public classes, safe to style in your `custom.css`:

- shell: `skip-link`, `site-header`, `site-header__inner`, `site-header__brand`, `site-header__nav`, `lang-switch`, `lang-switch__list`, `lang-switch__item`, `lang-switch__link`, `site-main`, `page__header`, `page__title`, `page__lead`, `page__body`, `site-footer`, `site-footer__inner`, `site-footer__legal`, `site-footer__copy`
- home: `home-hero`, `home-hero__inner`, `home-hero__title`, `home-hero__lead`, `home-hero__aside` (the prints), `home-pass`, `home-pass__facts`, `button`, `button--primary`, `home-highlight`, `home-about`, `home-about__mark`, `home-about__links`
- lists: `post-list`, `post-list__title`, `post-list__items`, `post-list__item`, `post-list__more`, `post-card`, `post-card--featured`, `post-card__media`, `post-card__image`, `post-card__body`, `post-card__title`, `post-card__link`, `post-card__excerpt`, `post-card__location`, `post-card__facts`, `post-archive__year`, `post-archive__count`, `post-archive__list`, `post-archive__item`, `tag-page`
- post: `post`, `post__header`, `post__series`, `post__title`, `post__lead`, `post__meta`, `post-author`, `post-author__mark`, `post-author__name`, `post__author`, `post__date`, `post__updated`, `post__location`, `post__media`, `post__image`, `post__body`, `post-facts`, `post-facts__item`, `post-facts__label`, `post-facts__value`, `post__footer`, `post__tags`, `post-series`, `post-series__title`, `post-series__list`, `post-series__item`, `post-series__item--current`, `post__pagination`

The plugin classes the theme styles, all optional peer dependencies:

| plugin | peer range | classes |
|---|---|---|
| `@nera-static/plugin-tags` | `^3.4.1` | `tag-cloud`, `tag-cloud__item`, `tag-links`, `tag-links__item`, `tag-overview` and its elements (`__header`, `__title`, `__image`, `__content`, `__item`, `__item-title`, `__item-date`, `__item-description`, `__item-link`) |
| `@nera-static/plugin-page-pagination` | `^2.4.0` | `page-pagination`, `page-pagination__link`, `page-pagination__link--previous`, `page-pagination__link--next` |
| `@nera-static/plugin-images` | `^1.0.3` | `nera-image`, `nera-image__caption` |
| `@nera-static/plugin-navigation` | `^3.1.0` | `nav`, `nav--list`, `nav__item`, `nav__link`, `nav__link--active`, `nav__link--active-path` — only inside `.site-header__nav` |
| `@nera-static/plugin-social-media-links` | `^2.3.0` | `social-media-links` and its elements — only inside `.site-footer` |

## What your site must do

The theme guarantees its own markup. Your content and the plugin output are yours; for `nera check` to report nothing:

1. Keep a `theme/views/` folder, and delete the `nera:scaffold-default` starter files from it.
2. Publish every plugin template you use (`npx nera-<plugin>`) and fill the seams; keep plugin-navigation's default class names and call `+linkListNav` (with `rootPath` for a language folder).
3. Use `@nera-static/plugin-page-pagination` 2.4.0 or later and translate `Pagination`.
4. Never include `fontawesome-cdn-link.pug`. Set `open_in_new_tab` in `config/social-media-links.yaml` deliberately: `false` keeps every link in the same tab; `true` (with plugin-link-attributes for content links, see above) needs `a11y-target-blank` off.
5. Set `footer_links` to your imprint and privacy pages, per language, with labels the legal checks recognise (`Imprint`/`Impressum`, `Privacy`/`Datenschutz`).
6. Translate every theme key, `language_name` per language, and your `footer_links` labels.
7. Start page bodies at `##`, give every image an `alt` (`image_alt` for a frontmatter `image`), every post a `date`, and the translations of one page the same `slug`.
8. With plugin-tags: `tag_overview_layout: 'pages/tag.pug'` in `config/tags.yaml` (and `group_by_lang: true` on a multilingual site). With plugin-images: `widths: [480, 800, 1600, 2400]` and `eager_first: false` in `config/images.yaml`.

`test/site/` in this repository is a complete example: the sample travel blog "Umwege" in English and German with every step above applied, checked in CI with every `nera check` rule on except `a11y-target-blank` (its external links open in a new tab). **Its photographs are not covered by the MIT licence of this repository:** they are from [Unsplash](https://unsplash.com) and used under the [Unsplash License](https://unsplash.com/license); `test/site/CREDITS.md` names the photographer of each. They are not part of the npm package.

## Accessibility and privacy

- Skip link first, one `<main id="main">`, one `<h1>`, no skipped heading level, every theme `<nav>` labelled, `<html lang>` always set, a zoomable viewport, no `target="_blank"` in theme markup (links that a plugin opens in a new tab are marked with `↗`). The pin icons are `aria-hidden`; a print's link carries its place as text, so it keeps a name without plugin-images.
- `:focus-visible` gets a 3 px outline in the `focus` colour. Colour fades on hover run only for visitors without a reduced-motion preference.
- The eight default colour pairs reach at least 4.5:1 (the lowest, `muted` on `surface`, 5.3:1); text on the second colours is always `text` (on `coral` 5.1:1).
- No JavaScript, no cookies or device storage, no request to another host: the fonts come from your site. Narrow screens are handled by CSS alone; below 900 px every grid stacks to one column, the boarding pass puts its stub under the facts, and covers and cards turn 4:3.

## Versioning

The theme follows semantic versioning over its contract: view, partial, seam and block paths; token names and every `config/theme.yaml` key; the `t()` keys; the frontmatter and `app.*` keys it reads; the public classes; the plugin classes it styles.

| change | release |
|---|---|
| remove or rename any of these, change an element or its nesting under a public class, change what a key means, raise the `nera.generator` floor, drop a plugin major | major |
| add a view, seam, block, token, key or class; add a plugin major to a peer range; change a token's default | minor (a new `t()` key is named in the [changelog](CHANGELOG.md)) |
| a CSS or markup fix that keeps the contract, an accessibility fix, docs | patch |

## Development

```bash
npm ci
npm run lint
npx vitest run     # builds the fixture site in temporary copies and checks it
```

The first run encodes the fixture's photographs into `test/site/.nera-cache/` (about a minute); later runs reuse it. To look at the fixture site: `cd test/site && npx nera build && npx nera serve`.

## License

MIT. The fonts under `assets/fonts/umwege/` are under the SIL Open Font License 1.1 (see the `OFL-*.txt` files beside them). The photographs of the fixture site (`test/site/theme/assets/images/`) are under the Unsplash License; see `test/site/CREDITS.md`.
