import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

export const ITEM_PER_PAGE = 10;

export const ActionsColumn = {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: () => {
        return(
            <Space>
                <Button type="link" icon={<EditOutlined />} />
                <Button type="link" danger icon={<DeleteOutlined />} />
            </Space>
        )
    }
}





