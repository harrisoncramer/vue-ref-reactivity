import { ref, effect } from './ref'

describe('Should work with a single ref', () => {
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
})

describe('Should work with multiple refs', () => {
  test('refs', () => {
    const refone = ref('one')
    const reftwo = ref('two')

    let one, two;
    effect(function effect_callback() {
      one = refone.value
      two = reftwo.value
    })

    expect(one).toBe('one')
    expect(two).toBe('two')

    refone.value = 'two'
    reftwo.value = 'three'

    expect(one).toBe('two')
    expect(two).toBe('three')

  })
})
