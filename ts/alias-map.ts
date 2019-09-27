/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	4:25 PM -- September 18th, 2019.
 *	Project: alias-map
 */

/**
 * A type that allows a simple grouping of information - the 'actual' value stored for a given alias set as well as a
 * group of aliases that point to the given value.
 */
type InternalValue<A, V> = {
	
	value: V;
	aliases: A[];
	
}

/**
 * A map where multiple keys point to a single value, with options to remove either single keys (aliases) or all
 * associated values (all aliases for a given value).
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 */
export class AliasMap<A = any, V = any> {
	
	/**
	 * A map associating aliases with 'internal keys'.
	 *
	 * 'Internal keys' are simply numeric values that allow a disconnect between 'alias sets' and their associated
	 * values.
	 */
	private aliasResolutionMap: Map<A, number>;
	
	/**
	 * A map associating 'internal keys' with 'internal values'.
	 *
	 * @see InternalValue
	 */
	private internalMap: Map<number, InternalValue<A, V>>;
	
	/**
	 * A counter used for generating 'internal keys' as to ensure no duplicates are created.
	 */
	private internalKeyCounter: number;
	
	/**
	 * Initializes a new empty AliasMap.
	 */
	public constructor() {
		
		this.aliasResolutionMap = new Map<A, number>();
		this.internalMap = new Map<number, InternalValue<A, V>>();
		this.internalKeyCounter = 0;
		
	}
	
	/**
	 * Returns the value associated with a given alias, or undefined if the alias does not exist in the map.
	 *
	 * @param key An alias for which a value should be retrieved.
	 * @return The value associated with the provided alias, or undefined if the alias does not exist in the map.
	 */
	public get(key: A): V | undefined {
		
		let internalValue: InternalValue<A, V> | undefined =
			this.internalMap.get(this.aliasResolutionMap.get(key) as number);
		
		if (internalValue === undefined) return undefined;
		else return internalValue.value;
		
	}
	
	/**
	 * Associates the provided alias with the provided value, returning true if and only if, after this operation,
	 * calling {@link AliasMap#get} with the provided alias will return the value provided.
	 *
	 * Note that this method returning 'true' does not necessarily mean that the internal state of the map was modified,
	 * as it is possible that the provided key-value pair already to have existed. As such, the return condition of this
	 * method was satisfied and the method therefore returned true.
	 *
	 * @param key An alias to associate with the provided value.
	 * @param value A value to associate with the provided alias.
	 * @param force true if the key-value pair should be forcibly set, potentially requiring the removal of the provided
	 * alias as an alias for another value, and therefore potentially causing the removal of a value. Defaults to false.
	 * @return true if and only if, after this operation, calling {@link AliasMap#get} with the provided alias will
	 * return the value provided.
	 */
	public set(key: A, value: V, force: boolean = false): boolean {
		
		if (this.has(key)) {
			
			if (force) this.removeAlias(key);
			else return (this.get(key) === value);
			
		}
		
		let internalKey: number = this.internalKeyCounter++;
		
		this.aliasResolutionMap.set(key, internalKey);
		this.internalMap.set(internalKey, {
			
			value,
			aliases: [ key ]
			
		});
		
		return true;
		
	}
	
	/**
	 * Adds an alias to an existing value via an existing alias, returning true if and only if, after this operation,
	 * calling {@link AliasMap#get} with the provided alias will return the value provided.
	 *
	 * @param existingKey An existing alias in this map.
	 * @param newKey A new alias that should be associated with the value of the existing alias.
	 * @param force true if the alias should be forcibly set, potentially requiring the removal of the provided new
	 * alias as an alias for another value, and therefore potentially causing the removal of a value. Defaults to false.
	 * @return true if and only if, after this operation, calling {@link AliasMap#get} with the provided alias will
	 * return the value provided.
	 */
	public addAliases(existingKey: A, newKey: A, force: boolean = false): boolean {
		
		if (this.has(existingKey)) {
			
			if (this.has(newKey)) return (this.get(newKey) === this.get(existingKey));
			else {
				
				let internalKey: number = this.aliasResolutionMap.get(existingKey) as number;
				
				this.aliasResolutionMap.set(newKey, internalKey);
				(this.internalMap.get(internalKey) as InternalValue<A, V>).aliases.push(newKey);
				
				return true;
				
			}
			
		} else return false;
		
	}
	
	/**
	 * Returns true if the provided alias has an associated value in this map.
	 *
	 * @param key An alias to check for an associated value.
	 * @return true if the provided alias has an associated value in this map.
	 */
	public has(key: A): boolean {
		
		return this.aliasResolutionMap.has(key);
		
	}
	
	/**
	 * Modifies the value of a given alias and all of it's associated aliases, returning the value that was displaced or
	 * undefined if the provided alias did not exist in the map.
	 *
	 * @param key An alias for which it's associated value should be modified.
	 * @param value The value that should replaced the existing value of the provided alias.
	 * @return The value that was displaced or undefined if the provided alias did not exist in the map.
	 */
	public modify(key: A, value: V): V | undefined {
		
		if (this.has(key)) {
		
			let internalKey: number = this.aliasResolutionMap.get(key) as number;
			let internalValue: InternalValue<A, V> = this.internalMap.get(internalKey) as InternalValue<A, V>;
			let displaced: V = internalValue.value;
			
			internalValue.value = value;
			
			return displaced;
		
		} else return undefined;
		
	}
	
	/**
	 * Attempts to remove an alias from this map, returning the value associated with the removed alias if one existed,
	 * otherwise returning undefined.
	 *
	 * Note that the removal of the last existing alias for a given value implies the removal of the value from the map.
	 *
	 * @param key The alias that should be removed from the map.
	 * @return The value associated with the removed alias if one existed, otherwise undefined.
	 */
	public removeAlias(key: A): V | undefined {
	
		if (this.has(key)) {
			
			let internalKey: number = this.aliasResolutionMap.get(key) as number;
			
			this.aliasResolutionMap.delete(key);
			
			let internalValue: InternalValue<A, V> = this.internalMap.get(internalKey) as InternalValue<A, V>;
			let aliases: A[] = internalValue.aliases;
			
			if ((aliases.length < 0) || ((aliases.length === 0) && (aliases[0] === key))) {
				
				this.internalMap.delete(internalKey);
				
			}
			
			return internalValue.value;
			
		} else return undefined;
	
	}
	
	/**
	 * Attempts to remove the value that is associated with the provided alias from the map, returning the
	 * aforementioned value if the provided alias existed within the map, otherwise returning undefined.
	 *
	 * Note that this implies the removal of all of the aliases for the removed value.
	 *
	 * @param key The alias for which its associated value should be removed from the map.
	 * @return The value that was removed from the map if one existed, otherwise undefined.
	 */
	public removeValue(key: A): V | undefined {
		
		if (this.has(key)) {
			
			let internalKey: number = this.aliasResolutionMap.get(key) as number;
			let internalValue: InternalValue<A, V> = this.internalMap.get(internalKey) as InternalValue<A, V>;
			let aliases: A[] = internalValue.aliases;
			
			for (let alias of aliases) this.aliasResolutionMap.delete(alias);
			
			this.internalMap.delete(internalKey);
			
			return internalValue.value;
			
		} else return undefined;
	
	}
	
	/**
	 * Returns an array of aliases associated with the provided input alias, or undefined if the input array does not
	 * exist within the map.
	 *
	 * A second parameter, a boolean, can be set, determining whether or not the input alias should be included in the
	 * returned array of aliases. If a truthy value is provided, the input alias will be included, otherwise the input
	 * alias will be removed from the returned array. Note that if a truthy value is provided, this method is operates
	 * in O(1) time, whereas if a falsy value is provided, this method runs in O(k) time where k is the number of
	 * aliases associated with the input alias.
	 *
	 * @param alias The alias for which to return associated aliases.
	 * @param includeProvidedAlias true if the input alias should be included in the returned array of aliases. Defaults
	 * to true.
	 * @return An array of aliases that are associated/equivalent to the provided input alias.
	 */
	public listAliases(alias: A, includeProvidedAlias: boolean = true): A[] | undefined {
		
		if (this.has(alias)) {
			
			let internalKey: number = this.aliasResolutionMap.get(alias) as number;
			let aliases: A[] = (this.internalMap.get(internalKey) as InternalValue<A, V>).aliases;
			
			if (!includeProvidedAlias) {
				
				for (let index: number = 0; index < aliases.length; index++) {
					
					if (aliases[index] === alias) aliases.splice(index--, 1);
					
				}
				
			}
			
			return aliases;
			
		} else return undefined;
		
	}
	
	/**
	 * Returns the number of aliases that exist in the map for the input alias, or zero if the alias does not exist
	 * within the map.
	 *
	 * A second parameter, a boolean, can be set, determining whether or not the input alias should be counted in the
	 * returned value. Although this method internally uses {@link AliasMap#listAliases}, and despite the O(k) nature
	 * of the aforementioned method, this second parameter will not change the running speed of this method, which will
	 * always be O(1).
	 *
	 * @param alias The alias for which to return a count of equivalent aliases.
	 * @param includeProvidedAlias true if the input alias should be counted in the returned value.
	 * @return The number of aliases that exist in the map for the input alias, or zero if the alias does not exist
	 * within the map.
	 */
	public numberOfAliasesFor(alias: A, includeProvidedAlias: boolean = true): number {
		
		if (this.has(alias)) {
			
			let numberOfAliases: number = (this.listAliases(alias) as A[]).length;
			
			if (!includeProvidedAlias) numberOfAliases--;
			
			return numberOfAliases;
			
		} else return 0;
		
	}
	
	/**
	 * Returns the number of values stored in this map.
	 *
	 * Note that the value that this method returns is in no way associated with the number of aliases that exist for
	 * any given value within the map.
	 *
	 * @return The number of values stored in this map.
	 */
	public size(): number {
		
		return this.internalMap.size;
		
	}
	
	/**
	 * Resets this map to an empty state, removing all of its stored key-value pairs.
	 *
	 * @return Returns void.
	 */
	public clear(): void {
	
		this.aliasResolutionMap.clear();
		this.internalMap.clear();
		this.internalKeyCounter = 0;
	
	}
	
}