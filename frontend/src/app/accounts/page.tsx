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
    const [isAdminFormVisible, setAdminFormVisible] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<string>('');

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

    const fetchCurrentUser = async () => {
        try {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }
            const data = await apiRequest('auth/me', 'get', undefined, token);
            setCurrentUserRole(data.role);
        } catch (err: any) {
            console.error('Error fetching current user:', err);
            if (err.status === 401) {
                router.push('/login');
            }
        }
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
        fetchCurrentUser();
        fetchAccounts();
    }, []);

    const handleAddWorker = () => {
        setFormVisible(true);
    };

    const handleAddAdmin = () => {
        setAdminFormVisible(true);
    };

    const handleCloseModal = () => {
        setFormVisible(false);
        setAdminFormVisible(false);
    };

    const handleCreateWorker = async (formData: any) => {
        try {
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

    const handleCreateAdmin = async (formData: any) => {
        try {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }
            await apiRequest('admins/', 'post', formData, token);
            await fetchAccounts();
            setAdminFormVisible(false);
        } catch (err: any) {
            alert(err.message || 'Ошибка при создании администратора');
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
            <div style={{width: '100%', maxWidth: '500px', margin: '20px auto 0', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <Button view="action" size="l" onClick={handleAddWorker} style={{width: '100%'}}>
                    Добавить работника
                </Button>
                {currentUserRole === 'superadmin' && (
                    <Button view="action" size="l" onClick={handleAddAdmin} style={{width: '100%'}}>
                        Добавить администратора
                    </Button>
                )}
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

            <Modal open={isAdminFormVisible} onClose={handleCloseModal}>
                <div style={{padding: '20px', maxWidth: '600px'}}>
                    <Flex justifyContent="center" style={{marginBottom: '20px'}}>
                        <Text variant="header-1">Создание администратора</Text>
                    </Flex>
                    <DynamicForm 
                        initialData={{}} 
                        fields={formFields} 
                        onSubmit={handleCreateAdmin}
                        submitText="Создать"
                        showDelete={false}
                    />
                </div>
            </Modal>
        </>
    );
}