"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Flex, Text, Link, Button, Modal } from "@gravity-ui/uikit";
import List from "@/components/List/List";
import { isAdminWithRedirect } from "@/components";
import DynamicForm, { Field } from "@/components/Form/Form";

export default function TriggersPage() {
    isAdminWithRedirect();
    const [selectedTriggers, setSelectedTriggers] = useState<number[]>([]);
    const [isFormVisible, setFormVisible] = useState(false);
    // const router = useRouter();

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
                    e.stopPropagation();
                }}
            >
                {trigger.name}
            </Link>
        )
    }));

    const handleAddTrigger = () => {
        setFormVisible(true);
    };

    const handleCloseModal = () => {
        setFormVisible(false);
    };

    // Поля для формы создания триггера
    const formFields: Field[] = [
        { name: "name", label: "Название триггера", type: "text" },
        { name: "jsonFile", label: "JSON файл конфигурации", type: "file" },
        { name: "action", label: "Действие", type: "text"},
    ];

    return (
        <Flex direction="column" alignItems="center" style={{ marginTop: "40px" }} gap="4">
            <Text variant="header-2">Триггеры</Text>
            <List
                items={triggerItems}
                selectedItems={selectedTriggers}
                onItemSelect={handleSelectTrigger}
                textIfNull="Нет триггеров"
                withCheckbox={true}
                baseHref="/triggers"
            />
            
            <div style={{ width: "100%", maxWidth: "500px", marginTop: "20px" }}>
                <Button 
                    view="action"
                    size="l" 
                    onClick={handleAddTrigger} 
                    style={{ width: "100%" }}
                >
                    Добавить триггер
                </Button>
            </div>

            <Modal
                open={isFormVisible}
                onClose={handleCloseModal}
            >
                <div style={{ padding: "20px", maxWidth: "600px" }}>
                    <Flex justifyContent="center" style={{ marginBottom: "20px" }}>
                        <Text variant="header-1">
                            Создание триггера
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