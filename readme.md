# JSDSL - Alias Map
A map where multiple keys point to a single value, and the removal of a single key removes all matching key-value pairs.

### [Find @jsdsl/alias-map on NPM.](https://www.npmjs.com/package/@jsdsl/alias-map)

## Table of Contents

 - [Installation](#installation)
 - [Basic Usage](#basic-usage)
 - [Documentation](#documentation)
   - [constructor](#constructor)
   - [#get](#get)
   - [#set](#set)
   - [#addAliases](#addaliases)
   - [#has](#has)
   - [#modify](#modify)
   - [#removeAlias](#removealias)
   - [#removeValue](#removevalue)
   - [#listAliases](#listaliases)
   - [#numberOfAliasesFor](#numberofaliasesfor)
   - [#size](#size)
   - [#clear](#clear)
 - [License](#license) 

## Installation
Install from NPM with
```
$ npm install --save @jsdsl/alias-map
```

## Basic Usage
First, import the AliasMap class and initialize a new AliasMap.

```typescript
import { AliasMap } from "@jsdsl/aliasmap";

let aliasMap: AliasMap<string, string> = new AliasMap<string, string>();
```

Then, we can set key-value pairs. It is important to note that the inline documentation often refers to 'keys' as 'aliases'.

```typescript
aliasMap.set("cow", "moo");
aliasMap.set("pig", "oink");
```

Now that we have existing key-value pairs in our map, we can optionally add aliases to the existing keys.

```typescript
aliasMap.addAliases("cow", "bovine");
aliasMap.addAliases("pig", "hog");
```

Alias addition also works transitively - aliases can be added via other aliases. That is to say that you can now do the following:

```typescript
aliasMap.addAliases("hog", "piglet");
```

Now we can retrieve the values we have added via any of the aliases that have been established for a given value.

```typescript
aliasMap.get("cow");    // --> moo
aliasMap.get("bovine"); // --> moo
aliasMap.get("pig");    // --> oink
aliasMap.get("hog");    // --> oink
aliasMap.get("piglet"); // --> oink
```

Want to check if a given alias exists in the map?

```typescript
aliasMap.has("bovine"); // --> true
aliasMap.has("lamb");   // --> false
aliasMap.has("pig");    // --> true
```

If you need to modify the value that a set of aliases point to, you don't need to modify every alias for the value. Instead, you can modify the value more cleanly.

```typescript
aliasMap.modify("cow", "mooooo");
```

Finding all of the related aliases for a given input is also easy. A second boolean parameter can be provided to determine whether or not the output array contains the input alias. 

```typescript
aliasMap.listAliases("cow");        // --> ["cow", "bovine"]
aliasMap.listAliases("hog", true);  // --> ["hog", "pig", "piglet"]
aliasMap.listAliases("hog", false); // --> ["pig", "piglet"]
```

On a related note we can also find the number of related aliases for a given input alias.

```typescript
aliasMap.numberOfAliasesFor("cow");    // --> 2
aliasMap.numberOfAliasesFor("piglet"); // --> 3
```

Finding the size of the map is fairly straight-forward, returning the number of values that a given map holds (NOT the number of aliases).

```typescript
aliasMap.size("cow"); // --> 2
```

We can choose to either remove singular aliases or entire values (which implies the removal of all of the aliases for the given value).

```typescript
aliasMap.removeAlias("cow"); // --> moo
aliasMap.removeValue("hog"); // --> oink

/* The map now has the current state:
 *
 * "bovine"               --> "moo"
 *
 * The "oink" value no longer exists in the map.
 */
```

If we continue to remove all of the aliases for a given value, the value will be automatically removed from the map as well.

```typescript
aliasMap.removeAlias("bovine");               // --> moo

// The "moo" value no longer exists in the map.
```

If we ever want to completely 'empty' the map, we can use the `#clear` operation.

```typescript
aliasMap.clear();
// Map is now empty.
```

## Documentation

#### `constructor`

Initialization is done with an no-arguments call to the constructor.

The first generic argument corresponds to the type of the keys/aliases for the map, while the second generic argument corresponds with the type of the values for the map.

**Parameters**:
 - _None_.

**Returns** A newly initialized, empty AliasMap.

```typescript
let aliasMap: AliasMap<AliasType, ValueType> = new AliasMap<AliasType, ValueType>();
```

---

#### `#get`

Returns the value associated with a given alias, or undefined if the alias does not exist in the map.

**Parameters**:
 - **key** An alias for which a value should be retrieved.

**Returns** The value associated with the provided alias, or undefined if the alias does not exist in the map.

```typescript
public get(key: A): V | undefined { ... }
```

---

#### `#set`

Associates the provided alias with the provided value, returning true if and only if, after this operation, calling `AliasMap#get` with the provided alias will return the value provided.

Note that this method returning 'true' does not necessarily mean that the internal state of the map was modified, as it is possible that the provided key-value pair already to have existed. As such, the return condition of this method was satisfied and the method therefore returned true.

**Parameters**:
 - **key** An alias to associate with the provided value.
 - **value** A value to associate with the provided alias.
 - **force** true if the key-value pair should be forcibly set, potentially requiring the removal of the provided alias as an alias for another value, and therefore potentially causing the removal of a value. Optional - Defaults to false.

**Returns** true if and only if, after this operation, calling `AliasMap#get` with the provided alias will return the value provided.

```typescript
public set(key: A, value: V, force: boolean = false): boolean { ... }
```

---

#### `#addAliases`

Adds an alias to an existing value via an existing alias, returning true if and only if, after this operation, calling `AliasMap#get` with the provided alias will return the value provided.

**Parameters**:
 - **existingKey** An existing alias in this map.
 - **newKey** A new alias that should be associated with the value of the existing alias.
 - **force** true if the alias should be forcibly set, potentially requiring the removal of the provided new alias as an alias for another value, and therefore potentially causing the removal of a value. Optional - Defaults to false.

**Returns** true if and only if, after this operation, calling `AliasMap#get` with the provided alias will return the value provided.

```typescript
public addAliases(existingKey: A, newKey: A, force: boolean = false): boolean { ... }
```

---

#### `#has`

Returns true if the provided alias has an associated value in this map.

**Parameters**:
 - **key** An alias to check for an associated value.

**Returns** true if the provided alias has an associated value in this map.

```typescript
public has(key: A): boolean { ... }
```

---

#### `#modify`

Modifies the value of a given alias and all of it's associated aliases, returning the value that was displaced or undefined if the provided alias did not exist in the map.

**Parameters**:
 - **key** An alias for which it's associated value should be modified.
 - **value** The value that should replaced the existing value of the provided alias.

**Returns** The value that was displaced or undefined if the provided alias did not exist in the map.

```typescript
public modify(key: A, value: V): V | undefined { ... }
``` 

---

#### `#removeAlias`

Attempts to remove an alias from this map, returning the value associated with the removed alias if one existed, otherwise returning undefined.

Note that the removal of the last existing alias for a given value implies the removal of the value from the map.

**Parameters**:
 - **key** The alias that should be removed from the map.

**Returns** The value associated with the removed alias if one existed, otherwise undefined.

```typescript
public removeAlias(key: A): V | undefined { ... }
```

---

#### `#removeValue`

Attempts to remove the value that is associated with the provided alias from the map, returning the aforementioned value if the provided alias existed within the map, otherwise returning undefined.

Note that this implies the removal of all of the aliases for the removed value.

**Parameters**:
 - **key** The alias for which its associated value should be removed from the map.

**Returns** The value that was removed from the map if one existed, otherwise undefined.

```typescript
public removeValue(key: A): V | undefined { ... }
```

---

#### `#listAliases`

Returns an array of aliases associated with the provided input alias, or undefined if the input array does not exist within the map.

A second parameter, a boolean, can be set, determining whether or not the input alias should be included in the returned array of aliases. If a truthy value is provided, the input alias will be included, otherwise the input alias will be removed from the returned array. Note that if a truthy value is provided, this method is operates in O(1) time, whereas if a falsy value is provided, this method runs in O(k) time where k is the number of aliases associated with the input alias.

**Parameters**:
 - **alias** The alias for which to return associated aliases.
 - **includeProvidedAlias** true if the input alias should be included in the returned array of aliases. Optional - Defaults to true.

**Returns** An array of aliases that are associated/equivalent to the provided input alias.

```typescript
public listAliases(alias: A, includeProvidedAlias: boolean = true): A[] | undefined { ... }
```

---

#### `#numberOfAliasesFor`

Returns the number of aliases that exist in the map for the input alias, or zero if the alias does not exist within the map.
 
A second parameter, a boolean, can be set, determining whether or not the input alias should be counted in the returned value. Although this method internally uses `AliasMap#listAliases`, and despite the O(k) nature of the aforementioned method, this second parameter will not change the running speed of this method, which will always be O(1).

**Parameters**:
 - **alias** The alias for which to return a count of equivalent aliases.
 - **includeProvidedAlias** true if the input alias should be counted in the returned value. Optional - Defaults to true.
 
**Returns** The number of aliases that exist in the map for the input alias, or zero if the alias does not exist within the map.

```typescript
public numberOfAliasesFor(alias: A, includeProvidedAlias: boolean = true): number { ... }
```

---

#### `#size`

Returns the number of values stored in this map.

Note that the value that this method returns is in no way associated with the number of aliases that exist for any given value within the map.

**Parameters**:
 - _None_

**Returns** The number of values stored in this map.

```typescript
public size(): number { ... }
```

---

#### `#clear`

Resets this map to an empty state, removing all of its stored key-value pairs.

**Parameters**:
 - _None_
 
**Returns** Void.

```typescript
public clear(): void { ... }
```

## License
@jsdsl/alias-map is made available under the GNU General Public License v3.

Copyright (C) 2019 Trevor Sears