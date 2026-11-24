// The theme's contract as ROADMAP-themes.md states it (§S2, §S4, §S10–§S13), in one place for the tests.

export const VIEWS = [
    'layouts/layout.pug',
    'partials/head.pug',
    'partials/tokens.pug',
    'partials/helpers.pug',
    'partials/header.pug',
    'partials/lang-switch.pug',
    'partials/footer.pug',
    'partials/scripts.pug',
    // extra partials, contract too (README): as theme-blog, plus the home
    // blocks of §S11.5 (Umwege renders no featured series, but ships the
    // partial so a config carries over) and the highlight list
    'partials/page-header.pug',
    'partials/post-card.pug',
    'partials/home-highlight.pug',
    'partials/home-series.pug',
    'partials/home-about.pug',
]

// §S2.4, §S4.2 and §S11.5 (Umwege adds none).
export const SEAMS = [
    'partials/head-extra.pug',
    'partials/nav-main.pug',
    'partials/footer-extra.pug',
    'partials/scripts-extra.pug',
    'partials/post-media.pug',
    'partials/card-media.pug',
    'partials/post-tags.pug',
    'partials/post-pagination.pug',
    'partials/tag-overview.pug',
    'partials/tag-cloud.pug',
    'partials/feed-link.pug',
]

// thumb-media for all three, hero-media for Stack and Umwege (§S10).
export const WITHDRAWN_SEAMS = ['partials/thumb-media.pug', 'partials/hero-media.pug']

export const PAGE_TYPES = ['default', 'home', 'post', 'archive', 'tag']

export const BLOCKS = ['head', 'header', 'main', 'footer', 'scripts']

export const HELPERS = ['pageLang', 'sameLang', 'homeHref', 'formatDate', 'isoDate', 'hrefFor']

export const TOKENS = {
    color: ['bg', 'surface', 'text', 'muted', 'accent', 'accent_text', 'border', 'focus', 'sun', 'coral', 'sky'],
    font: ['body', 'heading', 'mono'],
    size: ['base', 'measure', 'width', 'radius', 'space'],
}

// §S13 defaults for Umwege, with its three added colour tokens.
export const TOKEN_DEFAULTS = {
    color: {
        bg: '#ffffff',
        surface: '#f6ead4',
        text: '#17231f',
        muted: '#56635e',
        accent: '#0d4b45',
        accent_text: '#fff3dc',
        border: '#dfe5e1',
        focus: '#b8370f',
        sun: '#ffcf3f',
        coral: '#f4603a',
        sky: '#cfe8f5',
    },
    size: { base: '1.0625rem', measure: '41rem', width: '73rem', radius: '1.625rem', space: '1.5rem' },
}

export const THEME_KEYS = ['label', 'tokens', 'extra_css', 'footer_links', 'blog', 'author']

export const T_KEYS = [
    // shared (§S2.6)
    'Skip to content',
    'Main navigation',
    'Language',
    'Legal',
    // theme-blog (§S4.3)
    'Recent posts',
    'All posts',
    'Published',
    'Updated',
    // §S11.6 (`Latest post` on the boarding pass, `Tags` over the stamps)
    'Latest post',
    'Tags',
    'Series',
    'Part',
    'About the author',
    'Read more',
    'posts',
]

export const SHELL_CLASSES = [
    'skip-link',
    'site-header',
    'site-header__inner',
    'site-header__brand',
    'site-header__nav',
    'lang-switch',
    'lang-switch__list',
    'lang-switch__item',
    'lang-switch__link',
    'site-main',
    'page__header',
    'page__title',
    'page__lead',
    'page__body',
    'site-footer',
    'site-footer__inner',
    'site-footer__legal',
    'site-footer__copy',
]

// §S4.6, as theme-blog.
export const BLOG_CLASSES = [
    'post',
    'post__header',
    'post__title',
    'post__meta',
    'post__date',
    'post__updated',
    'post__author',
    'post__lead',
    'post__media',
    'post__image',
    'post__body',
    'post__footer',
    'post__tags',
    'post__pagination',
    'post-list',
    'post-list__title',
    'post-list__items',
    'post-list__item',
    'post-list__more',
    'post-card',
    'post-card__media',
    'post-card__image',
    'post-card__title',
    'post-card__link',
    'post-card__date',
    'post-card__excerpt',
    'post-archive__year',
    'post-archive__list',
    'post-archive__item',
    'tag-page',
]

// §S12: the classes new in all three themes, and Umwege's own.
export const UMWEGE_CLASSES = [
    'home-hero',
    'home-hero__inner',
    'home-hero__title',
    'home-hero__lead',
    'home-hero__actions',
    'home-hero__aside',
    'button',
    'button--primary',
    'post-card--featured',
    'post-card__body',
    'post-card__meta',
    'post__series',
    'post-author',
    'post-author__mark',
    'post-author__name',
    'post-facts',
    'post-facts__item',
    'post-facts__label',
    'post-facts__value',
    'post-series',
    'post-series__title',
    'post-series__list',
    'post-series__item',
    'post-series__item--current',
    'home-series',
    'home-about',
    'home-about__mark',
    'home-about__links',
    'post-archive__count',
    // Umwege (§S12 "Per theme"; `home-pass__route` dropped: the redrawn
    // reference has no route on the pass, its keys were withdrawn)
    'post-card__location',
    'post-card__facts',
    'post__location',
    'home-highlight',
    'home-pass',
    'home-pass__facts',
]

// Withdrawn by the revision of 2026-11-23 (§S12): must not appear in views/
// or theme.css. Stack's covers and Ansitz's own classes are theirs alone;
// `home-pass__route` is dropped (no route on the redrawn pass).
export const WITHDRAWN_CLASSES = ['callout', 'duo', 'bw', 'post-nav', 'post-card__reading-time', 'post__reading-time', 'post-thumb__image', 'post-facts__note', 'post-route', 'post-card__cover', 'home-pass__route', 'home-statement', 'home-hero__image', 'post__image-note']

// Classes of §S4.6 / §S12 whose element Umwege does not render (§S12: a
// class is kept "wherever the element exists"): cards show no date and no
// meta line (the reference's cards have none), the hero has no button, and
// the featured series is not rendered (§S11.3).
export const NOT_RENDERED = ['post-card__date', 'post-card__meta', 'home-hero__actions', 'home-series']

export const PUBLIC_CLASSES = [...SHELL_CLASSES, ...BLOG_CLASSES, ...UMWEGE_CLASSES].filter((name) => !NOT_RENDERED.includes(name))

// The plugins Umwege styles, with the peer floors (§S11.1).
export const PLUGIN_CLASSES = {
    '@nera-static/plugin-tags': {
        range: '^3.4.1',
        classes: [
            'tag-cloud',
            'tag-cloud__item',
            'tag-links',
            'tag-links__item',
            'tag-overview',
            'tag-overview__header',
            'tag-overview__title',
            'tag-overview__image',
            'tag-overview__content',
            'tag-overview__item',
            'tag-overview__item-title',
            'tag-overview__item-date',
            'tag-overview__item-description',
            'tag-overview__item-link',
        ],
    },
    '@nera-static/plugin-page-pagination': {
        range: '^2.4.0',
        classes: [
            'page-pagination',
            'page-pagination__link',
            'page-pagination__link--previous',
            'page-pagination__link--next',
        ],
    },
    '@nera-static/plugin-images': {
        range: '^1.0.3',
        classes: ['nera-image', 'nera-image__caption'],
    },
    '@nera-static/plugin-navigation': {
        range: '^3.1.0',
        classes: ['nav', 'nav--list', 'nav__item', 'nav__link', 'nav__link--active', 'nav__link--active-path'],
    },
    '@nera-static/plugin-social-media-links': {
        range: '^2.3.0',
        classes: [
            'social-media-links',
            'social-media-links__list',
            'social-media-links__item',
            'social-media-links__link',
            'social-media-links__icon',
            'social-media-links__label',
        ],
    },
}

// The other themes' heading fonts, for "Distinct" (§S15).
export const OTHER_HEADING_FONTS = {
    blog: 'system-ui, -apple-system, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif',
    stack: 'Bricolage Grotesque',
    ansitz: 'Instrument Serif',
}
