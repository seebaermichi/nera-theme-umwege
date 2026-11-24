// §S15 "Distinct" (replacing §S7's): the three blog themes'
// `tokens.font.heading` defaults differ from each other and from theme-blog's.
import path from 'path'
import { describe, expect, it } from 'vitest'
import { ROOT, loadYaml } from './helpers/site.js'
import { OTHER_HEADING_FONTS } from './helpers/contract.js'

const heading = loadYaml(path.join(ROOT, 'config', 'theme.yaml')).tokens.font.heading
const first = (stack) => stack.split(',')[0].trim().replace(/^'|'$/g, '')

describe('Distinct', () => {
    it('names Fraunces first', () => {
        expect(first(heading)).toBe('Fraunces')
    })

    it('differs from theme-blog\'s heading font and from Stack\'s and Ansitz\'s families', () => {
        expect(heading).not.toBe(OTHER_HEADING_FONTS.blog)
        expect(first(heading)).not.toBe(first(OTHER_HEADING_FONTS.blog))
        expect(first(heading)).not.toBe(OTHER_HEADING_FONTS.stack)
        expect(first(heading)).not.toBe(OTHER_HEADING_FONTS.ansitz)
    })
})
