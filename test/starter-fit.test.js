// §S15 "Starter fit" (Umwege): filled in with the home, post, archive, tag
// page and default page (ROADMAP-themes §S16 build order, steps 3 to 5).
import { describe, expect, inject, it } from 'vitest'
import { pages } from './helpers/html.js'

const builds = inject('builds')

describe('Starter fit', () => {
    it('builds every page of the fixture', () => {
        expect(pages(builds.default.public).length).toBeGreaterThan(37)
    })
})
