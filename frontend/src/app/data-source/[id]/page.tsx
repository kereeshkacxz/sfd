'use client';

import {useParams, useRouter} from 'next/navigation';
import {Flex, Text, useToaster} from '@gravity-ui/uikit';
import DynamicForm, {Field} from '@/components/Form/Form';
import {useEffect, useState} from 'react';
import {apiRequest} from '@/utils';

interface DataSourceData {
    id: number;
    name: string;
    parameters: Record<string, any>;
    description?: string;
    created_at: string;
    updated_at: string;
}

export default function DataSourcePage() {
    const {id} = useParams<{id: string}>();
    const router = useRouter();
    const {add} = useToaster();
    const [dataSourceData, setDataSourceData] = useState<DataSourceData | null>(null);
    const [loading, setLoading] = useState(true);

    // Получаем данные источника данных
    useEffect(() => {
        async function fetchDataSource() {
            try {
                const data = await apiRequest<DataSourceData>(`data_source/${id}`);
                setDataSourceData(data);
            } catch (error) {
                console.error('Error fetching data source:', error);
                add({
                    name: 'data-source-fetch-error',
                    title: 'Ошибка',
                    content: 'Не удалось загрузить данные источника',
                    theme: 'danger',
                });
                router.push('/data-source');
            } finally {
                setLoading(false);
            }
        }

        fetchDataSource();
    }, [id]);

    const fields: Field[] = [
        {name: 'name', label: 'Название', type: 'text', required: true},
        {
            name: 'parameters', 
            label: 'Параметры (JSON)', 
            type: 'textarea',
            required: true
        },
        {name: 'description', label: 'Описание', type: 'textarea'},
        {name: 'fileInput', label: 'JSON файл', type: 'file', accept: '.json'},
    ];

    // Обработчик сохранения изменений
    const handleSubmit = async (formData: any) => {
        try {
            // Если загружен файл, читаем его содержимое
            let parameters = dataSourceData?.parameters || {};
            
            if (formData.fileInput) {
                const fileContent = await readFileAsText(formData.fileInput);
                try {
                    parameters = JSON.parse(fileContent);
                } catch (e) {
                    add({
                        name: 'json-parse-error',
                        title: 'Ошибка',
                        content: 'Неверный формат JSON файла',
                        theme: 'danger',
                    });
                    return;
                }
            } else if (formData.parameters) {
                try {
                    parameters = JSON.parse(formData.parameters);
                } catch (e) {
                    add({
                        name: 'json-parse-error',
                        title: 'Ошибка',
                        content: 'Неверный формат JSON в поле параметров',
                        theme: 'danger',
                    });
                    return;
                }
            }

            const updatedDataSource = await apiRequest<DataSourceData>(
                `data_source/${id}`,
                'put',
                {
                    name: formData.name,
                    parameters: parameters,
                    description: formData.description || null,
                }
            );

            setDataSourceData(updatedDataSource);
            add({
                name: 'data-source-update-success',
                title: 'Успех',
                content: 'Источник данных успешно обновлен',
                theme: 'success',
            });
        } catch (error) {
            console.error('Error updating data source:', error);
            add({
                name: 'data-source-update-error',
                title: 'Ошибка',
                content: 'Не удалось обновить источник данных',
                theme: 'danger',
            });
        }
    };

    // Обработчик удаления источника данных
    const handleDelete = async () => {
        if (!confirm('Вы уверены, что хотите удалить этот источник данных?')) {
            return;
        }

        try {
            await apiRequest(`data-sources/${id}`, 'delete');
            add({
                name: 'data-source-delete-success',
                title: 'Успех',
                content: 'Источник данных успешно удален',
                theme: 'success',
            });
            router.push('/data-sources');
        } catch (error) {
            console.error('Error deleting data source:', error);
            add({
                name: 'data-source-delete-error',
                title: 'Ошибка',
                content: 'Не удалось удалить источник данных',
                theme: 'danger',
            });
        }
    };

    // Функция для чтения файла как текста
    const readFileAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    };

    if (loading) {
        return (
            <Flex direction="column" gap="4" alignItems="center" style={{marginTop: '40px'}}>
                <Text variant="header-2">Загрузка...</Text>
            </Flex>
        );
    }

    if (!dataSourceData) {
        return (
            <Flex direction="column" gap="4" alignItems="center" style={{marginTop: '40px'}}>
                <Text variant="header-2">Источник данных не найден</Text>
            </Flex>
        );
    }

    // Подготавливаем данные для формы
    const formInitialData = {
        ...dataSourceData,
        parameters: JSON.stringify(dataSourceData.parameters, null, 2),
        fileInput: null,
    };

    return (
        <Flex direction="column" gap="4" alignItems="center" style={{marginTop: '40px'}}>
            <Text variant="header-2">Редактировать источник данных #{id}</Text>
            <DynamicForm 
                initialData={formInitialData}
                fields={fields}
                onSubmit={handleSubmit}
                submitText="Сохранить изменения"
            />
        </Flex>
    );
}