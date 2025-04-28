import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { CustomPopconfirm, IPopconfirmProps } from '../components/customPopconfirm/CustomPopconfirm';

export const ITEM_PER_PAGE = 10;

export const ActionsColumn = {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (onClickEdit : any, popConfirmProps : IPopconfirmProps) => {
        return(
            <Space>
                <Button type="link" icon={<EditOutlined />} onClick={onClickEdit}/>
                <CustomPopconfirm
                    {...popConfirmProps}
                >
                    <Button type="link" danger icon={<DeleteOutlined />}/>
                </CustomPopconfirm>
            </Space>
        )
    }
}





