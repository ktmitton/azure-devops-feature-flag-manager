import React, { useContext } from 'react';
import { ISimpleTableCell, ITableColumn, renderSimpleCell, Table, TableColumnLayout } from 'azure-devops-ui/Table';
import { ArrayItemProvider } from 'azure-devops-ui/Utilities/Provider';
import { Card } from 'azure-devops-ui/Card';
import { ChangeLogContext } from '../Contexts/ChangeLogContext';

const ChangeLog = () => {
  const { commitReferences } = useContext(ChangeLogContext);

  const columns: ITableColumn<ISimpleTableCell>[] = [
    {
      columnLayout: TableColumnLayout.singleLinePrefix,
      id: 'user',
      name: 'User',
      readonly: true,
      renderCell: renderSimpleCell,
      width: -30
    },
    {
      columnLayout: TableColumnLayout.singleLinePrefix,
      id: 'description',
      name: 'Description',
      readonly: true,
      renderCell: renderSimpleCell,
      width: -50
    },
    {
      columnLayout: TableColumnLayout.singleLinePrefix,
      id: 'date',
      name: 'Date',
      readonly: true,
      renderCell: renderSimpleCell,
      width: -20
    }
  ]

  return (
    <Card className='flex-grow'>
      <Table
        columns={columns}
        itemProvider={new ArrayItemProvider<ISimpleTableCell>(commitReferences.map(x => { return { user: x.author.name, description: x.comment, date: x.author.date.toLocaleString() } as ISimpleTableCell; }))}
        role='table'
      />
    </Card>
  );
}

export { ChangeLog }
