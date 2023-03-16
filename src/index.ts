import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';


const main = async () => {
  console.log('test without setting')
  console.log(process.env.USER_NAME);
  console.log(process.env.PASSWORD);
  console.log(process.env.PROJECTID);


  const sessionToken = await getSessionToken();
  const permissionRuleBase64 = await encodePermissionRule();
  // TODO: replace projectId 
  await updateProjectConfig(process.env.PROJECTID?? "", sessionToken, permissionRuleBase64)
};

// 1. get session_token
const getSessionToken = async () => {
  // 1. start natvie login workflow
  const loginFlow = await axios.get(
    `https://project.console.ory.sh/self-service/login/api`
  );
  // 2. get session_token after login
  const login = await axios.post(
    `https://project.console.ory.sh/self-service/login?flow=${loginFlow.data.id}`,
    {
      identifier: `${process.env.USER_NAME}`,
      method: 'password',
      password: `${process.env.PASSWORD}`,
    }
  );
  return login.data.session_token;
};

// 2. encode new config file
// 2.1 encode permission rule definition
const encodePermissionRule = async() => {
  const filePath = path.resolve(__dirname, 'permission/permissionRule.ts');
  const encodedRule = await fs.promises.readFile(filePath, { encoding: 'base64' });
  return encodedRule
};

// 3. encode new config file
// 3.1 update project configuration
const updateProjectConfig = async (projectId: string, sessionToken: string, permissionConfig: string) => { 
    await axios.put(
    `https://api.console.ory.sh/projects/${projectId}`,
    {
      name: 'ory-keto',
      services: {
        permission: {
          config: {
            namespaces: {
              location: `base64://${permissionConfig}`,
            },
            limit: {},
          },
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        Accept: 'application/json',
      },
    }
  );

}


main();

// TODO: promise all for update config and update init data(relationship tuple, sessin data)