# Ory

It is used to record ory configuration file.

## Identity schema
1. Define identity schema. It is defined in the `./identity/identity.json`. A tutorial for define identity schema. [Customize identity schemas](https://www.ory.sh/docs/kratos/manage-identities/customize-identity-schema)

2. Update identity schema by ory command.[Creating identity schemas](https://www.ory.sh/docs/identities/model/manage-identity-schema)

```shell
# Encode your schema to Base64 and export it to a variable.
schema=$(cat ./identity/identity.json | base64)

# Update your project's configuration. 
# You should provide your-project-id, unique-schema-id.
# TODO: unique schema id is not generated by uploading the schema
ory patch identity-config {your-project-id} \
  --replace '/identity/default_schema_id="{unique-schema-id}"' \
  --replace '/identity/schemas=[{"id":"{unique-schema-id}","url":"base64://'$schema'"}]'

```
3. In order to control the 


## Update permission rule and relationship
1. Update permission rule. It is defined in the `./permission/permissionRule.ts`.

2. Upload latest permission rule to ory by command.

```shell

  # 1. Get your project id
  ory ls projects
  # output:
  # ID					                          SLUG			              STATE	NAME
  # 143f18ba-304b-40d2-8894-f479b1007961	busy-hellman-zobf672u9m	running	ory-keto
  # 477b5a61-e78c-416e-af75-60b6f0238f77	festive-bohr-mdsepi9aam	running	orange dev
  # ca3be4df-eaa7-4d12-83be-f0f7af0141de	eager-raman-ag5yd5pxpy	running	play-with-ory

  # 2. Apply that configuration, replace project_id
  ory patch opl --project $project_id -f file://./permission/permissionRule.ts
  # outputs:
  # map[limit:map[] namespaces:map[location:https://storage.googleapis.com/bac-gcs-production/c8d4d5931bbd24126d563debb5e8d8d0c232022afa4eefd40e641f6ed56e1e6ab9b04da48e951fb77c3078cfebe4b13665a9b421f683422a2a4df8b9033feabc.bin]]

```
3. Update relationship definition. It is defined in the `relationship.json`. It is used for initializing the first actor permission in ory. Orange should support setup relationships in UI for following users and organisations.

4. Upload latest relationship to ory by command.

```shell
  # 1. create relationship
  ory create relationships ./permission/relationship.json
  # outputs:
  # NAMESPACE	    OBJECT				               RELATION NAME SUBJECT
  # Actor		      heartbeat-user			         user		       8c94cb84-0275-4722-871c-5f7327772d85
  # Group		      heartbeat-developer-group	   members		   8c94cb84-0275-4722-871c-5f7327772d85
  # Organisation	heartbeat			               reader		     Group:heartbeat-developer-group#members
  # Folder		    heartbeat-permission		     parent		     Organisation:heartbeat
  # File		      heartbeat-permission-read	   parent		     Folder:heartbeat-permission

  # 2. check permission
  ory is allowed 8c94cb84-0275-4722-871c-5f7327772d85 read Folder heartbeat-permission
  # outputs:
  # Allowed
```
5. In code aspect, could use sdk PermissionApi, RelationshipApi to check permission and maintain permission relationship.

6. <b>TODO:</b> Is it correct way to define permission rule

7. TODO: Identification: how to identify Object (or resource) or Subject. For example user actor `subject_id`. Another senario is about patient record. Based on care pathway concept, it is compound of several layers of code(data). Some code could be shared among care pathways, and as I understand this shared code could be a question of survey. How to control permissions of it? setting permission to a question level? ( It is based on my understanding of care pathway concept. Maybe the real concept is different from mine.)

8. TODO: How to do permission check? Do we encode all the permissions of one user in jwt token format and store it cookie after user login? Or do we call API to check permission each time when user request to access specific resources?

