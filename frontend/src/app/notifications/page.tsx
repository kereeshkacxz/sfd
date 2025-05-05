'use client';
import List from '@/components/List/List';
import {Button, Checkbox, Flex, Text, useToaster} from '@gravity-ui/uikit';
import {useEffect, useState} from 'react';
import styles from './notifications.module.scss';

export default function NotificationsPage() {
    const {add} = useToaster();

    const [items, setItems] = useState([
        {
            id: 1,
            title: 'One',
            subtitle:
                'First item in the list First item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the list',
        },
        {id: 2, title: 'Two', subtitle: 'Second item with description'},
        {id: 3, title: 'Three', subtitle: 'Third element with details'},
        {id: 4, title: 'Four', subtitle: 'Fourth position in sequence'},
        {id: 5, title: 'Five', subtitle: 'Middle of the list'},
        {id: 6, title: 'Five', subtitle: 'Middle of the list'},
        {id: 7, title: 'Five', subtitle: 'Middle of the list'},
        {id: 8, title: 'Five', subtitle: 'Middle of the list'},
        {id: 9, title: 'Five', subtitle: 'Middle of the list'},
        {id: 10, title: 'Five', subtitle: 'Middle of the list'},
        {id: 11, title: 'Five', subtitle: 'Middle of the list'},
        {id: 12, title: 'Five', subtitle: 'Middle of the list'},
        {id: 13, title: 'Five', subtitle: 'Middle of the list'},
    ]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    useEffect(() => {
        if (items.length > 0 && selectedItems.length === items.length) {
            setIsAllSelected(true);
        } else {
            setIsAllSelected(false);
        }
    }, [selectedItems, items]);

    const toggleIsAllSelected = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            const allIds = items.map((item) => item.id);
            setSelectedItems(allIds);
        }
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

        const handleCloseTasks = () => {
            setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
            add({
                title: `Уведомлени${selectedItems.length < 2 ? 'е' : 'я'} успешно закрыт${selectedItems.length < 2 ? 'a' : 'ы'}!`,
                name: 'notifications_successful_ended',
                theme: 'success',
                autoHiding: 2000,
            });
            setSelectedItems([]);
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
                    Удалить выбранные уведомления
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
                textIfNull={'Нет уведомлений'}
                withCheckbox={true} // Явно указываем, хотя это значение по умолчанию
            />
        </>
    );
}
