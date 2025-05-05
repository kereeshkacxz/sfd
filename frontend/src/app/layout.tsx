import type {Metadata} from 'next';
import {App, DEFAULT_BODY_CLASSNAME} from '../system';

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import '../styles/globals.scss';

export const metadata: Metadata = {
    title: 'Smart Factory Dashboard',
    icons: {
        icon: './favicon.ico',
    },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body className={DEFAULT_BODY_CLASSNAME}>
                <App>{children}</App>
            </body>
        </html>
    );
}
