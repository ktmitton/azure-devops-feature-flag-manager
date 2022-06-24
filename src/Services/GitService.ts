import { getClient } from 'azure-devops-extension-api';
import { GitRestClient } from 'azure-devops-extension-api/Git/GitClient';
import { GitPush, GitQueryCommitsCriteria, GitVersionOptions, GitVersionType, ItemContentType, VersionControlChangeType, VersionControlRecursionType } from 'azure-devops-extension-api/Git/Git';

const readFile = async (projectId: string, repositoryId: string, path: string, commitId: string) => {
  const scopePath = undefined;
  const recursionLevel = VersionControlRecursionType.None;
  const includeContentMetadata = false;
  const latestProcessedChange = false;
  const download = false;
  const includeContent = true;
  const resolveLfs = false;

  const versionDescriptor = {
    version: commitId,
    versionOptions: GitVersionOptions.None,
    versionType: GitVersionType.Commit
  };

  const client = getClient(GitRestClient);

  const item = await client.getItem(repositoryId, path, projectId, scopePath, recursionLevel, includeContentMetadata, latestProcessedChange, download, versionDescriptor, includeContent, resolveLfs);

  return item.content;
};

const getRepository = async (projectId: string, repositoryId: string) => {
  const repository = await getClient(GitRestClient).getRepository(repositoryId, projectId);

  repository.defaultBranch = (repository.defaultBranch || 'main').replace(/^refs\/heads\//, '');

  return repository;
}

const getInitialCommitId = async (projectId: string, repositoryId: string, branch: string) => {
  try {
    const commits = await getClient(GitRestClient).getCommits(
      repositoryId, {
        itemPath: '/',
        itemVersion: {
          versionOptions: GitVersionOptions.None,
          versionType: GitVersionType.Branch,
          version: branch
        }
      } as GitQueryCommitsCriteria,
      projectId);

    return commits[0].commitId;
  } catch {
    return '0000000000000000000000000000000000000000';
  }
};

const writeFile = async (projectId: string, repositoryId: string, branch: string, path: string, commitMessage: string, fileContents: string, oldCommitId?: string) => {
  const oldObjectId = oldCommitId || await getInitialCommitId(projectId, repositoryId, branch);
  const changeType = oldCommitId === undefined ? VersionControlChangeType.Add : VersionControlChangeType.Edit;

  const push = {
    commits: [
      {
        changes: [
          {
            changeType: changeType,
            item: {
              path: path,
            },
            newContent: {
              content: fileContents,
              contentType: ItemContentType.RawText
            }
          }
        ],
        comment: commitMessage
      }
    ],
    refUpdates: [
      {
        name: `refs/heads/${branch}`,
        oldObjectId: oldObjectId
      }
    ]
  } as GitPush;

  const client = getClient(GitRestClient);

  await client.createPush(push, repositoryId, projectId);
};

export { getRepository, readFile, writeFile }
