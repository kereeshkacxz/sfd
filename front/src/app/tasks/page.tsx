"use client";
import List from "@/components/List/List";
import { Text, Button } from "@gravity-ui/uikit";
import { useState } from "react";

export default function Home() {
    const [items, setItems] = useState([
        { id: 1, title: "One", subtitle: "First item in the list First item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the list" },
        { id: 2, title: "Two", subtitle: "Second item with description" },
        { id: 3, title: "Three", subtitle: "Third element with details" },
        { id: 4, title: "Four", subtitle: "Fourth position in sequence" },
        { id: 5, title: "Five", subtitle: "Middle of the list" },
        { id: 6, title: "Five", subtitle: "Middle of the list" },
        { id: 7, title: "Five", subtitle: "Middle of the list" },
        { id: 8, title: "Five", subtitle: "Middle of the list" },
        { id: 9, title: "Five", subtitle: "Middle of the list" },
        { id: 10, title: "Five", subtitle: "Middle of the list" },
        { id: 11, title: "Five", subtitle: "Middle of the list" },
        { id: 12, title: "Five", subtitle: "Middle of the list" },
        { id: 13, title: "Five", subtitle: "Middle of the list" },
    ]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    // Функция для обработки выбора элемента
    const handleItemSelect = (itemId: number) => {
        setSelectedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId) 
                : [...prev, itemId]
        );
    };

    const actions = () => {
        const handleCancel = () => {
            setSelectedItems([]);
        };
        
        const handleCloseTasks = () => {
            setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
            setSelectedItems([]);
        };

        return (
            <>
                <Button
                    view="outlined"
                    size="l"
                    onClick={handleCancel}
                    className="list__button"
                >
                    Отмена
                </Button>
                <Button
                    view="action"
                    size="l"
                    onClick={handleCloseTasks}
                    className="list__button"
                    disabled={selectedItems.length === 0}
                >
                    Закрыть выбранные задачи
                </Button>
            </>
        );
    };

    return (
        <div>
            <Text variant="header-1" className="list-page__title">
                Задачи работника
            </Text>
            <List 
                actions={actions()} 
                items={items} 
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
            />
        </div>
    );
}
