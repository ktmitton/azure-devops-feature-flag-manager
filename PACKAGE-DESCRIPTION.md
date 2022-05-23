# Overview

This extension allows users to manage configuration values through a UI more condusive to feature flags or other similar toggles. The advantage this has over just using library variables, in addition to a better UX, is that it can track changes and report on who changed what and when.

To accomplish this, it requires access to the following scopes:
* vso.code_write - Needed to save value changes and log the action
* vso.extension.data_write - Needed to configure the git repository used to maintain values, so you don't need to pick it every time you load the extension
* vso.graph - Used to query for security permissions
* vso.identity - Used to identify the current user

To get started, follow these steps:
* Create a new git repository in the project you want to host a collection of configuration values
* Open up the project, and select the Feature Flags hub in ADO
* During initialization, it will report an error that it doesn't know the repository to use, so click the 'Set Repository' and pick the one you created in step 1
* After you pick the repository, you will get another error that there is no `manifest.json` file, so you will need to click the button that `Create File` button
* You should now be able to see any configured values
  * The template has no settings, you currently need to manually edit the `manifest.json` file to add new environments/values (Should we include a sample file?)

Once you have configurations set up, you can then create pipelines that monitor the main branch in the repository for changes, and will deploy those changes to the appropriate destination(s), such as Consul or Vault.

Currently there are no security restirctions being enforced, so anybody with acces to the project can access the extension. If you would like to limit write access to the settings, this can be managed through normal security policies on the git repository.
