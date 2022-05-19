import React, { useContext, useState } from "react";
import { RepositoryContext } from "../Contexts/RepositoryContext";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { saveSetting } from "../Services/ExtensionSettingsService";
import { RepositorySelectionDialog } from "./RepositorySelectionDialog";

const RepositorySelector = () => {
  const { project, refresh } = useContext(RepositoryContext);
  const [showRepositorySelectionDialog, setShowRepositorySelectionDialog] = useState(false);

  return (
    <>
      <MessageCard
        buttonProps={[
          {
            text: 'Set Repository',
            onClick: () => setShowRepositorySelectionDialog(true)
          }
        ]}
        className='flex-self-stretch'
        severity={MessageCardSeverity.Error}
      >
        No repository has been set yet for this project.
      </MessageCard>
      {showRepositorySelectionDialog && (
        <RepositorySelectionDialog onDismiss={async (selectedRepository) => {
          if (selectedRepository !== undefined && project !== undefined) {
            await saveSetting(project.id, 'RepositoryId', selectedRepository.id);

            refresh();
          } else {
            setShowRepositorySelectionDialog(false);
          }
        }} />
      )}
    </>
  );
}

export { RepositorySelector }
