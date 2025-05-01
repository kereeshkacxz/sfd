"use client";
import { useState } from "react";
import List from "@/components/List/List";
import { Text, Icon, Button, Modal } from "@gravity-ui/uikit";
import { Flex } from "@gravity-ui/uikit";
import { PersonWorker } from "@gravity-ui/icons";
import styles from './accounts.module.scss';
import { isAdminWithRedirect } from "@/components";
import DynamicForm, { Field } from "@/components/Form/Form";

const formatAccountItem = (login: string) => (
  <div className={styles.accountItem}>
    <Icon data={PersonWorker} size={20} className={styles.accountIcon} />
    <span className={styles.accountText}>{login}</span>
  </div>
);

export default function AccountsPage() {
    isAdminWithRedirect();
    
    const accounts = [
        { id: 1, login: "worker1" },
        { id: 2, login: "worker2" },
        { id: 3, login: "worker3" },
        { id: 4, login: "manager1" },
    ];

    const items = accounts.map(account => ({
        id: account.id,
        title: formatAccountItem(account.login)
    }));

    const [isFormVisible, setFormVisible] = useState(false);

    const formFields: Field[] = [
        { name: "login", label: "Логин", type: "text" },
        { name: "password", label: "Пароль", type: "password" },
        { name: "email", label: "Email", type: "email" },
    ];

    const handleAddWorker = () => {
        setFormVisible(true);
    };

    const handleCloseModal = () => {
        setFormVisible(false);
    };

    return (
        <>
            <Flex justifyContent="center" alignItems="center">
                <Text variant="header-1">
                    Аккаунты работников
                </Text>
            </Flex>
            <List 
                items={items}
                textIfNull={"Нет зарегистрированных аккаунтов"}
                withCheckbox={false}
                baseHref="/accounts"
            />
            <div style={{ width: "100%", maxWidth: "500px", margin: "20px auto 0" }}>
                <Button 
                    view="action"
                    size="l" 
                    onClick={handleAddWorker} 
                    style={{ width: "100%" }}
                >
                    Добавить работника
                </Button>
            </div>

            <Modal
                open={isFormVisible}
                onClose={handleCloseModal}
            >
                <div style={{ padding: "20px", maxWidth: "600px" }}>
                    <Flex justifyContent="center" style={{ marginBottom: "20px" }}>
                        <Text variant="header-1">
                            Создание работника
                        </Text>
                    </Flex>
                    <DynamicForm 
                        initialData={{}} 
                        fields={formFields} 
                    />
                </div>
            </Modal>
        </>
    );
}