import React, { useContext, useEffect, useState } from 'react';
import { Dialog } from 'azure-devops-ui/Dialog';
import { GitRepository } from 'azure-devops-extension-api/Git/Git';
import { Dropdown } from 'azure-devops-ui/Dropdown';
import { getClient } from 'azure-devops-extension-api';
import { RepositoryContext } from '../Contexts/RepositoryContext';
import { ListSelection } from 'azure-devops-ui/List';
import { GitRestClient } from 'azure-devops-extension-api/Git/GitClient';

const RepositorySelectionDialog = ({ onDismiss }: { onDismiss: (repository?: GitRepository) => void }) => {
  const { project, repository } = useContext(RepositoryContext);
  const [availableRepositories, setAvailableRepositories] = useState<GitRepository[]>();
  const [selectedRepository, setSelectedRepository] = useState(repository);
  const [listSelection] = useState(new ListSelection());

  if (selectedRepository !== undefined) {
    listSelection.select(availableRepositories?.findIndex(x => x.id === selectedRepository?.id) || 0);
  }

  const loadAvailableRepositoriesEffect = () => {
    let canUpdate = true;

    if (project !== undefined) {
      getClient(GitRestClient).getRepositories(project?.id)
        .then(repositories => {
          if (canUpdate) {
            setAvailableRepositories(repositories);
            setSelectedRepository(undefined);
          }
        });
    }

    return () => { canUpdate = false; };
  }

  useEffect(() => loadAvailableRepositoriesEffect(), [project]);

  return (
    <Dialog
      titleProps={{ text: 'Set Repository' }}
      footerButtonProps={[
        {
          text: 'Cancel',
          onClick: () => onDismiss()
        },
        {
          text: 'Save Changes',
          onClick: () => {
            onDismiss(selectedRepository);
          },
          primary: true,
          disabled: (selectedRepository === undefined || selectedRepository.id === repository?.id)
        }
      ]}
      onDismiss={() => onDismiss()}
    >
      <p>
        The selected repository is where feature flag values will be saved.
        It is recommended that this be a repository whose use is solely for this extension, as it will be performing writes directly to the main branch.
      </p>
      <Dropdown
        items={availableRepositories?.map(x => { return { id: x.id, text: x.name }; }) || []}
        onSelect={(e, i) => { setSelectedRepository(availableRepositories?.find(x => x.id === i.id)) }}
        placeholder='Select One'
        dismissOnSelect={true}
        selection={listSelection}
        loading={availableRepositories === undefined}
      />
    </Dialog>
  );
};

export { RepositorySelectionDialog }
