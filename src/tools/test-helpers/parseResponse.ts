/**
 * MCPレスポンスから構造化されたコンテンツを抽出する
 */
export const parseResponse = <T = unknown>(
  response:
    | { content: Array<{ type: string; text: string }> }
    | { isError: true; content: Array<{ type: string; text: string }> },
): T => {
  const textContent = response.content[0];
  if (!textContent || textContent.type !== "text") {
    throw new Error("Unexpected response format");
  }
  return JSON.parse(textContent.text) as T;
};

/**
 * レスポンスがエラーかどうかを判定する
 */
export const isErrorResponse = (
  response: unknown,
): response is {
  isError: true;
  content: Array<{ type: string; text: string }>;
} => {
  return (
    typeof response === "object" &&
    response !== null &&
    "isError" in response &&
    response.isError === true
  );
};
