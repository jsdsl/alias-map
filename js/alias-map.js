"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AliasMap {
    constructor() {
        this.aliasResolutionMap = new Map();
        this.internalMap = new Map();
        this.internalKeyCounter = 0;
    }
    get(key) {
        let internalValue = this.internalMap.get(this.aliasResolutionMap.get(key));
        if (internalValue === undefined)
            return undefined;
        else
            return internalValue.value;
    }
    set(key, value, force = false) {
        if (this.has(key)) {
            if (force)
                this.removeAlias(key);
            else
                return (this.get(key) === value);
        }
        let internalKey = this.internalKeyCounter++;
        this.aliasResolutionMap.set(key, internalKey);
        this.internalMap.set(internalKey, {
            value,
            aliases: [key]
        });
        return true;
    }
    addAliases(existingKey, newKey, force = false) {
        if (this.has(existingKey)) {
            if (this.has(newKey))
                return (this.get(newKey) === this.get(existingKey));
            else {
                let internalKey = this.aliasResolutionMap.get(existingKey);
                this.aliasResolutionMap.set(newKey, internalKey);
                this.internalMap.get(internalKey).aliases.push(newKey);
                return true;
            }
        }
        else
            return false;
    }
    has(key) {
        return this.aliasResolutionMap.has(key);
    }
    modify(key, value) {
        if (this.has(key)) {
            let internalKey = this.aliasResolutionMap.get(key);
            let internalValue = this.internalMap.get(internalKey);
            let displaced = internalValue.value;
            internalValue.value = value;
            return displaced;
        }
        else
            return undefined;
    }
    removeAlias(key) {
        if (this.has(key)) {
            let internalKey = this.aliasResolutionMap.get(key);
            this.aliasResolutionMap.delete(key);
            let internalValue = this.internalMap.get(internalKey);
            let aliases = internalValue.aliases;
            if ((aliases.length < 0) || ((aliases.length === 0) && (aliases[0] === key))) {
                this.internalMap.delete(internalKey);
            }
            return internalValue.value;
        }
        else
            return undefined;
    }
    removeValue(key) {
        if (this.has(key)) {
            let internalKey = this.aliasResolutionMap.get(key);
            let internalValue = this.internalMap.get(internalKey);
            let aliases = internalValue.aliases;
            for (let alias of aliases)
                this.aliasResolutionMap.delete(alias);
            this.internalMap.delete(internalKey);
            return internalValue.value;
        }
        else
            return undefined;
    }
    listAliases(alias, includeProvidedAlias = true) {
        if (this.has(alias)) {
            let internalKey = this.aliasResolutionMap.get(alias);
            let aliases = this.internalMap.get(internalKey).aliases;
            if (!includeProvidedAlias) {
                for (let index = 0; index < aliases.length; index++) {
                    if (aliases[index] === alias)
                        aliases.splice(index--, 1);
                }
            }
            return aliases;
        }
        else
            return undefined;
    }
    numberOfAliasesFor(alias, includeProvidedAlias = true) {
        if (this.has(alias)) {
            let numberOfAliases = this.listAliases(alias).length;
            if (!includeProvidedAlias)
                numberOfAliases--;
            return numberOfAliases;
        }
        else
            return 0;
    }
    size() {
        return this.internalMap.size;
    }
    clear() {
        this.aliasResolutionMap.clear();
        this.internalMap.clear();
        this.internalKeyCounter = 0;
    }
}
exports.AliasMap = AliasMap;
//# sourceMappingURL=alias-map.js.map