export interface ICustomDrawer {
    open: boolean | undefined;
    onClose: (e: React.MouseEvent | React.KeyboardEvent) => void;
    title?: string;
    children?: React.ReactNode;
}