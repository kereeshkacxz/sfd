"use client";

import { useParams } from "next/navigation";
import { Flex, Text } from "@gravity-ui/uikit";
import DynamicForm, { Field } from "@/components/Form/Form";

export default function AccountPage() {
    const { id } = useParams<{ id: string }>();

    const accountData = {
        login: `worker${id}`,
        password: "",
        email: `worker${id}@example.com`
    };

    const fields: Field[] = [
        { name: "login", label: "Логин", type: "text" },
        { name: "password", label: "Пароль", type: "password" },
        { name: "email", label: "Email", type: "email" }
    ];

    return (
        <Flex direction="column" gap="4" alignItems="center" style={{ marginTop: "40px" }}>
            <Text variant="header-2">Редактировать аккаунт #{id}</Text>
            <DynamicForm initialData={accountData} fields={fields} />
        </Flex>
    );
}
