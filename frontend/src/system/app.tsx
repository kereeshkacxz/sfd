'use client';

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Loader, Theme, ThemeProvider, ToasterComponent, ToasterProvider} from '@gravity-ui/uikit';
import {AsideHeader, FooterItem, LogoProps} from '@gravity-ui/navigation';
import SFDImage from '../assets/icons/sfd.svg';
import {DARK, DEFAULT_THEME, ThemeWrapper} from './theme-wrapper';
import styles from './app.module.scss';
import {useMenuItems} from './hooks/use-menu-items';
import {MenuItemsInfo} from './consts';
import {useRouter} from 'next/navigation';
import {toaster} from '@gravity-ui/uikit/toaster-singleton';
import Authentication from '@/app/authentication/page';
import {ArrowRightFromSquare} from '@gravity-ui/icons';

interface AppProps {
    children: React.ReactNode;
}

let reloadAuthHandler: (() => void) | null = null;

export const App: React.FC<AppProps> = ({children}) => {
    const [theme, setTheme] = useState<Theme | undefined>(undefined);
    const isDark = theme === DARK;
    const [isCompact, setIsCompact] = useState(false);
    const router = useRouter();
    const [curPage, setCurPage] = useState('');
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useLayoutEffect(() => {
        // curPage
        setCurPage(window.location.href.split('/')[3]);
        // авторизация
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoading(false);
        const lsTheme = localStorage.getItem('theme') as Theme | null;
        setTheme(lsTheme ?? DEFAULT_THEME);
    }, []);

    let items = useMenuItems(MenuItemsInfo, curPage, setCurPage);

    const reload = () => {
        setIsLoading(true);
        setTheme(localStorage.getItem('theme') ?? DEFAULT_THEME);
        setIsAuthorized(Boolean(localStorage.getItem('token')));
        setIsLoading(false);
        items = useMenuItems(MenuItemsInfo, curPage, setCurPage);
    };

    useEffect(() => {
        reloadAuthHandler = reload;
        // не вызываем reload здесь — иначе Loader мгновенно исчезнет
    }, []);

    const onChangeCompact = () => {
        setIsCompact(!isCompact);
    };

    const asideHeaderContent: LogoProps = {
        icon: SFDImage,
        text: () => (
            <span>
                Smart Factory <br /> Dashboard
            </span>
        ),
        iconSize: 32,
        iconClassName: styles.logo,
        onClick: () => {
            router.push('/');
            setCurPage('');
        },
    };

    // Пока тема не определена или идет загрузка - показываем Loader
    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundColor: theme === 'light' ? 'white' : 'none',
                }}
            >
                <ThemeWrapper setTheme={setTheme} isDark={isDark}>
                    <Loader size="l" />
                </ThemeWrapper>
            </div>
        );
    }

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
                        renderFooter={({compact}) => (
                            <>
                                <FooterItem
                                    item={{
                                        id: 'logout',
                                        icon: ArrowRightFromSquare,
                                        title: 'Выход',
                                        tooltipText: 'Выход',
                                        onItemClick: () => {
                                            setIsLoading(true);
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('admin');
                                            localStorage.removeItem('superadmin');
                                            reload();
                                        },
                                    }}
                                    compact={compact}
                                />
                            </>
                        )}
                    />
                ) : (
                    <ThemeWrapper setTheme={setTheme} isDark={isDark}>
                        <Authentication />
                    </ThemeWrapper>
                )}
                <ToasterComponent />
            </ToasterProvider>
        </ThemeProvider>
    );
};

// Экспорт перезагрузки авторизации (чтобы с других компонентов можно было дергать)
export function reloadAuth() {
    if (reloadAuthHandler) {
        reloadAuthHandler();
    }
}
