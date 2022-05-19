import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { ITableColumn, SimpleTableCell, Table, TableColumnLayout, TwoLineTableCell } from "azure-devops-ui/Table";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import React, { useContext } from "react";
import { ChangeLogContext } from "../Contexts/ChangeLogContext";
import { FeaturesOverviewContext } from "../Contexts/FeaturesOverviewContext";
import { RepositoryContext } from "../Contexts/RepositoryContext";
import { ManifestFileSelector } from "./ManifestFileSelector";
import { RepositorySelector } from "./RepositorySelector";

interface IStepItem {
  statusProps: IStatusProps;
  description: string;
  result: { line1?: string, line2?: string }
}

const renderStepColumn = (
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IStepItem>,
  tableItem: IStepItem
) => {
  return (
    <SimpleTableCell
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      key={"col-" + columnIndex}
      contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
    >
      <Status
        {...tableItem.statusProps}
        className="icon-large-margin"
        size={StatusSize.xl}
      />
      <div className="flex-row scroll-hidden">
        <Tooltip overflowOnly={true}>
          <span className="text-ellipsis">{tableItem.description}</span>
        </Tooltip>
      </div>
    </SimpleTableCell>
  );
};

const renderResultColumn = (
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IStepItem>,
  tableItem: IStepItem
) => {
  return (
    <TwoLineTableCell
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      key={"col-" + columnIndex}
      className="bolt-table-cell-content-with-inline-link no-v-padding"
      line1={tableItem.result.line1}
      line2={tableItem.result.line2}
    />
  );
};

const Initializer = () => {
  const { project, repository, needsConfigured } = useContext(RepositoryContext);
  const { isUpdating: isChangeLogUpdating, commitReferences } = useContext(ChangeLogContext);
  const { isLocked: isFeaturesOverviewChanging } = useContext(FeaturesOverviewContext);

  const projectStatus: IStepItem = {
    statusProps: Statuses.Running,
    description: "Load Project Information",
    result: { line1: undefined, line2: undefined }
  };

  if (project !== undefined) {
    projectStatus.statusProps = Statuses.Success;
    projectStatus.result = {
      line1: project.name,
      line2: project.id
    };
  }

  const repositoryStatus: IStepItem = {
    statusProps: Statuses.Queued,
    description: "Load Repository Information",
    result: { line1: undefined, line2: undefined }
  };

  if (projectStatus.statusProps === Statuses.Success) {
    if (repository !== undefined) {
      repositoryStatus.statusProps = Statuses.Success;
      repositoryStatus.result = {
        line1: repository.name,
        line2: repository.id
      };
    } else if (needsConfigured) {
      repositoryStatus.statusProps = Statuses.Failed;
    } else {
      repositoryStatus.statusProps = Statuses.Running;
    }
  }

  const changeLogStatus: IStepItem = {
    statusProps: Statuses.Queued,
    description: "Load Change Log",
    result: { line1: undefined, line2: undefined }
  };

  if (repositoryStatus.statusProps === Statuses.Success) {
    if (isChangeLogUpdating) {
      changeLogStatus.statusProps = Statuses.Running;
    } else if (commitReferences.length === 0) {
      changeLogStatus.statusProps = Statuses.Failed;
    } else {
      changeLogStatus.statusProps = Statuses.Success;
      changeLogStatus.result = {
        line1: commitReferences[0]?.comment,
        line2: commitReferences[0]?.author?.date?.toLocaleString()
      };
    }
  }

  const featuresOverviewStatus: IStepItem = {
    statusProps: Statuses.Queued,
    description: "Load Features Overview",
    result: { line1: undefined, line2: undefined }
  };

  if (changeLogStatus.statusProps === Statuses.Success) {
    if (isFeaturesOverviewChanging) {
      featuresOverviewStatus.statusProps = Statuses.Running;
    } else {
      featuresOverviewStatus.statusProps = Statuses.Success;
    }
  }

  return (
    <Page className="rhythm-vertical-16">
      {repositoryStatus.statusProps === Statuses.Failed && <RepositorySelector />}
      {changeLogStatus.statusProps === Statuses.Failed && <ManifestFileSelector />}
      <Card className="flex-grow" titleProps={{ text: "Initializing Extension" }} contentProps={{ contentPadding: false }}>
        <Table
          showHeader={false}
          columns={
            [
              {
                columnLayout: TableColumnLayout.singleLine,
                id: "step",
                name: "step",
                readonly: true,
                renderCell: renderStepColumn,
                width: -70
              },
              {
                columnLayout: TableColumnLayout.twoLine,
                id: "result",
                name: "Result",
                readonly: true,
                renderCell: renderResultColumn,
                width: -30
              }
            ] as ITableColumn<IStepItem>[]
          }
          itemProvider={
            new ArrayItemProvider<IStepItem>([
              projectStatus,
              repositoryStatus,
              changeLogStatus,
              featuresOverviewStatus
            ])
          }
          role="table"
        />
      </Card>
    </Page>
  );
}

export { Initializer }
