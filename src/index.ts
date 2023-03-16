import * as fs from 'fs';
import * as path from 'path';
import { ProjectApi, FrontendApi } from '@ory/client';
import axios from 'axios';

// API_KEY
// ory_pat_TLi3AXjvWHZCDtFHbzkS023crYnI4LHu
const projectApi = new ProjectApi(undefined, 'https://api.console.ory.sh');

const frontendApi = new FrontendApi(
  undefined,
  'https://project.console.ory.sh'
);

const main = async () => {
  const sessionToken = await getSessionToken();
  const permissionRuleBase64 = await encodePermissionRule();
  await updateProjectConfig('143f18ba-304b-40d2-8894-f479b1007961', sessionToken, permissionRuleBase64)
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
      identifier: `${replace_by_username_or_email}`,
      method: 'password',
      password: `${replace_by_password}`,
    }
  );

  console.log(login.data)
  return login.data.session_token;
};

// 2. encode new config file
// 2.1 encode permission rule definition
const encodePermissionRule = async() => {
  const filePath = path.resolve(__dirname, 'permissionRuleTest.ts');
  const encodedRule = await fs.promises.readFile(filePath, { encoding: 'base64' });
  return encodedRule
};

// 3. encode new config file
// 3.1 update project configuration
const updateProjectConfig = async (projectId: string, sessionToken: string, permissionConfig: string) => { 
    const updateProjectConfig = await axios.put(
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

// async function configProject(projectApi: ProjectApi, frontendApi: FrontendApi) {
//   // const getProjectConfig = await axios.get(
//   //   'https://busy-hellman-zobf672u9m.projects.console.ory.sh/projects/143f18ba-304b-40d2-8894-f479b1007961',
//   //   {
//   //     headers: {
//   //       Authorization: `Bearer ory_pat_TLi3AXjvWHZCDtFHbzkS023crYnI4LHu`,
//   //       Accept: "application/json"
//   //     },
//   //   }
//   // );

//   const loginFlow = await frontendApi.createNativeLoginFlow();
//   const loginProcess = await frontendApi.updateLoginFlow({
//     flow: loginFlow.data.id,
//     updateLoginFlowBody: {
//       identifier: '',
//       method: '',
//       password: '',
//     },
//   });
//   console.log('------'.repeat(6));

//   const getProjectConfig = await projectApi.getProject(
//     { projectId: '143f18ba-304b-40d2-8894-f479b1007961' },
//     {
//       headers: {
//         Authorization: `Bearer ${loginProcess.data.session_token}`,
//         Accept: 'application/json',
//       },
//     }
//   );

//   // const filePath = path.resolve(__dirname, 'permissionRuleTest.ts');
//   // const readFile = await fs.promises.readFile(filePath, { encoding: 'base64' });

//   // const updateProjectConfig = await axios.put(
//   //   'https://api.console.ory.sh/projects/143f18ba-304b-40d2-8894-f479b1007961',
//   //   {
//   //     name: 'ory-keto',
//   //     services: {
//   //       permission: {
//   //         config: {
//   //           namespaces: {
//   //             location: `base64://${readFile}`,
//   //           },
//   //           limit: {},
//   //         },
//   //       },
//   //     },
//   //   },
//   //   {
//   //     headers: {
//   //       Authorization: `Bearer ${loginProcess.data.session_token}`,
//   //       Accept: 'application/json',
//   //     },
//   //   }
//   // );

//   // console.log(updateProjectConfig.data.project.id);

//   // console.log(getProjectConfig.data);

//   await fs.promises.writeFile(
//     path.resolve(__dirname, 'project-configuration.json'),
//     JSON.stringify(getProjectConfig.data)
//   );

//   // TODO: 1. Be able to update permission rule, identity schema to be updated locally?

//   // TODO: 2. try github actions and set up env variables

//   // TODO: 3. How to backup the relationship tuples and identity session as well.

//   // TODO: 4. Does it need to compare
// }

main();
