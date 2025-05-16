'use client';

import {useParams, useRouter} from 'next/navigation';
import {Flex, Text, useToaster} from '@gravity-ui/uikit';
import DynamicForm, {Field} from '@/components/Form/Form';
import {useEffect, useState} from 'react';
import {apiRequest} from '@/utils';

interface TriggerData {
    id: number;
    name: string;
    condition: Record<string, any>;
    action: string;
    created_at: string;
    updated_at: string;
}

export default function TriggerPage() {
    const {id} = useParams<{id: string}>();
    const router = useRouter();
    const {add} = useToaster();
    const [triggerData, setTriggerData] = useState<TriggerData | null>(null);
    const [loading, setLoading] = useState(true);

    // Получаем данные триггера
    useEffect(() => {
        async function fetchTrigger() {
            try {
                const data = await apiRequest<TriggerData>(`triggers/${id}`);
                setTriggerData(data);
            } catch (error) {
                console.error('Error fetching trigger:', error);
                add({
                    name: 'trigger-fetch-error',
                    title: 'Ошибка',
                    content: 'Не удалось загрузить данные триггера',
                    theme: 'danger',
                });
                router.push('/triggers');
            } finally {
                setLoading(false);
            }
        }

        fetchTrigger();
    }, [id]);

    const fields: Field[] = [
        {name: 'name', label: 'Название', type: 'text', required: true},
        {
            name: 'condition', 
            label: 'Условие (JSON)', 
            type: 'textarea',
            required: true
        },
        {name: 'action', label: 'Действие', type: 'textarea', required: true},
    ];

    // Обработчик сохранения изменений
    const handleSubmit = async (formData: any) => {
        try {
            const updatedTrigger = await apiRequest<TriggerData>(
                `triggers/${id}`,
                'put',
                {
                    name: formData.name,
                    condition: JSON.parse(formData.condition),
                    action: formData.action,
                }
            );

            setTriggerData(updatedTrigger);
            add({
                name: 'trigger-update-success',
                title: 'Успех',
                content: 'Триггер успешно обновлен',
                theme: 'success',
            });
        } catch (error) {
            console.error('Error updating trigger:', error);
            add({
                name: 'trigger-update-error',
                title: 'Ошибка',
                content: 'Не удалось обновить триггер',
                theme: 'danger',
            });
        }
    };

    if (loading) {
        return (
            <Flex direction="column" gap="4" alignItems="center" style={{marginTop: '40px'}}>
                <Text variant="header-2">Загрузка...</Text>
            </Flex>
        );
    }

    if (!triggerData) {
        return (
            <Flex direction="column" gap="4" alignItems="center" style={{marginTop: '40px'}}>
                <Text variant="header-2">Триггер не найден</Text>
            </Flex>
        );
    }

    // Подготавливаем данные для формы
    const formInitialData = {
        ...triggerData,
        condition: JSON.stringify(triggerData.condition, null, 2),
    };

    return (
        <Flex direction="column" gap="4" alignItems="center" style={{marginTop: '40px'}}>
            <Text variant="header-2">Редактировать триггер #{id}</Text>
            <DynamicForm 
                initialData={formInitialData}
                fields={fields}
                onSubmit={handleSubmit}
                submitText="Сохранить изменения"
            />
        </Flex>
    );
}