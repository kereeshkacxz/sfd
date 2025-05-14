'use client';
import List from '@/components/List/List';
import {Button, Checkbox, Flex, Text, useToaster} from '@gravity-ui/uikit';
import {useEffect, useState} from 'react';
import styles from './notifications.module.scss';
import {apiRequest} from '@/utils';

export default function NotificationsPage() {
    const {add} = useToaster();

    const [items, setItems] = useState<
        {id: number; title: string; subtitle: string}[]
    >([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const notifications = await apiRequest('/notifications', 'get', undefined, token);
                const mapped = notifications.map((n: any) => ({
                    id: n.id,
                    title: `Уведомление #${n.id}`,
                    subtitle: n.message,
                }));
                setItems(mapped);
            } catch (error) {
                console.error('Ошибка при загрузке уведомлений', error);
                add({
                    title: 'Ошибка при загрузке уведомлений',
                    name: 'notifications_fetch_error',
                    theme: 'danger',
                });
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        setIsAllSelected(items.length > 0 && selectedItems.length === items.length);
    }, [selectedItems, items]);

    const toggleIsAllSelected = () => {
        setSelectedItems(isAllSelected ? [] : items.map((item) => item.id));
    };

    const handleItemSelect = (itemId: number) => {
        setSelectedItems((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
        );
    };

    const handleDeleteNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await apiRequest('/notifications', 'delete', selectedItems, token);

            setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));

            add({
                title: `Уведомлени${selectedItems.length < 2 ? 'е' : 'я'} успешно удален${selectedItems.length < 2 ? 'о' : 'ы'}!`,
                name: 'notifications_deleted',
                theme: 'success',
                autoHiding: 2000,
            });

            setSelectedItems([]);
        } catch (error) {
            console.error('Ошибка при удалении уведомлений:', error);
            add({
                title: 'Ошибка при удалении уведомлений',
                name: 'notifications_delete_error',
                theme: 'danger',
            });
        }
    };

    const actions = () => (
        <>
            <Button view="outlined" size="l" onClick={() => setSelectedItems([])} className={styles.button}>
                Отмена
            </Button>
            <Button
                view="action"
                size="l"
                onClick={handleDeleteNotifications}
                className={styles.button}
                disabled={selectedItems.length === 0}
            >
                Удалить выбранные уведомления
            </Button>
        </>
    );

    return (
        <>
            <Flex
                justifyContent={items.length > 0 ? 'space-between' : 'center'}
                alignItems="center"
                width="394px"
            >
                <Text variant="header-1">Уведомления</Text>
                {items.length > 0 && (
                    <Checkbox checked={isAllSelected} onUpdate={toggleIsAllSelected} />
                )}
            </Flex>
            <List
                actions={actions()}
                items={items}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                textIfNull="Нет уведомлений"
                withCheckbox={true}
            />
        </>
    );
}
