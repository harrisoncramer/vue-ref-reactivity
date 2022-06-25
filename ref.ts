type Dep = Set<any>
type KeyToDepMap = Map<any, Dep>

/* This helps us associate a ref with it's effects.
  * We use the ref (an object) as the key itself. */
const targetMap = new Map<any, KeyToDepMap>()
let activeEffect: any

/* Track will take the ref and make sure we're tracking it.
  Then, it gets it's associated effects map, 
  and gets the Set of effects (or creates it). It then adds the
  effect for the value we just accessed to the set, */
const track = (target: object) => {
  if(!activeEffect) return
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get('value')
  if(!dep) {
    dep = new Set()
    depsMap.set('value', dep)
  }

  dep.add(activeEffect);
}

/* Trigger is called when we set the value. It'll 
* Get the effect callback associated with the ref it's passed
* and call it. This will reassign the reactive values.
*/
const trigger = (target: object)  => {
   let depsMap = targetMap.get(target)
   if (!depsMap) {
     return
   }

   depsMap.forEach((dep) => {
     dep.forEach(eff => {
       eff()
     })
   })
}

export const ref = (val: string) => {
  return new RefImpl(val)
}

class RefImpl {
  private _value: string;
  constructor (value: string) {
    this._value = value;
  }

  /* Whenever we get the value, pass this to the track function.
    * This occurs inside of the effect callback. */
  get value () {
    track(this)
    return this._value
  }

  /* Whenever we set this value, we want to pass this 
  * object to the trigger function, which will look up its 
  * effects and fire them */
  set value (val: string) {
    this._value = val;
    trigger(this)
  }
}

/* This will assign our callback function, which updates our reactive value,
* to the activeEffect. The callback function itself then triggers the "get"
* above. Which tracks the effect and adds it to our map. Then we call it. */
export const effect = (cb: Function) => {
  activeEffect = cb
  cb()
  activeEffect = undefined
}
