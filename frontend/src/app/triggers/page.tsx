'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Button, Flex, Link, Modal, Text, Alert} from '@gravity-ui/uikit';
import List from '@/components/List/List';
import {isAdminWithRedirect} from '@/components';
import DynamicForm, {Field} from '@/components/Form/Form';
import {apiRequest} from '@/utils';

export default function TriggersPage() {
    isAdminWithRedirect();
    const router = useRouter();
    const [triggers, setTriggers] = useState<any[]>([]);
    const [selectedTriggers, setSelectedTriggers] = useState<number[]>([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    // Загрузка триггеров
    useEffect(() => {
        const fetchTriggers = async () => {
            try {
                const data = await apiRequest('triggers/', 'get');
                setTriggers(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки триггеров');
            } finally {
                setLoading(false);
            }
        };

        fetchTriggers();
    }, []);

    const handleSelectTrigger = (id: number) => {
        setSelectedTriggers((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    const handleAddTrigger = () => {
        setFormVisible(true);
    };

    const handleCloseModal = () => {
        setFormVisible(false);
        setFormError(null);
    };

    const handleDeleteSelected = async () => {
        if (!selectedTriggers.length || !window.confirm('Вы уверены, что хотите удалить выбранные триггеры?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
            router.push('/login');
            return;
            }

            // Отправляем запрос с токеном
            await apiRequest(
            'triggers/',
            'delete',
            { trigger_ids: selectedTriggers },
            token  // Передаем токен авторизации
            );

            // Оптимистичное обновление UI
            setTriggers(triggers.filter(t => !selectedTriggers.includes(t.id)));
            setSelectedTriggers([]);
        } catch (err: any) {
            console.error('Ошибка удаления:', err);
            alert(err.message || 'Не удалось удалить триггеры');
        }
    };

    const handleCreateTrigger = async (formData: any) => {
        try {
            setFormError(null);
            
            // Для файла используем FormData
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('action', formData.action);
            if (formData.jsonFile) {
                formDataToSend.append('jsonFile', formData.jsonFile);
            }

            const newTrigger = await apiRequest(
                'triggers/',
                'post',
                formDataToSend,
                undefined,
                true // asForm = true
            );

            setTriggers([...triggers, newTrigger]);
            setFormVisible(false);
        } catch (err: any) {
            setFormError(err.message || 'Ошибка создания триггера');
        }
    };

    const triggerItems = triggers.map((trigger) => ({
        id: trigger.id,
        title: (
            <Link
                view="primary"
                href={`/triggers/${trigger.id}`}
                onClick={(e) => e.stopPropagation()}
            >
                {trigger.name}
            </Link>
        ),
    }));

    const formFields: Field[] = [
        {name: 'name', label: 'Название триггера', type: 'text', required: true},
        {name: 'jsonFile', label: 'JSON файл конфигурации', type: 'file', accept: '.json'},
        {name: 'action', label: 'Действие', type: 'text', required: true},
    ];

    if (loading) return <div>Загрузка...</div>;
    if (error) return <Alert theme="danger" title="Ошибка" message={error} />;

    return (
        <Flex direction="column" alignItems="center" style={{marginTop: '40px'}} gap="4">
            <Text variant="header-2">Триггеры</Text>
            
            <List
                items={triggerItems}
                selectedItems={selectedTriggers}
                onItemSelect={handleSelectTrigger}
                textIfNull="Нет триггеров"
                withCheckbox={true}
                baseHref="/triggers"
            />

            <Flex gap="2" style={{width: '100%', maxWidth: '500px'}}>
                <Button 
                    view="action" 
                    size="l" 
                    onClick={handleAddTrigger}
                    style={{flex: 1}}
                >
                    Добавить триггер
                </Button>
                
                {selectedTriggers.length > 0 && (
                    <Button 
                        view="outlined-danger" 
                        size="l" 
                        onClick={handleDeleteSelected}
                        style={{flex: 1}}
                    >
                        Удалить выбранные ({selectedTriggers.length})
                    </Button>
                )}
            </Flex>

            <Modal open={isFormVisible} onClose={handleCloseModal}>
                <div style={{padding: '20px', maxWidth: '600px'}}>
                    <Flex justifyContent="center" style={{marginBottom: '20px'}}>
                        <Text variant="header-1">Создание триггера</Text>
                    </Flex>
                    {formError && (
                        <Alert theme="danger" title="Ошибка" message={formError} style={{marginBottom: '20px'}} />
                    )}
                    <DynamicForm 
                        initialData={{}} 
                        fields={formFields} 
                        onSubmit={handleCreateTrigger}
                        submitText="Создать"
                        showDelete={false}
                    />
                </div>
            </Modal>
        </Flex>
    );
}