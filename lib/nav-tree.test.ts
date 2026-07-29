import assert from 'node:assert/strict'
import { test } from 'node:test'

import { buildTree } from './nav-tree'

const row = (over: Record<string, unknown>) => ({
  key: 'k',
  href: '/',
  is_active: true,
  parent_id: null,
  created_at: null,
  updated_at: null,
  ...over,
})

test('nests children under their parent', () => {
  const tree = buildTree([
    row({ id: 'p', order_index: 0 }),
    row({ id: 'c', parent_id: 'p', order_index: 0 }),
  ])
  assert.equal(tree.length, 1)
  assert.equal(tree[0].id, 'p')
  assert.deepEqual(
    tree[0].children!.map((c) => c.id),
    ['c']
  )
})

test('sorts roots and children by order_index', () => {
  const tree = buildTree([
    row({ id: 'r2', order_index: 2 }),
    row({ id: 'r1', order_index: 1 }),
    row({ id: 'c2', parent_id: 'r1', order_index: 2 }),
    row({ id: 'c1', parent_id: 'r1', order_index: 1 }),
  ])
  assert.deepEqual(
    tree.map((r) => r.id),
    ['r1', 'r2']
  )
  assert.deepEqual(
    tree[0].children!.map((c) => c.id),
    ['c1', 'c2']
  )
})

test('drops orphan children whose parent is absent', () => {
  const tree = buildTree([
    row({ id: 'p', order_index: 0 }),
    row({ id: 'orphan', parent_id: 'missing', order_index: 0 }),
  ])
  assert.equal(tree.length, 1)
  assert.equal(tree[0].id, 'p')
})

test('empty input yields empty tree', () => {
  assert.deepEqual(buildTree([]), [])
})
