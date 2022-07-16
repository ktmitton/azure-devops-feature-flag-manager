import { getInput, setVariable, setResult, TaskResult, getEndpointAuthorizationParameterRequired, getEndpointDataParameterRequired, getEndpointUrlRequired } from 'azure-pipelines-task-lib';
import fetch from 'node-fetch';

async function run() {
  try {
    const credentialsId = getInput("VaultCredentials", false) || '';
    const serverUrl = getEndpointUrlRequired(credentialsId);
    const roleId = getEndpointAuthorizationParameterRequired(credentialsId, 'roleId');
    const secretId = getEndpointAuthorizationParameterRequired(credentialsId, 'secretId');

    const hashicorpId = getInput("HashicorpRoles", false) || '';
    const vaultRole = getEndpointDataParameterRequired(hashicorpId, 'vaultRole');
    const consulRole = getEndpointDataParameterRequired(hashicorpId, 'consulRole');

    console.log('roleId', roleId);
    console.log('secretId', secretId);
    const login = await fetch(`${serverUrl}/v1/auth/approle/login`, {
      method: 'POST',
      body: JSON.stringify({ 'role_id': roleId, 'secret_id': secretId })
    });
    console.log('login', login);
    const loginDetails = await login.json() as any;
    console.log('loginDetails', loginDetails);
    const loginToken = loginDetails.auth.client_token;

    const vault = await fetch(`${serverUrl}/v1/auth/token/create/${vaultRole}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginToken}`
      },
      body: JSON.stringify({})
    });
    const vaultDetails = await vault.json() as any;
    const vaultToken = vaultDetails.auth.client_token;

    const consul = await fetch(`${serverUrl}/v1/consul/creds/${consulRole}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginToken}`
      },
      body: JSON.stringify({})
    });
    const consulDetails = await consul.json() as any;
    const consulToken = vaultDetails.auth.client_token;

    console.log('vault', vaultDetails);
    console.log('consul', consulDetails);

    setVariable("loginToken", loginToken, false, false);
    setVariable("vaultToken", vaultToken, false, false);
    setVariable("consulToken", consulToken, false, false);
  }
  catch (err: any) {
    setResult(TaskResult.Failed, err.message);
  }
}

run();