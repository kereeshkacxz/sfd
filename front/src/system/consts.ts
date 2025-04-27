import {
    Star,
    Bell,
    ChartPie,
    Binoculars,
    DatabasesFill
} from '@gravity-ui/icons';
import Avatar from '@/assets/icons/avatar.svg'
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
    {
        id: 'accounts',
        icon: Avatar,
        currentItemUrl: 'accounts',
        title: "Аккаунты",
        admin: true
    },
    {
        id: 'triggers',
        icon: Binoculars,
        currentItemUrl: 'triggers',
        title: "Триггеры",
        admin: true
    },
    {
        id: 'data-source',
        icon: DatabasesFill,
        currentItemUrl: 'data-source',
        title: "Источники данных",
        admin: true

    },
]