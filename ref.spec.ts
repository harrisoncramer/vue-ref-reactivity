import { ref, effect } from './ref'

test('ref', () => {
  const fooref = ref('foo')
  let foo

  effect(function effect_callback() {
    /* This is triggered after every reassignment of fooref.value */
    foo = fooref.value
  })

  expect(foo).toBe('foo')

  fooref.value = 'bar'

  expect(foo).toBe('bar')
})
