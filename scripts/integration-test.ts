#!/usr/bin/env tsx

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  response?: unknown;
}

const runIntegrationTests = async () => {
  const results: TestResult[] = [];

  console.log("🚀 MCP Server Integration Test\n");

  try {
    // MCPサーバーへの接続
    const transport = new StdioClientTransport({
      command: "tsx",
      args: ["src/index.ts"],
    });

    const client = new Client(
      {
        name: "integration-test-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      },
    );

    await client.connect(transport);
    console.log("✅ サーバーへの接続成功\n");

    // 利用可能なツールの一覧取得
    const tools = await client.listTools();
    console.log("📋 利用可能なツール:");
    tools.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log("");

    // テスト1: calculate_status（ピカチュウのステータス計算）
    console.log("📊 テスト1: calculate_status (ピカチュウ)");
    try {
      const statusResult = await client.callTool("calculate_status", {
        pokemonName: "ピカチュウ",
        level: 50,
        nature: "ようき",
        evs: {
          hp: 6,
          attack: 252,
          defense: 0,
          specialAttack: 0,
          specialDefense: 0,
          speed: 252,
        },
        ivs: {
          hp: 31,
          attack: 31,
          defense: 31,
          specialAttack: 31,
          specialDefense: 31,
          speed: 31,
        },
      });

      results.push({
        name: "calculate_status (ピカチュウ)",
        success: true,
        response: statusResult.content[0],
      });

      if (statusResult.content[0].type === "text") {
        console.log(statusResult.content[0].text);
      }
    } catch (error) {
      results.push({
        name: "calculate_status (ピカチュウ)",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`❌ エラー: ${error}`);
    }
    console.log("");

    // テスト2: calculate_damage（ラティオスのサイコキネシス）
    console.log("🎯 テスト2: calculate_damage (ラティオスのサイコキネシス)");
    try {
      const damageResult = await client.callTool("calculate_damage", {
        attackerName: "ラティオス",
        defenderName: "キノガッサ",
        moveName: "サイコキネシス",
        attackerLevel: 50,
        defenderLevel: 50,
        attackerNature: "ひかえめ",
        defenderNature: "ようき",
        attackerEvs: {
          hp: 6,
          specialAttack: 252,
          speed: 252,
        },
        defenderEvs: {
          hp: 6,
          attack: 252,
          speed: 252,
        },
        attackerItem: "こだわりメガネ",
        defenderAbility: "ポイズンヒール",
      });

      results.push({
        name: "calculate_damage (ラティオス vs キノガッサ)",
        success: true,
        response: damageResult.content[0],
      });

      if (damageResult.content[0].type === "text") {
        console.log(damageResult.content[0].text);
      }
    } catch (error) {
      results.push({
        name: "calculate_damage (ラティオス vs キノガッサ)",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`❌ エラー: ${error}`);
    }
    console.log("");

    // テスト3: calculate_damage with calculateAllEvs（努力値別ダメージ計算）
    console.log("📈 テスト3: calculate_damage with calculateAllEvs");
    try {
      const evDamageResult = await client.callTool("calculate_damage", {
        attackerName: "メタグロス",
        defenderName: "ハピナス",
        moveName: "コメットパンチ",
        attackerLevel: 50,
        defenderLevel: 50,
        attackerNature: "いじっぱり",
        defenderNature: "ずぶとい",
        attackerEvs: {
          hp: 252,
          attack: 252,
          defense: 6,
        },
        defenderEvs: {
          hp: 252,
          defense: 252,
          specialDefense: 6,
        },
        attackerAbility: "クリアボディ",
        defenderAbility: "しぜんかいふく",
        calculateAllEvs: true,
      });

      results.push({
        name: "calculate_damage with calculateAllEvs",
        success: true,
        response: evDamageResult.content[0],
      });

      if (evDamageResult.content[0].type === "text") {
        const text = evDamageResult.content[0].text;
        // 努力値別の結果の一部のみ表示
        const lines = text.split("\n");
        console.log(lines.slice(0, 10).join("\n"));
        console.log("... (省略) ...");
      }
    } catch (error) {
      results.push({
        name: "calculate_damage with calculateAllEvs",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`❌ エラー: ${error}`);
    }
    console.log("");

    // テスト4: エラーケース（存在しないポケモン）
    console.log("🚫 テスト4: エラーケース (存在しないポケモン)");
    try {
      await client.callTool("calculate_status", {
        pokemonName: "存在しないポケモン",
        level: 50,
        nature: "ようき",
      });

      results.push({
        name: "エラーケース (存在しないポケモン)",
        success: false,
        error: "エラーが発生しませんでした（想定外）",
      });
    } catch (error) {
      results.push({
        name: "エラーケース (存在しないポケモン)",
        success: true,
        response: `正常にエラーをキャッチ: ${error}`,
      });
      console.log(`✅ 正常にエラーをキャッチ: ${error}`);
    }
    console.log("");

    // クライアントを閉じる
    await client.close();

    // テスト結果のサマリー
    console.log("\n📝 テスト結果サマリー\n");
    const successCount = results.filter((r) => r.success).length;
    console.log(`全体: ${successCount}/${results.length} 成功`);
    console.log("");

    results.forEach((result) => {
      const icon = result.success ? "✅" : "❌";
      console.log(`${icon} ${result.name}`);
      if (result.error) {
        console.log(`   エラー: ${result.error}`);
      }
    });

    process.exit(successCount === results.length ? 0 : 1);
  } catch (error) {
    console.error("💥 テスト実行中に予期しないエラーが発生しました:", error);
    process.exit(1);
  }
};

// テスト実行
runIntegrationTests().catch((error) => {
  console.error("💥 テスト実行エラー:", error);
  process.exit(1);
});
