/*
 *	Created by Trevor Sears <trevorsears.main@gmail.com>.
 *	12:28 PM -- September 24th, 2019.
 *	Project: JSDSL - Alias Map
 */

import { AliasMap } from "../alias-map";

/**
 * Test cases for {@link AliasMap}.
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 */
describe("Initialization", () => {

	test("Basic initialization.", () => {
		
		let aliasMap: AliasMap<string, string> = new AliasMap<string, string>();
		
		expect(aliasMap).toBeDefined();
		
	});

});

describe("Per-method tests.", () => {
	
	let aliasMap: AliasMap<string, string>;
	
	function populate(): void {
		
		aliasMap.set("alias-1-0", "alias1value");
		aliasMap.set("alias-2-0", "alias2value");
		aliasMap.set("alias-3-0", "alias3value");
		
		aliasMap.addAliases("alias-1-0", "alias-1-1");
		aliasMap.addAliases("alias-1-0", "alias-1-2");
		aliasMap.addAliases("alias-1-0", "alias-1-3");
		
		aliasMap.addAliases("alias-2-0", "alias-2-1");
		aliasMap.addAliases("alias-2-0", "alias-2-2");
		aliasMap.addAliases("alias-2-0", "alias-2-3");
		
		aliasMap.addAliases("alias-3-0", "alias-3-1");
		aliasMap.addAliases("alias-3-0", "alias-3-2");
		aliasMap.addAliases("alias-3-0", "alias-3-3");
		
	}
	
	beforeEach(() => {
		
		aliasMap = new AliasMap<string, string>();
		populate();
		
	});
	
	describe("#get", () => {
		
		test("Attempt to retrieve a value via a 'primary alias' succeeds.", () => {
			
			expect(aliasMap.get("alias-1-0")).toBe("alias1value");
			expect(aliasMap.get("alias-2-0")).toBe("alias2value");
			expect(aliasMap.get("alias-3-0")).toBe("alias3value");
			
		});
		
		describe("Attempt to retrieve a value via it's 'secondary aliases' succeeds.", () => {
			
			test.each([
				[1, "alias1value", ["alias-1-1", "alias-1-2", "alias-1-3"]],
				[2, "alias2value", ["alias-2-1", "alias-2-2", "alias-2-3"]],
				[3, "alias3value", ["alias-3-1", "alias-3-2", "alias-3-3"]]
			])("Alias set #%i.", (index: any, expectedValue: any, aliases: any) => {
				
				for (let alias of aliases) expect(aliasMap.get(alias)).toBe(expectedValue);
				
			});
			
		});
		
		test("Attempt to retrieve a non-existent value returns undefined.", () => {
		
			expect(aliasMap.get("alias-4-0")).toBeUndefined();
			expect(aliasMap.get("alias-4-1")).toBeUndefined();
			expect(aliasMap.get("alias-4-2")).toBeUndefined();
			expect(aliasMap.get("alias-4-3")).toBeUndefined();
			
		});
		
	});
	
	describe("#set", () => {
		
		// TODO [9/25/19 @ 5:33 PM] - Test 'force' parameter.
	
		test("TODO", () => {
			
			// TODO [9/30/19 @ 3:38 PM] Finish test body.
			fail("Test not yet written...");
			
		});
	
	});
	
	describe("#addAliases", () => {
	
		test("TODO", () => {
			
			// TODO [9/30/19 @ 3:38 PM] Finish test body.
			fail("Test not yet written...");
			
		});
	
	});
	
	describe("#has", () => {
	
		test("Returns true when called for aliases that have been added via #set.", () => {
			
			expect(aliasMap.has("alias-1-0")).toBeTruthy();
			expect(aliasMap.has("alias-2-0")).toBeTruthy();
			expect(aliasMap.has("alias-3-0")).toBeTruthy();
			
		});
		
		test("Returns true when called for aliases that have been added via #addAlias.", () => {
			
			for (let outerIndex: number = 1; outerIndex < 4; outerIndex++) {
				
				for (let innerIndex: number = 1; innerIndex < 4; innerIndex++) {
					
					expect(aliasMap.has("alias-" + outerIndex + "-" + innerIndex)).toBeTruthy();
					
				}
				
			}
		
		});
		
		test("Returns false when called for values not present in the map.", () => {
			
			expect(aliasMap.has("alias-4-0")).toBeFalsy();
			
		});
		
		test("Returns false for aliases that have been removed via #removeAlias.", () => {
			
			// TODO [9/30/19 @ 3:38 PM] Finish test body.
			fail("Test not yet written...");
			
		});
		
		test("Returns false for aliases that have been removed via #removeValue.", () => {
			
			// TODO [9/30/19 @ 3:38 PM] Finish test body.
			fail("Test not yet written...");
			
		});
	
	});
	
	describe("#modify", () => {
		
		test("TODO", () => {
			
			// TODO [9/30/19 @ 3:38 PM] Finish test body.
			fail("Test not yet written...");
			
		});
		
	});
	
	describe("#removeAlias", () => {
		
		test("TODO", () => {
			
			// TODO [9/30/19 @ 3:38 PM] Finish test body.
			fail("Test not yet written...");
			
		});
		
	});
	
	describe("#removeValue", () => {
		
		test("TODO", () => {
			
			// TODO [9/30/19 @ 3:38 PM] Finish test body.
			fail("Test not yet written...");
			
		});
		
	});
	
	describe("#listAliases", () => {
		
		describe("Correct aliases are returned for a 'primary alias'.", () => {
			
			describe.each([
				[1, "alias-1-0", ["alias-1-0", "alias-1-1", "alias-1-2", "alias-1-3"]],
				[2, "alias-2-0", ["alias-2-0", "alias-2-1", "alias-2-2", "alias-2-3"]],
				[3, "alias-3-0", ["alias-3-0", "alias-3-1", "alias-3-2", "alias-3-3"]]
			])("Alias set #%i.", (index: any, searchAlias: any, aliases: any) => {
			
				let resultSet: string[] | undefined;
				
				beforeAll(() => {
					
					resultSet = aliasMap.listAliases(searchAlias);
					
				});
				
				test("Result is well-defined.", () => {
					
					expect(resultSet).toBeDefined();
					
				});
				
				test("Result contains the correct values.", () => {
					
					for (let alias of aliases) expect(resultSet).toContain(alias);
					
				});
				
				test("Result is the appropriate length.", () => {
					
					expect(resultSet).toHaveLength(aliases.length);
					
				});
			
			});
			
		});
		
		describe("Correct aliases are returned for a 'secondary alias'.", () => {
			
			describe.each([
				[1, "alias-1-1", ["alias-1-0", "alias-1-1", "alias-1-2", "alias-1-3"]],
				[2, "alias-2-2", ["alias-2-0", "alias-2-1", "alias-2-2", "alias-2-3"]],
				[3, "alias-3-3", ["alias-3-0", "alias-3-1", "alias-3-2", "alias-3-3"]]
			])("Alias set #%i.", (index: any, searchAlias: any, aliases: any) => {
				
				let resultSet: string[] | undefined;
				
				beforeAll(() => {
					
					resultSet = aliasMap.listAliases(searchAlias);
					
				});
				
				test("Result is well-defined.", () => {
					
					expect(resultSet).toBeDefined();
					
				});
				
				test("Result contains the correct values.", () => {
					
					for (let alias of aliases) expect(resultSet).toContain(alias);
					
				});
				
				test("Result is the appropriate length.", () => {
					
					expect(resultSet).toHaveLength(aliases.length);
					
				});
				
			});
			
		});
		
		describe("Included 'search' alias is properly excluded from results when 'includeProvidedAlias' is set " +
					   "to false.", () => {
				
				describe("When searching by 'primary alias'...", () => {
					
					describe.each([
						[1, "alias-1-0", ["alias-1-1", "alias-1-2", "alias-1-3"]],
						[2, "alias-2-0", ["alias-2-1", "alias-2-2", "alias-2-3"]],
						[3, "alias-3-0", ["alias-3-1", "alias-3-2", "alias-3-3"]]
					])("Alias set #%i.", (index: any, searchAlias: any, aliases: any) => {
						
						let resultSet: string[] | undefined;
						
						beforeAll(() => {
							
							resultSet = aliasMap.listAliases(searchAlias, false);
							
						});
						
						test("Result is well-defined.", () => {
							
							expect(resultSet).toBeDefined();
							
						});
						
						test("Result contains the correct values.", () => {
							
							for (let alias of aliases) expect(resultSet).toContain(alias);
							
						});
						
						test("Result does NOT contain 'search' alias.", () => {
							
							expect(resultSet).not.toContain(searchAlias);
							
						});
						
						test("Result is the appropriate length.", () => {
							
							expect(resultSet).toHaveLength(aliases.length);
							
						});
						
					});
					
				});
				
				describe("When searching by 'secondary alias'...", () => {
					
					describe.each([
						[1, "alias-1-1", ["alias-1-0", "alias-1-2", "alias-1-3"]],
						[2, "alias-2-2", ["alias-2-0", "alias-2-1", "alias-2-3"]],
						[3, "alias-3-3", ["alias-3-0", "alias-3-1", "alias-3-2"]]
					])("Alias set #%i.", (index: any, searchAlias: any, aliases: any) => {
						
						let resultSet: string[] | undefined;
						
						beforeAll(() => {
							
							resultSet = aliasMap.listAliases(searchAlias, false);
							
						});
						
						test("Result is well-defined.", () => {
							
							expect(resultSet).toBeDefined();
							
						});
						
						test("Result contains the correct values.", () => {
							
							for (let alias of aliases) expect(resultSet).toContain(alias);
							
						});
						
						test("Result does NOT contain 'search' alias.", () => {
							
							expect(resultSet).not.toContain(searchAlias);
							
						});
						
						test("Result is the appropriate length.", () => {
							
							expect(resultSet).toHaveLength(aliases.length);
							
						});
						
					});
					
				});
			
		});
		
		test("Attempts to retrieve a non-existent alias returns undefined.", () => {
			
			expect(aliasMap.listAliases("alias-4-0")).toBeUndefined();
			
		});
	
	});
	
	describe("#numberOfAliasesFor", () => {
	
		test("TODO", () => {
			
			// TODO [9/30/19 @ 3:38 PM] Finish test body.
			fail("Test not yet written...");
			
		});
	
	});
	
	describe("#size", () => {
	
		test("Returns zero for newly initialized map.", () => {
			
			expect((new AliasMap()).size()).toBe(0);
			
		});
		
		test("Returns proper size for populated map.", () => {
			
			expect(aliasMap.size()).toBe(3);
			
		});
		
		describe("Size updates correctly after adding and removing values.", () => {
			
			test("Iteration 1 of 3", () => {
				
				aliasMap.removeValue("alias-1-0");
				
				expect(aliasMap.size()).toBe(2);
				
			});
			
			test("Iteration 2 of 3", () => {
				
				aliasMap.removeValue("alias-1-0");
				aliasMap.removeValue("alias-2-0");
				
				expect(aliasMap.size()).toBe(1);
				
			});
			
			test("Iteration 3 of 3", () => {
				
				aliasMap.removeValue("alias-1-0");
				aliasMap.removeValue("alias-2-0");
				aliasMap.removeValue("alias-3-0");
				
				expect(aliasMap.size()).toBe(0);
				
			});
			
			test("TODO", () => {
				
				// TODO [9/27/19 @ 6:01 PM] - Add tests for adding values as well.
				
				fail("Test not yet written...");
				
			});
			
		});
		
		test("Size does not change after removing non-existent values from the map.", () => {
			
			aliasMap.removeValue("alias-4-0");
			
			expect(aliasMap.size()).toBe(3);
			
		});
	
	});
	
	describe("#clear", () => {
		
		test("Method properly 'empties' the AliasMap.", () => {
			
			aliasMap.clear();
			
			expect(aliasMap.size()).toBe(0);
			
			for (let outerIndex: number = 1; outerIndex < 4; outerIndex++) {
				
				for (let innerIndex: number = 0; innerIndex < 4; innerIndex++) {
					
					expect(aliasMap.get("alias-" + outerIndex + "-" + innerIndex)).toBeUndefined();
					
				}
				
			}
			
		});
		
		describe("Values can be added as expected after a clear operation.", () => {
		
			test("TODO", () => {
			
				// TODO [9/30/19 @ 3:38 PM] Finish test body.
				fail("Test not yet written...");
				
			});
		
		});
	
	});
	
});