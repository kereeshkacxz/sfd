import { MenuItem } from "@gravity-ui/navigation";

export type MenuItemMainInfo = Pick<MenuItem, 'icon'> & {
    id: string;
    currentItemUrl: string;
    title: string,
    admin?: boolean
};