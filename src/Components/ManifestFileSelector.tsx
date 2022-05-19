import React, { useContext, useState } from "react";
import { RepositoryContext } from "../Contexts/RepositoryContext";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { ChangeLogContext } from "../Contexts/ChangeLogContext";
import { RepositorySelectionDialog } from "./RepositorySelectionDialog";
import { saveSetting } from "../Services/ExtensionSettingsService";
import { writeFile } from "../Services/GitService";

const ManifestFileSelector = () => {
  const { project, repository, refresh: refreshRepository } = useContext(RepositoryContext);
  const { refresh: refreshChangeLog } = useContext(ChangeLogContext);
  const [showRepositorySelectionDialog, setShowRepositorySelectionDialog] = useState(false);

  return (
    <>
      <MessageCard
        buttonProps={[
          {
            text: 'Create File',
            onClick: async () => {
              if (project !== undefined && repository !== undefined) {
                await writeFile(project.id, repository.id, '/manifest.json', 'Initial commit', JSON.stringify({ version: "1.0", environments: [], featureGroups: [] }, null, 2));

                refreshChangeLog();
              }
            }
          },
          {
            text: 'Change Repository',
            onClick: () => setShowRepositorySelectionDialog(true)
          }
        ]}
        className='flex-self-stretch'
        severity={MessageCardSeverity.Error}
      >
        {'Unable to locate /manifest.json on branch [main].'}
      </MessageCard>
      {showRepositorySelectionDialog && (
        <RepositorySelectionDialog onDismiss={async (selectedRepository) => {
          if (selectedRepository !== undefined && project !== undefined) {
            await saveSetting(project.id, 'RepositoryId', selectedRepository.id);

            refreshRepository();
          } else {
            setShowRepositorySelectionDialog(false);
          }
        }} />
      )}
    </>
  );
}

export { ManifestFileSelector }
