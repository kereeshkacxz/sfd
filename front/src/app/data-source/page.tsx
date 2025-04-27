"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex, Text, Link } from "@gravity-ui/uikit";
import List from "@/components/List/List"; // твоя компонента
import { isAdminWithRedirect } from "@/components";

export default function DataSourcesPage() {
    isAdminWithRedirect();
    const [selectedDataSources, setSelectedDataSources] = useState<number[]>([]);
    const router = useRouter();

    // Моковые данные источников данных
    const dataSources = [
        { id: 1, name: "PostgreSQL база данных" },
        { id: 2, name: "API внешнего сервиса" },
        { id: 3, name: "Google Sheets" },
        { id: 4, name: "Файловое хранилище" },
    ];

    const handleSelectDataSource = (id: number) => {
        setSelectedDataSources((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((sourceId) => sourceId !== id)
                : [...prevSelected, id]
        );
    };

    const dataSourceItems = dataSources.map((source) => ({
        id: source.id,
        title: (
            <Link 
                view="primary" 
                href={`/data-source/${source.id}`}
                onClick={(e) => {
                    e.stopPropagation(); // Останавливаем всплытие, чтобы не выбрать чекбокс
                }}
            >
                {source.name}
            </Link>
        )
    }));

    return (
        <Flex direction="column" alignItems="center" style={{ marginTop: "40px" }} gap="4">
            <Text variant="header-2">Источники данных</Text>
            <List
                items={dataSourceItems}
                selectedItems={selectedDataSources}
                onItemSelect={handleSelectDataSource}
                textIfNull="Нет источников данных"
                withCheckbox={true}
                baseHref="/data-source" // базовый путь нужен, если без Link, но тут мы внутри title уже обернули
            />
        </Flex>
    );
}