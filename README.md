# Overview

This extension allows users to manage configuration values through a more convenient UI for feature flags or other similar toggles. The advantage this has over simply using library variables is that, in addition to having a better UX, it provides an audit log for changes made by users. 


To accomplish this, it requires access to the **following [scopes](https://docs.microsoft.com/en-us/azure/devops/extend/develop/manifest?view=azure-devops#scopes)**:
* `vso.code_write` - Needed to save value changes and log the action
* `vso.extension.data_write` - Needed to configure the git repository used to maintain values (so you are not required to select the repo each time you load the extension)
* `vso.graph` - Used to query for security permissions
* `vso.identity` - Used to identify the current user

---

To get started, **follow these steps**:
1. Create a new git repository in the project you want to host a collection of configuration values
1. Open up the project and select the Feature Flags hub in ADO
1.  During initialization, it will report an error stating it does not know which repository to use. Click the 'Set Repository' button and pick the repo you created in step 1:
![error1](https://user-images.githubusercontent.com/103285014/169904218-2c17955c-bd0a-42ac-a40a-aa249297f36d.png)

1. After you pick the repository, you will get another error stating there is no `manifest.json` file. Click the `Create File` button once you receive the error message:
![error2](https://user-images.githubusercontent.com/103285014/169904356-4da28826-169f-4563-bbc6-2498d63c80cb.png)

1. You should now be able to see any configured values
    * The template has no settings - you currently need to manually edit the `manifest.json` file to add new environments/values. Until functionality is added to the UI to support this, [example-manifest.json](/example-manifest.json) can be used as a reference to show the capabilities of the tool.
      * Below is an example of what you should see when the extension is loaded using the `example-manifest.json` file:
      
 ![finaloutput](https://user-images.githubusercontent.com/103285014/169904865-4579e944-7ec2-4368-9db5-541ac609b4e7.png)


---

**Final notes**:

Once you have configurations set up, you can then create pipelines that monitor the main branch in the repository for changes. The pipelines can then deploy those changes to the appropriate destination(s), such as Consul or Vault.

Currently there are no security restrictions being enforced, allowing anybody with access to the project the abililty to access the extension. If you would like to limit write access to the settings, this can be managed through normal security policies on the git repository.

## Contributing

### Thanks to all the people who have contributed!

[![contributors](https://contrib.rocks/image?repo=ktmitton/azure-devops-feature-flag-manager)](https://github.com/ktmitton/azure-devops-feature-flag-manager/graphs/contributors)

Made with [contrib.rocks](https://contrib.rocks).
