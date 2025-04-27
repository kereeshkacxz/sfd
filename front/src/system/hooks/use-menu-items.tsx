import { Dispatch, SetStateAction, useMemo } from 'react';
import { MenuItem } from '@gravity-ui/navigation';

import styles from './use-menu-items.module.scss';
import { MenuItemMainInfo } from '../types';
import Link from 'next/link';
import { isAdmin } from '@/components';

export const useMenuItems = (items: MenuItemMainInfo[], curPage: string, setCurPage: Dispatch<SetStateAction<string>>): MenuItem[] => {
    const isAdminValue = isAdmin();
    return useMemo((): MenuItem[] => {
        const menuItems: MenuItem[] = [];
        items.forEach((item) => {
            const isCurrent = item.currentItemUrl === curPage; 
            if(isAdminValue || item.admin === undefined)
            menuItems.push({
                ...item,
                title: item.title,
                current: isCurrent,
                iconSize: 16,
                pinned: true,
                itemWrapper: (p, makeItem) => {
                    const component = makeItem(p);
                    return (
                        <Link
                            className={styles.linkWrapper}
                            href={`/${item.id}`} 
                            onClick={() => {setCurPage(item.id)}}
                        >
                            {component}
                        </Link>
                    );
                },
            });
        });
        return menuItems;
    }, [items, curPage]);
};
