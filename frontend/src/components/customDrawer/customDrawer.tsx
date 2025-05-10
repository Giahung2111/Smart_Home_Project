import { Drawer } from "antd"
import { ICustomDrawer } from "./ICustomDrawer"

export const CustomDrawer = ({open, onClose, title, children} : ICustomDrawer) => {
    return(
        <Drawer
            open={open}
            onClose={onClose}
            title={title}
        >
            {children}
        </Drawer>
    )
}