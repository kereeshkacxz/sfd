"use client";

import { useState } from "react";
import { Flex, Text, Link, Button, Modal } from "@gravity-ui/uikit";
import List from "@/components/List/List";
import { isAdminWithRedirect } from "@/components";
import DynamicForm, { Field } from "@/components/Form/Form";

export default function DataSourcesPage() {
    isAdminWithRedirect();
    const [selectedDataSources, setSelectedDataSources] = useState<number[]>([]);
    const [isFormVisible, setFormVisible] = useState(false);

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
                    e.stopPropagation();
                }}
            >
                {source.name}
            </Link>
        )
    }));

    const handleAddDataSource = () => {
        setFormVisible(true);
    };

    const handleCloseModal = () => {
        setFormVisible(false);
    };

    // Поля для формы создания источника данных
    const formFields: Field[] = [
        { name: "name", label: "Название источника данных", type: "text" },
        { name: "config", label: "Конфигурационный файл (JSON)", type: "file" },
    ];

    return (
        <Flex direction="column" alignItems="center" style={{ marginTop: "40px" }} gap="4">
            <Text variant="header-2">Источники данных</Text>
            <List
                items={dataSourceItems}
                selectedItems={selectedDataSources}
                onItemSelect={handleSelectDataSource}
                textIfNull="Нет источников данных"
                withCheckbox={true}
                baseHref="/data-source"
            />
            
            <div style={{ width: "100%", maxWidth: "500px", marginTop: "20px" }}>
                <Button 
                    view="action"
                    size="l" 
                    onClick={handleAddDataSource} 
                    style={{ width: "100%" }}
                >
                    Добавить источник данных
                </Button>
            </div>

            <Modal
                open={isFormVisible}
                onClose={handleCloseModal}
            >
                <div style={{ padding: "20px", maxWidth: "600px" }}>
                    <Flex justifyContent="center" style={{ marginBottom: "20px" }}>
                        <Text variant="header-1">
                            Создание источника данных
                        </Text>
                    </Flex>
                    <DynamicForm 
                        initialData={{}} 
                        fields={formFields} 
                    />
                </div>
            </Modal>
        </Flex>
    );
}