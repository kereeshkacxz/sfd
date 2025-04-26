import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { MenuItem } from '@gravity-ui/navigation';

import styles from './use-menu-items.module.scss';
import { MenuItemMainInfo } from '../types';
import Link from 'next/link';

export const useMenuItems = (items: MenuItemMainInfo[], curPage: string, setCurPage: Dispatch<SetStateAction<string>>): MenuItem[] => {

    return useMemo((): MenuItem[] => {
        const menuItems: MenuItem[] = [];
        items.forEach((item) => {
            const isCurrent = item.currentItemUrl === curPage; 
            console.log(curPage, item.currentItemUrl)
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
                            href={item.id} 
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
