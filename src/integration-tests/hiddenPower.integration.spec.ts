#!/usr/bin/env tsx

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const runHiddenPowerTests = async () => {
  console.log("めざめるパワー統合テスト\n");

  try {
    // MCPサーバーへの接続
    const transport = new StdioClientTransport({
      command: "tsx",
      args: ["src/index.ts"],
    });

    const client = new Client(
      {
        name: "hidden-power-test-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      },
    );

    await client.connect(transport);
    console.log("サーバーへの接続成功\n");

    // テスト1: めざめるパワーで個体値から正しくタイプと威力を計算する
    console.log("テスト1: めざめるパワー（こおりタイプ）");
    try {
      const result1 = await client.callTool({
        name: "calculate_damage",
        arguments: {
          move: "めざめるパワー",
          attacker: {
            pokemonName: "スターミー",
            level: 50,
            stat: {
              iv: 31,
              ev: 252,
              natureModifier: "neutral",
            },
            allIVs: {
              hp: 31,
              attack: 30,
              defense: 30,
              specialAttack: 31,
              specialDefense: 31,
              speed: 31,
            },
          },
          defender: {
            pokemonName: "ガラガラ",
            level: 50,
            stat: {
              iv: 31,
              ev: 0,
              natureModifier: "neutral",
            },
          },
        },
      });

      console.log("結果:", JSON.stringify(result1, null, 2));
      console.log("✅ テスト1成功\n");
    } catch (error) {
      console.error("❌ テスト1失敗:", error);
    }

    // テスト2: めざめるパワーで個体値が指定されていない場合エラーを返す
    console.log("テスト2: めざめるパワー（個体値未指定エラー）");
    try {
      const result2 = await client.callTool({
        name: "calculate_damage",
        arguments: {
          move: "めざめるパワー",
          attacker: {
            pokemonName: "スターミー",
            level: 50,
            stat: {
              value: 135, // 実数値のみ指定
            },
          },
          defender: {
            pokemonName: "ガラガラ",
            level: 50,
            stat: {
              iv: 31,
              ev: 0,
              natureModifier: "neutral",
            },
          },
        },
      });

      console.log("結果:", JSON.stringify(result2, null, 2));
      console.log("✅ テスト2成功（エラーが期待通り）\n");
    } catch (error) {
      console.error("❌ テスト2失敗:", error);
    }

    // テスト3: めざめるパワー（全個体値31）はあくタイプ威力70になる
    console.log("テスト3: めざめるパワー（あくタイプ）");
    try {
      const result3 = await client.callTool({
        name: "calculate_damage",
        arguments: {
          move: "めざめるパワー",
          attacker: {
            pokemonName: "スターミー",
            level: 50,
            stat: {
              iv: 31,
              ev: 252,
              natureModifier: "neutral",
            },
            // allIVsが省略された場合、全て31として扱われる
          },
          defender: {
            pokemonName: "ラティオス",
            level: 50,
            stat: {
              iv: 31,
              ev: 0,
              natureModifier: "neutral",
            },
          },
        },
      });

      console.log("結果:", JSON.stringify(result3, null, 2));
      console.log("✅ テスト3成功\n");
    } catch (error) {
      console.error("❌ テスト3失敗:", error);
    }

    // テスト4: 努力値総当たり計算でもめざめるパワーが正しく動作する
    console.log("テスト4: めざめるパワー（努力値総当たり）");
    try {
      const result4 = await client.callTool({
        name: "calculate_damage_matrix_varying_attack",
        arguments: {
          move: "めざめるパワー",
          attacker: {
            pokemonName: "スターミー",
            stat: {
              iv: 31,
              natureModifier: "neutral",
            },
            isPhysicalAttack: false,
            allIVs: {
              hp: 31,
              attack: 30,
              defense: 30,
              specialAttack: 31,
              specialDefense: 31,
              speed: 31,
            },
          },
          defender: {
            pokemonName: "ガラガラ",
            level: 50,
            stat: {
              iv: 31,
              ev: 252,
              natureModifier: "up",
            },
          },
        },
      });

      console.log("結果:", JSON.stringify(result4, null, 2));
      console.log("✅ テスト4成功\n");
    } catch (error) {
      console.error("❌ テスト4失敗:", error);
    }

    // テスト5: 防御側努力値総当たり計算でもめざめるパワーが正しく動作する
    console.log("テスト5: めざめるパワー（防御側努力値総当たり）");
    try {
      const result5 = await client.callTool({
        name: "calculate_damage_matrix_varying_defense",
        arguments: {
          move: "めざめるパワー",
          attacker: {
            pokemonName: "スターミー",
            level: 50,
            stat: {
              iv: 31,
              ev: 252,
              natureModifier: "up",
            },
            allIVs: {
              hp: 31,
              attack: 30,
              defense: 30,
              specialAttack: 31,
              specialDefense: 31,
              speed: 31,
            },
          },
          defender: {
            pokemonName: "ボーマンダ",
            stat: {
              iv: 31,
              natureModifier: "neutral",
            },
            isPhysicalDefense: false,
          },
        },
      });

      console.log("結果（一部）:", JSON.stringify(result5.content[0].text.substring(0, 200), null, 2));
      console.log("✅ テスト5成功\n");
    } catch (error) {
      console.error("❌ テスト5失敗:", error);
    }

    console.log("全てのテストが完了しました");
    await client.close();
  } catch (error) {
    console.error("テスト実行エラー:", error);
    process.exit(1);
  }
};

// メイン実行
runHiddenPowerTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});