'use client';

import React, { useState } from 'react';
import { Theme, ThemeProvider } from '@gravity-ui/uikit';
import { AsideHeader, LogoProps } from '@gravity-ui/navigation';
import SFDImage from '../assets/icons/sfd.svg'; 
import { DARK, DEFAULT_THEME, ThemeWrapper } from './theme-wrapper';
import styles from './app.module.scss';
import { useMenuItems } from './hooks/use-menu-items';
import { MenuItemsInfo } from './consts';
import { useRouter } from 'next/navigation';
interface AppProps {
    children: React.ReactNode;
}

export const App: React.FC<AppProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
    const isDark = theme === DARK;
    const [isCompact, setIsCompact] = useState(false);
    const router = useRouter()
    const [curPage, setCurPage] = useState(window.location.href.split('/')[3]);
    

    const onChangeCompact = () => {
        setIsCompact(!isCompact);
    };
    const items = useMenuItems(MenuItemsInfo, curPage, setCurPage);

    const asideHeaderContent: LogoProps = {
        icon: SFDImage,
        text: () => (
            <span>
                Smart Factory <br /> Dashboard
            </span>
        ),
        iconSize: 32,
        iconClassName: styles.logo,
        onClick: () => {router.push('/'); setCurPage('')}
    };

    return (
        <ThemeProvider theme={theme} rootClassName={styles.root}>
                <AsideHeader
                    logo={asideHeaderContent}
                    compact={isCompact}
                    onChangeCompact={onChangeCompact}
                    renderContent={() => (
                        <ThemeWrapper setTheme={setTheme} isDark={isDark}>
                            {children}
                        </ThemeWrapper>
                    )}
                    headerDecoration
                    menuItems={items}
                />
        </ThemeProvider>
    );
};
