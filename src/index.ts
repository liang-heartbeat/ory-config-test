import * as fs from 'fs';
import * as path from 'path';

const main = async () => { 
  const filePath = path.resolve(__dirname, 'permissionRuleTest.ts');
  const readFile = await fs.promises.readFile(filePath, {encoding: 'base64'});
  const testJson = {
    "limit": {},
    "namespaces": {
      "location": `base64://${readFile}`
    }
  }
  await fs.promises.writeFile(path.resolve(__dirname,'permission-config.json'), JSON.stringify(testJson))
}

main()