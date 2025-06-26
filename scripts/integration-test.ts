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

  console.log("MCP Server Integration Test\n");

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
    console.log("サーバーへの接続成功\n");

    // 利用可能なツールの一覧取得
    const tools = await client.listTools();
    console.log("利用可能なツール:");
    tools.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log("");

    // テスト1: calculate_status（ピカチュウのステータス計算）
    console.log("テスト1: calculate_status (ピカチュウ)");
    try {
      const statusResult = await client.callTool({
        name: "calculate_status",
        arguments: {
          pokemonName: "ピカチュウ",
          level: 50,
          nature: "ようき",
          evs: {
            hp: 6,
            atk: 252,
            def: 0,
            spa: 0,
            spd: 0,
            spe: 252,
          },
          ivs: {
            hp: 31,
            atk: 31,
            def: 31,
            spa: 31,
            spd: 31,
            spe: 31,
          },
        },
      });

      results.push({
        name: "calculate_status (ピカチュウ)",
        success: true,
        response: statusResult.content,
      });

      if (
        Array.isArray(statusResult.content) &&
        statusResult.content[0] &&
        "type" in statusResult.content[0] &&
        statusResult.content[0].type === "text" &&
        "text" in statusResult.content[0]
      ) {
        console.log(statusResult.content[0].text);
      }
    } catch (error) {
      results.push({
        name: "calculate_status (ピカチュウ)",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`エラー: ${error}`);
    }
    console.log("");

    // テスト2: calculate_damage（努力値・個体値指定）
    console.log("テスト2: calculate_damage (努力値・個体値指定)");
    try {
      const damageResult = await client.callTool({
        name: "calculate_damage",
        arguments: {
          move: "サイコキネシス",
          attacker: {
            pokemonName: "ラティオス",
            level: 50,
            item: "こだわりメガネ",
            stat: {
              iv: 31,
              ev: 252,
              natureModifier: "up", // ひかえめはとくこう上昇
            },
          },
          defender: {
            pokemonName: "キノガッサ",
            level: 50,
            ability: "ポイズンヒール",
            stat: {
              iv: 31,
              ev: 6,
              natureModifier: "neutral", // ようきはとくぼうに影響なし
            },
          },
        },
      });

      results.push({
        name: "calculate_damage (努力値・個体値指定)",
        success: true,
        response: damageResult.content,
      });

      if (
        Array.isArray(damageResult.content) &&
        damageResult.content[0] &&
        "type" in damageResult.content[0] &&
        damageResult.content[0].type === "text" &&
        "text" in damageResult.content[0]
      ) {
        console.log(damageResult.content[0].text);
      }
    } catch (error) {
      results.push({
        name: "calculate_damage (努力値・個体値指定)",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`エラー: ${error}`);
    }
    console.log("");

    // テスト3: calculate_damage 実数値直接指定
    console.log("テスト3: calculate_damage (実数値直接指定)");
    try {
      const valueResult = await client.callTool({
        name: "calculate_damage",
        arguments: {
          move: "れいとうビーム",
          attacker: {
            pokemonName: "ラプラス",
            level: 50,
            ability: "シェルアーマー",
            stat: {
              value: 182, // とくこう実数値を直接指定
            },
          },
          defender: {
            pokemonName: "サーナイト",
            level: 50,
            item: "オボンのみ",
            stat: {
              value: 121, // とくぼう実数値を直接指定
            },
          },
        },
      });

      results.push({
        name: "calculate_damage (実数値直接指定)",
        success: true,
        response: valueResult.content,
      });

      if (
        Array.isArray(valueResult.content) &&
        valueResult.content[0] &&
        "type" in valueResult.content[0] &&
        valueResult.content[0].type === "text" &&
        "text" in valueResult.content[0]
      ) {
        console.log(valueResult.content[0].text);
      }
    } catch (error) {
      results.push({
        name: "calculate_damage (実数値直接指定)",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`エラー: ${error}`);
    }
    console.log("");

    // テスト4: calculate_damage with calculateAllEvs（努力値別ダメージ計算）
    console.log("テスト4: calculate_damage with calculateAllEvs");
    try {
      const evDamageResult = await client.callTool({
        name: "calculate_damage",
        arguments: {
          move: "コメットパンチ",
          attacker: {
            pokemonName: "メタグロス",
            level: 50,
            ability: "クリアボディ",
            stat: {
              iv: 31,
              ev: 252,
              natureModifier: "up", // いじっぱりはこうげき上昇
            },
          },
          defender: {
            pokemonName: "ハピナス",
            level: 50,
            ability: "しぜんかいふく",
            stat: {
              iv: 31,
              calculateAllEvs: true,
            },
          },
        },
      });

      results.push({
        name: "calculate_damage with calculateAllEvs",
        success: true,
        response: evDamageResult.content,
      });

      if (
        Array.isArray(evDamageResult.content) &&
        evDamageResult.content[0] &&
        "type" in evDamageResult.content[0] &&
        evDamageResult.content[0].type === "text" &&
        "text" in evDamageResult.content[0]
      ) {
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
      console.error(`エラー: ${error}`);
    }
    console.log("");

    // テスト5: calculate_damage_matrix_varying_defense
    console.log("テスト5: calculate_damage_matrix_varying_defense");
    try {
      const matrixDefenseResult = await client.callTool({
        name: "calculate_damage_matrix_varying_defense",
        arguments: {
          move: "サイコキネシス",
          attacker: {
            pokemonName: "ラティオス",
            level: 50,
            item: "こだわりメガネ",
            stat: {
              iv: 31,
              ev: 252,
              natureModifier: "up",
            },
          },
          defender: {
            pokemonName: "キノガッサ",
            level: 50,
            isPhysicalDefense: false,
            stat: {
              iv: 31,
              natureModifier: "neutral",
            },
          },
        },
      });

      results.push({
        name: "calculate_damage_matrix_varying_defense",
        success: true,
        response: matrixDefenseResult.content,
      });

      if (
        Array.isArray(matrixDefenseResult.content) &&
        matrixDefenseResult.content[0] &&
        "type" in matrixDefenseResult.content[0] &&
        matrixDefenseResult.content[0].type === "text" &&
        "text" in matrixDefenseResult.content[0]
      ) {
        const text = matrixDefenseResult.content[0].text;
        const parsed = JSON.parse(text);
        console.log(
          `計算された努力値パターン数: ${parsed.damageMatrix.length}`,
        );
        console.log(
          `努力値0のダメージ: ${parsed.damageMatrix[0].damages[0]}-${parsed.damageMatrix[0].damages[15]}`,
        );
        console.log(
          `努力値252のダメージ: ${parsed.damageMatrix[32].damages[0]}-${parsed.damageMatrix[32].damages[15]}`,
        );
      }
    } catch (error) {
      results.push({
        name: "calculate_damage_matrix_varying_defense",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`エラー: ${error}`);
    }
    console.log("");

    // テスト6: calculate_damage_matrix_varying_attack
    console.log("テスト6: calculate_damage_matrix_varying_attack");
    try {
      const matrixAttackResult = await client.callTool({
        name: "calculate_damage_matrix_varying_attack",
        arguments: {
          move: "コメットパンチ",
          attacker: {
            pokemonName: "メタグロス",
            level: 50,
            isPhysicalAttack: true,
            stat: {
              iv: 31,
              natureModifier: "up",
            },
          },
          defender: {
            pokemonName: "ハピナス",
            level: 50,
            stat: {
              iv: 31,
              ev: 252,
              natureModifier: "up",
            },
          },
        },
      });

      results.push({
        name: "calculate_damage_matrix_varying_attack",
        success: true,
        response: matrixAttackResult.content,
      });

      if (
        Array.isArray(matrixAttackResult.content) &&
        matrixAttackResult.content[0] &&
        "type" in matrixAttackResult.content[0] &&
        matrixAttackResult.content[0].type === "text" &&
        "text" in matrixAttackResult.content[0]
      ) {
        const text = matrixAttackResult.content[0].text;
        const parsed = JSON.parse(text);
        console.log(
          `計算された努力値パターン数: ${parsed.damageMatrix.length}`,
        );
        console.log(
          `努力値0のダメージ: ${parsed.damageMatrix[0].damages[0]}-${parsed.damageMatrix[0].damages[15]}`,
        );
        console.log(
          `努力値252のダメージ: ${parsed.damageMatrix[32].damages[0]}-${parsed.damageMatrix[32].damages[15]}`,
        );
      }
    } catch (error) {
      results.push({
        name: "calculate_damage_matrix_varying_attack",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`エラー: ${error}`);
    }
    console.log("");

    // テスト7: エラーケース（存在しないポケモン）
    console.log("テスト7: エラーケース (存在しないポケモン)");
    try {
      await client.callTool({
        name: "calculate_status",
        arguments: {
          pokemonName: "存在しないポケモン",
          level: 50,
          nature: "ようき",
        },
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
      console.log(`正常にエラーをキャッチ: ${error}`);
    }
    console.log("");

    // クライアントを閉じる
    await client.close();

    // テスト結果のサマリー
    console.log("\nテスト結果サマリー\n");
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
    console.error("テスト実行中に予期しないエラーが発生しました:", error);
    process.exit(1);
  }
};

// テスト実行
runIntegrationTests().catch((error) => {
  console.error("テスト実行エラー:", error);
  process.exit(1);
});
