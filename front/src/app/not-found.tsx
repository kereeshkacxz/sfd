'use client';

import {Link} from '@gravity-ui/uikit';

export default function NotFound() {
    return (
        <div>
            <h2>Страница не найдена</h2>
            <p>Не удалось найти запрашиваемый ресурс</p>
            <Link href="/">Вернуться на главную</Link>
        </div>
    );
}
