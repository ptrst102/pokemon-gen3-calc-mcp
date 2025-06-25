#!/usr/bin/env tsx

import { calculateDamageDefinition } from "../src/tools/calculateDamage/index";
import { calculateStatusDefinition } from "../src/tools/calculateStatus/index";

console.log("=== Generated calculateDamage inputSchema ===");
console.log(JSON.stringify(calculateDamageDefinition.inputSchema, null, 2));

console.log("\n\n=== Generated calculateStatus inputSchema ===");
console.log(JSON.stringify(calculateStatusDefinition.inputSchema, null, 2));
