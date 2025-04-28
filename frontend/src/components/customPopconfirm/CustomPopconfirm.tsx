import { Popconfirm } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";

export interface IPopconfirmProps {
    placement: TooltipPlacement | undefined
    title: string;
    description: string;
    okText?: string;
    cancelText?: string;
    onConfirm?: any;
    children?: React.ReactNode;
}

export const CustomPopconfirm = ({
    placement,
    title, 
    description,
    okText,
    cancelText,
    onConfirm,
    children
} : IPopconfirmProps) => {
    return (
        <Popconfirm
            placement={placement}
            title={title}
            description={description}
            okText={okText}
            cancelText={cancelText}
            onConfirm={onConfirm}
        >
            {children}
        </Popconfirm>
    )
}