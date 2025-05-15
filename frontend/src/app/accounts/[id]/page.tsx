'use client';
import {useParams, useRouter} from 'next/navigation';
import {Flex, Text, Alert} from '@gravity-ui/uikit';
import DynamicForm, {Field} from '@/components/Form/Form';
import {useEffect, useState} from 'react';
import {apiRequest} from '@/utils';

export default function AccountPage() {
    const {id} = useParams<{id: string}>();
    const router = useRouter();
    const [accountData, setAccountData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const fields: Field[] = [
        {name: 'login', label: 'Логин', type: 'text', required: true},
        {name: 'password', label: 'Пароль', type: 'password', required: false},
        {name: 'email', label: 'Email', type: 'email', required: true},
    ];

    useEffect(() => {
        const fetchWorkerData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const data = await apiRequest(`workers/${id}`, 'get', undefined, token);
                setAccountData({
                    login: data.login,
                    password: '',
                    email: data.email
                });
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки данных');
                if (err.status === 401) router.push('/login');
                if (err.status === 404) router.push('/accounts');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkerData();
    }, [id, router]);

    const handleSave = async (formData: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const dataToSend: any = {
                login: formData.login,
                email: formData.email,
            };
            if (formData.password) {
                dataToSend.password = formData.password;
            }

            await apiRequest(`workers/${id}`, 'put', dataToSend, token);
            router.push('/accounts');
        } catch (err: any) {
            console.error('Ошибка при сохранении:', err);
            alert(err.message || 'Произошла ошибка при сохранении');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            await apiRequest(`workers/${id}`, 'delete', undefined, token);
            router.push('/accounts');
        } catch (err: any) {
            console.error('Ошибка при удалении:', err);
            alert(err.message || 'Произошла ошибка при удалении');
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <Alert theme="danger" title="Ошибка" message={error} />;

    return (
        <Flex direction="column" gap="4" alignItems="center" style={{marginTop: '40px', width: '100%'}}>
            <Text variant="header-2">Редактировать аккаунт #{id}</Text>
            {saveError && <Alert theme="danger" title="Ошибка" message={saveError} />}
            {accountData && (
                <div style={{width: '100%', maxWidth: '500px'}}>
                    <DynamicForm 
                        initialData={accountData} 
                        fields={fields} 
                        onSubmit={handleSave}
                        onDelete={handleDelete} // <- добавлено
                        submitText="Сохранить"
                        deleteText="Удалить аккаунт"
                        showDelete={true} // <- включить кнопку удаления
                    />
                </div>
            )}
        </Flex>
    );
}
