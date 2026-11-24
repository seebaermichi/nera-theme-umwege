# Changelog

All notable changes to `@nera-static/theme-umwege` are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and the theme follows [semantic versioning](https://semver.org/) over its contract (see the README).

## [1.0.1] - 2026-11-24

### Changed

-   README: where pictures are cut, a second case — a landscape whose subject sits at its lower edge, cropped to 2:1 at the bottom (`ratio=2:1&focus=50,100`) so the post's cover keeps it.

## [1.0.0] - 2026-11-24

### Added

-   The "Umwege" blog theme for travel writers, trips with facts, a route and places: `views/`, `assets/css/theme.css`, `config/theme.yaml` and self-hosted webfonts, presentation only — no JavaScript, no third-party request.
-   Page types `pages/home.pug` (the hero on a petrol band with the pictures of the three newest posts as tilted prints, the newest post as a boarding pass with its facts, the next posts as cards with location and fact chips, the first one wide, the tags as passport stamps, the highlight list on coral, the about block), `pages/post.pug` (header on the petrol band with the location chip and author line, a cover overlapping the band, the facts as four coloured tiles, the ordered list styled as the route, tags, series list, prev/next), `pages/archive.pug` (posts by year with a count, rows with picture, title, location and day and month, the stamps at the end), `pages/tag.pug` and `pages/default.pug` — the same page types as `@nera-static/theme-stack`, `@nera-static/theme-ansitz` and `@nera-static/theme-blog`.
-   The shell `layouts/layout.pug` with the blocks `head`, `header`, `main`, `footer` and `scripts`, and the partials `head.pug`, `tokens.pug`, `helpers.pug`, `header.pug`, `lang-switch.pug`, `footer.pug`, `scripts.pug`, `page-header.pug`, `post-card.pug`, `home-highlight.pug`, `home-series.pug` (renders nothing in Umwege) and `home-about.pug`.
-   The seams `head-extra.pug`, `feed-link.pug`, `nav-main.pug`, `footer-extra.pug`, `scripts-extra.pug`, `post-media.pug`, `card-media.pug`, `post-tags.pug`, `post-pagination.pug`, `tag-overview.pug` and `tag-cloud.pug`.
-   Tokens: the sixteen of the Nera themes plus `color.sun`, `color.coral` and `color.sky`. Keys `blog.home_posts` (the cards after the boarding pass, which is not counted), `blog.featured_series` (declared, not rendered), `blog.highlight_tag`, `author.name`, `author.bio`, `author.href`. Frontmatter `image`, `image_alt`, `location`, `tags`, `series`, `series_part`, `facts`.
-   `t()` keys: `Skip to content`, `Main navigation`, `Language`, `Legal`, `Recent posts`, `All posts`, `Latest post`, `Published`, `Updated`, `Series`, `Part`, `About the author`, `Read more`, `Tags`, `posts`.
-   Fonts: Fraunces (variable weight and optical size, upright and italic) and DM Sans (variable weight), Latin and Latin Extended, from the `@fontsource-variable` packages 5.3.0, under the SIL Open Font License 1.1, in `assets/fonts/umwege/` with their licence texts. Code uses the system's monospace font.
-   Links that open a new tab are marked with an arrow (`↗`, in CSS on `a[target="_blank"]`), so the change of context is visible (WCAG 3.2.5). The theme sets no `target` itself: a site opens external links in a new tab with `@nera-static/plugin-link-attributes` (links in page content) and `open_in_new_tab: true` in plugin-social-media-links (footer). Such a site turns off `nera check`'s opt-in rule `a11y-target-blank`; the README shows the setup.
-   Optional peers, styled when present: `@nera-static/plugin-images` `^1.0.3`, `plugin-navigation` `^3.1.0`, `plugin-page-pagination` `^2.4.0`, `plugin-social-media-links` `^2.3.0`, `plugin-tags` `^3.4.1`.
