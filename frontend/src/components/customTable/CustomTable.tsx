import React from 'react';
import { ConfigProvider, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';

interface ITableProps<T> {
  columns: ColumnsType<T>;
  data: T[];
  title?: React.ReactNode;
  footer?: React.ReactNode;
  pagination?: false | TablePaginationConfig;
}

export const CustomTable = <T,>({
  columns,
  data,
  pagination
} : ITableProps<T>) => {
  return (
    <ConfigProvider>
      <Table 
      columns={columns} 
      dataSource={data} 
      pagination={pagination} />
    </ConfigProvider>
  )
}
