import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCompareStore } from '@/stores/compareStore'

describe('compareStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('starts empty', () => {
    const s = useCompareStore()
    expect(s.count).toBe(0)
    expect(s.isFull).toBe(false)
  })

  it('toggles a slug in and out', () => {
    const s = useCompareStore()
    s.toggle('sweet-spot')
    expect(s.has('sweet-spot')).toBe(true)
    s.toggle('sweet-spot')
    expect(s.has('sweet-spot')).toBe(false)
  })

  it('caps the list at the configured maximum', () => {
    const s = useCompareStore()
    s.toggle('a')
    s.toggle('b')
    s.toggle('c')
    expect(s.isFull).toBe(true)
    s.toggle('d')
    expect(s.has('d')).toBe(false)
    expect(s.count).toBe(3)
  })

  it('removes a single item', () => {
    const s = useCompareStore()
    s.toggle('a')
    s.toggle('b')
    s.remove('a')
    expect(s.has('a')).toBe(false)
    expect(s.has('b')).toBe(true)
  })

  it('clears all items', () => {
    const s = useCompareStore()
    s.toggle('a')
    s.toggle('b')
    s.clear()
    expect(s.count).toBe(0)
  })

  it('persists to localStorage', () => {
    const s = useCompareStore()
    s.toggle('sweet-spot')
    expect(JSON.parse(localStorage.getItem('compare_list_v1'))).toEqual(['sweet-spot'])
  })
})
