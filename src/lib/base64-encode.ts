import * as fs from "fs";

export const encodeFile = async (filePath: string) => {
  const encodedContent = await fs.promises.readFile(filePath, {
    encoding: "base64",
  });
  return encodedContent;
};