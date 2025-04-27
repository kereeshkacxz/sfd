"use client";
import List from "@/components/List/List";
import { Text, Icon } from "@gravity-ui/uikit";
import { Flex } from "@gravity-ui/uikit";
import { PersonWorker } from "@gravity-ui/icons";
import styles from './accounts.module.scss';
import { isAdminWithRedirect } from "@/components";

// Функция для форматирования элементов списка
const formatAccountItem = (login: string) => (
  <div className={styles.accountItem}>
    <Icon data={PersonWorker} size={20} className={styles.accountIcon} />
    <span className={styles.accountText}>{login}</span>
  </div>
);

export default function AccountsPage() {
    isAdminWithRedirect();
    // Теперь массив содержит только логины
    const accounts = [
        { id: 1, login: "worker1" },
        { id: 2, login: "worker2" },
        { id: 3, login: "worker3" },
        { id: 4, login: "manager1" },
    ];

    // Форматируем элементы для списка
    const items = accounts.map(account => ({
        id: account.id,
        title: formatAccountItem(account.login)
    }));

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
        </>
    );
}