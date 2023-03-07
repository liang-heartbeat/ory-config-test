# Ory

It is used to record ory configuration file.

## Update permission rule and relationship
1. Update permission rule. It is defined in the `permissionRule.ts`.

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
  ory patch opl --project $project_id -f file://./permissionRule.ts
  # outputs:
  # map[limit:map[] namespaces:map[location:https://storage.googleapis.com/bac-gcs-production/c8d4d5931bbd24126d563debb5e8d8d0c232022afa4eefd40e641f6ed56e1e6ab9b04da48e951fb77c3078cfebe4b13665a9b421f683422a2a4df8b9033feabc.bin]]

```
3. Update relationship definition. It is defined in the `tuple.json`. It is used for initialized the first actor permission in ory. Orange should support setup relationship in UI in future.

4. Upload latest relationship to ory by command.

```shell
  # 1. create relationship
  ory create relationships relationships.json
  # outputs:
  # NAMESPACE	    OBJECT				               RELATION NAME SUBJECT
  # Actor		      heartbeat-user			         user		       zhang@heartbeat-med.de
  # Group		      heartbeat-developer-group	   members		   zhang@heartbeat-med.de
  # Organisation	heartbeat			               reader		     Group:heartbeat-developer-group#members
  # Folder		    heartbeat-permission		     parent		     Organisation:heartbeat
  # File		      heartbeat-permission-read	   parent		     Folder:heartbeat-permission

  # 2. check permission
  ory is allowed zhang@heartbeat-med.de read Folder heartbeat-permission
  # outputs:
  # Allowed
```
5. <b>TODO:</b> Is it correct way to define permission rule

6. TODO: Use ory sdk PermissionApi or REST API to check permission

7. TODO: Identity: how to identify Ojbect or Subject. For example user actor `subject_id`

8. TODO: How to do permission check? Do we store all the permissions for one user in cookie after user login? Or do we call API to check permission each time when user request to access resources?

