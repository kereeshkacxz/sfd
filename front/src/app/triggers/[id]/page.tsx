"use client";

import { useParams } from "next/navigation";
import { Flex, Text } from "@gravity-ui/uikit";
import DynamicForm from "@/components/Form/Form"; // твоя компонентка формы
import { Field } from "@/components/Form/Form";

export default function TriggerPage() {
    const { id } = useParams<{ id: string }>();

    const triggerData = {
        name: `Триггер ${id}`,
        fileInput: "",
        action: "Сломался станок"
    };

    const fields: Field[] = [
        { name: "name", label: "Название", type: "text" },
        { name: "fileInput", label: "JSON", type: "file" },
        { name: "action", label: "Действие", type: "textarea" },

    ];

    return (
        <Flex direction="column" gap="4" alignItems="center" style={{ marginTop: "40px" }}>
            <Text variant="header-2">Редактировать триггер #{id}</Text>
            <DynamicForm initialData={triggerData} fields={fields} />
        </Flex>
    );
}
