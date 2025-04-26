'use client';

import React, { useState } from 'react';
import { Theme, ThemeProvider } from '@gravity-ui/uikit';
import { AsideHeader } from '@gravity-ui/navigation';
import SFDImage from '../assets/icons/sfd.svg'; 
import { DARK, DEFAULT_THEME, ThemeWrapper } from './theme-wrapper';
import styles from './app.module.scss';

interface AppProps {
    children: React.ReactNode;
}

export const App: React.FC<AppProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
    const isDark = theme === DARK;
    const [isCompact, setIsCompact] = useState(false);

    const onChangeCompact = () => {
        setIsCompact(!isCompact);
    };

    return (
        <ThemeProvider theme={theme} rootClassName={styles.root}>
            <AsideHeader
                logo={{
                    icon: SFDImage,
                    text: () => (
                        <span>
                            Smart Factory <br /> Dashboard
                        </span>
                    ),
                    iconSize: 32,
                    iconClassName: styles.logo
                }}
                compact={isCompact}
                onChangeCompact={onChangeCompact}
                renderContent={() => (
                    <ThemeWrapper setTheme={setTheme} isDark={isDark}>
                        {children}
                    </ThemeWrapper>
                )}
                headerDecoration
            />
        </ThemeProvider>
    );
};
