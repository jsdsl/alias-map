export declare class AliasMap<A = any, V = any> {
    private aliasResolutionMap;
    private internalMap;
    private internalKeyCounter;
    constructor();
    get(key: A): V | undefined;
    set(key: A, value: V, force?: boolean): boolean;
    addAliases(existingKey: A, newKey: A, force?: boolean): boolean;
    has(key: A): boolean;
    modify(key: A, value: V): V | undefined;
    removeAlias(key: A): V | undefined;
    removeValue(key: A): V | undefined;
    listAliases(alias: A, includeProvidedAlias?: boolean): A[] | undefined;
    numberOfAliasesFor(alias: A, includeProvidedAlias?: boolean): number;
    size(): number;
    clear(): void;
}
