import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const main = async () => {
  console.log('test setting');
  console.log(process.env.USER_NAME);
  console.log(process.env.PASSWORD);
  console.log(process.env.PROJECTID);
  console.log(process.env.PROJECT_SLUG);

  const sessionToken = await getSessionToken();
  const permissionRuleBase64 = await encodePermissionRule();
  const projectConfig = await getProjectConfig(process.env.PROJECTID ?? "", sessionToken)
  const encodeIdentitySchemaBase64 = await encodeIdentitySchema()
  const identitySchemaJson = await extractAndUpdateIdentitySchema(projectConfig, encodeIdentitySchemaBase64)
  await updateProjectConfig(
    process.env.PROJECTID ?? '',
    sessionToken,
    permissionRuleBase64,
    identitySchemaJson
  );

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
  console.log(login.data)
  return login.data.session_token;
};

// 2. encode new config file
// 2.1 encode permission rule definition
const encodePermissionRule = async () => {
  const filePath = path.resolve(__dirname, 'permission/permissionRule.ts');
  const encodedRule = await fs.promises.readFile(filePath, {
    encoding: 'base64',
  });
  return encodedRule;
};

// 2. encode new config file
// 2.1 encode permission rule definition
const encodeIdentitySchema = async () => {
  const filePath = path.resolve(__dirname, 'identity/identity.json');
  const encodedRule = await fs.promises.readFile(filePath, {
    encoding: 'base64',
  });
  return encodedRule;
};


// 3. update config file
// 3.1 update project permission configuration
// TODO: how to rollback if tuple relationship does not upload successfully?
const updateProjectConfig = async (
  projectId: string,
  sessionToken: string,
  permissionConfig: string,
  schemaConfig: any,
) => {
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
        identity: schemaConfig
      },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        Accept: 'application/json',
      },
    }
  );
};

const getProjectConfig = async (
  projectId: string,
  sessionToken: string,
) => {
  const project = await axios.get(
    `https://api.console.ory.sh/projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        Accept: 'application/json',
      },
    }
  );
  const filePath = path.resolve(__dirname, 'config.json');
  await fs.promises.writeFile(filePath, JSON.stringify(project.data));
  return project.data
};

// Update identity schema
const extractAndUpdateIdentitySchema = async(projectConfig: any, encodeIdentitySchema: string) => { 
  const { services: { identity: { config } } }= projectConfig
  const { identity: { schemas } } = config
  const  newSchema = [{
    "id": "custom-1",
    "url": `base64://${encodeIdentitySchema}`
  }].concat(schemas)
  const newIdentity = {
    "default_schema_id": "custom-1",
    schemas: newSchema
  }
  console.log({ config: {...config, identity: newIdentity} })
  return { config: {...config, identity: newIdentity} }
}


main();

// TODO: session and relationship tuple
