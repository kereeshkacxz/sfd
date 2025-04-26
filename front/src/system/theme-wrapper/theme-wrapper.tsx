'use client';

import React from 'react';
import block from 'bem-cn-lite';
import {Button, Icon} from '@gravity-ui/uikit';
import {Moon, Sun} from '@gravity-ui/icons';

import styles from './theme-wrapper.module.scss';

const b = block('wrapper');

export const DARK = 'dark';
const LIGHT = 'light';
export const DEFAULT_THEME = DARK;

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`;

export type AppProps = {
    children: React.ReactNode;
    setTheme: (theme: string) => void;
    isDark: boolean;
};

export const ThemeWrapper: React.FC<AppProps> = ({children, setTheme, isDark}) => {
    return (
        <div className={styles.root}>
            <div className={styles.themeButton}>
                <Button
                    size="l"
                    view="outlined"
                    onClick={() => {
                        setTheme(isDark ? LIGHT : DARK);
                    }}
                >
                    <Icon data={isDark ? Sun : Moon} />
                </Button>
            </div>
            <div className={styles.layout}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};
