#!/usr/bin/env tsx

console.log("=== 手書きJSONスキーマとZodスキーマの差異分析 ===\n");

console.log("1. calculateStatusのivsがrequiredでなかった問題:");
console.log(
  "   - 手書き: required: ['pokemonName', 'level', 'nature', 'evs'] (ivsが欠落)",
);
console.log("   - Zod: すべてのフィールドが必須");
console.log("   → Zodが正しい: ステータス計算にはIVが必須\n");

console.log("2. number vs integer の問題:");
console.log("   - 手書き: すべて'number'型");
console.log("   - Zod: .int()を使用している箇所は'integer'型");
console.log("   → Zodが正しい: レベル、IV、EVは整数値のみ許可すべき\n");

console.log("3. move入力にnameフィールドがある:");
console.log("   - 手書き: moveオブジェクトにnameフィールドなし");
console.log("   - Zod: オプショナルなnameフィールドあり");
console.log("   → Zodの方が柔軟\n");

console.log("4. 説明の有無:");
console.log("   - 手書き: 各フィールドに詳細な説明");
console.log("   - Zod: describe()を一部のみ使用");
console.log("   → 手書きの方が説明が充実\n");

console.log("5. examples の有無:");
console.log("   - 手書き: examplesプロパティあり");
console.log("   - Zod→JSON Schema: examplesなし");
console.log("   → 手書きの方がドキュメント性が高い\n");

console.log("結論:");
console.log("- Zodスキーマの方が型の正確性は高い（integer、required fields）");
console.log(
  "- 手書きスキーマの方がドキュメント性は高い（descriptions、examples）",
);
console.log("- 理想: Zodスキーマにdescribe()とexamples機能を追加");
