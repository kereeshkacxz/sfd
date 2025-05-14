'use client';
import {useState, useEffect} from 'react';
import List from '@/components/List/List';
import {Button, Flex, Icon, Modal, Text} from '@gravity-ui/uikit';
import {PersonWorker} from '@gravity-ui/icons';
import styles from './accounts.module.scss';
import {isAdminWithRedirect} from '@/components';
import DynamicForm, {Field} from '@/components/Form/Form';
import {apiRequest} from '@/utils';
import {useRouter} from 'next/navigation';

const formatAccountItem = (login: string) => (
    <div className={styles.accountItem}>
        <Icon data={PersonWorker} size={20} className={styles.accountIcon} />
        <span className={styles.accountText}>{login}</span>
    </div>
);

export default function AccountsPage() {
    isAdminWithRedirect();
    const router = useRouter();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormVisible, setFormVisible] = useState(false);

    const formFields: Field[] = [
        {name: 'login', label: 'Логин', type: 'text', required: true},
        {name: 'password', label: 'Пароль', type: 'password', required: true},
        {name: 'email', label: 'Email', type: 'email', required: true},
    ];

    const getToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    };

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }
            const data = await apiRequest('workers/', 'get', undefined, token);
            setAccounts(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Ошибка при загрузке аккаунтов');
            if (err.status === 401) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleAddWorker = () => {
        setFormVisible(true);
    };

    const handleCloseModal = () => {
        setFormVisible(false);
    };

    const handleCreateWorker = async (formData: any) => {
        try {
            console.log('Отправляемые данные:', formData);
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }
            await apiRequest('workers/', 'post', formData, token);
            await fetchAccounts();
            setFormVisible(false);
        } catch (err: any) {
            alert(err.message || 'Ошибка при создании аккаунта');
        }
    };

    const items = accounts.map((account) => ({
        id: account.id,
        title: formatAccountItem(account.login),
    }));

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Flex justifyContent="center" alignItems="center">
                <Text variant="header-1">Аккаунты работников</Text>
            </Flex>
            <List
                items={items}
                textIfNull={'Нет зарегистрированных аккаунтов'}
                withCheckbox={false}
                baseHref="/accounts"
            />
            <div style={{width: '100%', maxWidth: '500px', margin: '20px auto 0'}}>
                <Button view="action" size="l" onClick={handleAddWorker} style={{width: '100%'}}>
                    Добавить работника
                </Button>
            </div>

            <Modal open={isFormVisible} onClose={handleCloseModal}>
                <div style={{padding: '20px', maxWidth: '600px'}}>
                    <Flex justifyContent="center" style={{marginBottom: '20px'}}>
                        <Text variant="header-1">Создание работника</Text>
                    </Flex>
                    <DynamicForm 
                        initialData={{}} 
                        fields={formFields} 
                        onSubmit={handleCreateWorker}
                        submitText="Создать"
                        showDelete={false}
                    />
                </div>
            </Modal>
        </>
    );
}