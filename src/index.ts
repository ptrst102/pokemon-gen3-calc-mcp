import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import {
  calculateDamageDefinition,
  calculateDamageHandler,
} from "./tools/calculateDamage";
import {
  calculateStatusDefinition,
  calculateStatusHandler,
} from "./tools/calculateStatus";

const server = new Server(
  {
    name: "pokemon-g3-calc-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// ツールの登録
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [calculateStatusDefinition, calculateDamageDefinition],
}));

// ツールハンドラの登録
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "calculate_status":
      return await calculateStatusHandler(request.params.arguments);
    case "calculate_damage":
      return await calculateDamageHandler(request.params.arguments);
    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`,
      );
  }
});

// サーバーの起動
const transport = new StdioServerTransport();
server.connect(transport);

console.error("Pokemon Generation 3 Calc Server started");
