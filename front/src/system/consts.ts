import {
    Star,
    Bell,
    ChartPie
} from '@gravity-ui/icons';
import { MenuItemMainInfo } from './types';

export const MenuItemsInfo: MenuItemMainInfo[] = [
    {
        id: 'tasks',
        icon: Star,
        currentItemUrl: 'tasks',
        title: "Задачи"
    },
    {
        id: 'notifications',
        icon: Bell,
        currentItemUrl: 'notifications',
        title: "Уведомления"
    },
    {
        id: 'statistics',
        icon: ChartPie,
        currentItemUrl: 'statistics',
        title: "Статистика"
    },
]