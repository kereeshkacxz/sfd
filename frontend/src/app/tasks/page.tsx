'use client';
import List from '@/components/List/List';
import {Button, Checkbox, Flex, Text, useToaster} from '@gravity-ui/uikit';
import {useEffect, useState} from 'react';
import styles from './tasks.module.scss';
import {apiRequest} from '@/utils';

export default function Home() {
    const {add} = useToaster();

    const [items, setItems] = useState<
        {id: number; title: string; subtitle: string}[]
    >([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const tasks = await apiRequest('/tasks', 'get', undefined, token);
                const mapped = tasks.map((t: any) => ({
                    id: t.id,
                    title: t.title,
                    subtitle: t.description,
                }));
                setItems(mapped);
            } catch (error) {
                console.error('Ошибка при загрузке задач', error);
            }
        };

        fetchTasks();
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

    const actions = () => {
        const handleCancel = () => {
            setSelectedItems([]);
        };

        const handleCloseTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                await apiRequest(
                    '/tasks',
                    'delete',
                    {ids: selectedItems},
                    token,
                );

                setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));

                add({
                    title: `Задач${selectedItems.length < 2 ? 'a' : 'и'} успешно удален${selectedItems.length < 2 ? 'a' : 'ы'}!`,
                    name: 'task_successful_deleted',
                    theme: 'success',
                    autoHiding: 2000,
                });

                setSelectedItems([]);
            } catch (error) {
                console.error('Ошибка при удалении задач:', error);
                add({
                    title: 'Ошибка при удалении задач',
                    name: 'task_delete_error',
                    theme: 'danger',
                });
            }
        };

        return (
            <>
                <Button view="outlined" size="l" onClick={handleCancel} className={styles.button}>
                    Отмена
                </Button>
                <Button
                    view="action"
                    size="l"
                    onClick={handleCloseTasks}
                    className={styles.button}
                    disabled={selectedItems.length === 0}
                >
                    Удалить выбранные задачи
                </Button>
            </>
        );
    };

    return (
        <>
            <Flex
                justifyContent={items.length > 0 ? 'space-between' : 'center'}
                alignItems={'center'}
                width={'394px'}
            >
                <Text variant="header-1">Задачи работника</Text>
                {items.length > 0 && (
                    <Checkbox checked={isAllSelected} onUpdate={toggleIsAllSelected} />
                )}
            </Flex>
            <List
                actions={actions()}
                items={items}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                textIfNull={'Нет активных задач'}
                withCheckbox={true}
            />
        </>
    );
}
