'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Theme, ThemeProvider, ToasterComponent, ToasterProvider } from '@gravity-ui/uikit';
import { AsideHeader, FooterItem, LogoProps } from '@gravity-ui/navigation';
import SFDImage from '../assets/icons/sfd.svg'; 
import { DARK, DEFAULT_THEME, ThemeWrapper } from './theme-wrapper';
import styles from './app.module.scss';
import { useMenuItems } from './hooks/use-menu-items';
import { MenuItemsInfo } from './consts';
import { useRouter } from 'next/navigation';
import { toaster } from '@gravity-ui/uikit/toaster-singleton';
import Authentication from '@/app/authentication/page';
import { ArrowRightFromSquare } from '@gravity-ui/icons';

interface AppProps {
    children: React.ReactNode;
}

// Create a separate handler for authentication reload
let reloadAuthHandler: (() => void) | null = null;

export const App: React.FC<AppProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
    const isDark = theme === DARK;
    const [isCompact, setIsCompact] = useState(false);
    const router = useRouter();
    // Safe client-side initialization
    const [curPage, setCurPage] = useState('');
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    // Set curPage after component mounts
    useEffect(() => {
        setCurPage(window.location.href.split('/')[3]);
    }, []);

    const reload = () => {
        setIsAuthorized(localStorage.getItem('token') !== null);
        items = useMenuItems(MenuItemsInfo, curPage, setCurPage);

    };

    // Assign the reload function to our handler
    useLayoutEffect(() => {
        reloadAuthHandler = reload;
        reload();
    }, []);

    const onChangeCompact = () => {
        setIsCompact(!isCompact);
    };
    
    let items = useMenuItems(MenuItemsInfo, curPage, setCurPage);

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
            <ToasterProvider toaster={toaster}>
                {isAuthorized ? (
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
                        multipleTooltip
                        renderFooter={
                            ({compact, asideRef}) => (
                                <React.Fragment><FooterItem
                            item={{
                                id: 'logout',
                                icon: ArrowRightFromSquare,
                                title: 'Выход',
                                tooltipText: 'Выход',
                                onItemClick: () => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('admin');
                                    localStorage.removeItem('siperadmin');
                                    reload();
                                },
                            }}
                            compact={compact}
                        />
                    </React.Fragment>)}
                    />
                ) : (
                    <ThemeWrapper setTheme={setTheme} isDark={isDark}>
                        <Authentication/>
                    </ThemeWrapper>
                )}
                <ToasterComponent />
            </ToasterProvider>
        </ThemeProvider>
    );
};

// Export a function that calls the handler if it exists
export function reloadAuth() {
    if (reloadAuthHandler) {
        reloadAuthHandler();
    }
}
