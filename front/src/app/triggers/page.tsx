"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex, Text, Link } from "@gravity-ui/uikit";
import List from "@/components/List/List"; // твоя компонента
import { isAdminWithRedirect } from "@/components";

export default function TriggersPage() {
    isAdminWithRedirect();
    const [selectedTriggers, setSelectedTriggers] = useState<number[]>([]);
    const router = useRouter();

    // Моковые данные триггеров
    const triggers = [
        { id: 1, name: "Триггер запуска процесса" },
        { id: 2, name: "Триггер проверки статуса" },
        { id: 3, name: "Триггер уведомления об ошибке" },
    ];

    const handleSelectTrigger = (id: number) => {
        setSelectedTriggers((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((triggerId) => triggerId !== id)
                : [...prevSelected, id]
        );
    };

    const triggerItems = triggers.map((trigger) => ({
        id: trigger.id,
        title: (
            <Link 
                view="primary" 
                href={`/triggers/${trigger.id}`}
                onClick={(e) => {
                    e.stopPropagation(); // Останавливаем всплытие, чтобы не выбрать чекбокс
                }}
            >
                {trigger.name}
            </Link>
        )
    }));

    return (
        <Flex direction="column" alignItems="center" style={{ marginTop: "40px" }} gap="4">
            <Text variant="header-2">Триггеры</Text>
            <List
                items={triggerItems}
                selectedItems={selectedTriggers}
                onItemSelect={handleSelectTrigger}
                textIfNull="Нет триггеров"
                withCheckbox={true}
                baseHref="/triggers" // базовый путь нужен, если без Link, но тут мы внутри title уже обернули
            />
        </Flex>
    );
}
