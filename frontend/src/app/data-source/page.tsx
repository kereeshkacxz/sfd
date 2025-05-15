'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Button, Flex, Link, Modal, Text, Alert} from '@gravity-ui/uikit';
import List from '@/components/List/List';
import {isAdminWithRedirect} from '@/components';
import DynamicForm, {Field} from '@/components/Form/Form';
import {apiRequest} from '@/utils';

export default function DataSourcesPage() {
    isAdminWithRedirect();
    const router = useRouter();
    const [dataSources, setDataSources] = useState<any[]>([]);
    const [selectedDataSources, setSelectedDataSources] = useState<number[]>([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    // Загрузка источников данных
    useEffect(() => {
        const fetchDataSources = async () => {
            try {
                const data = await apiRequest('data_source/', 'get');
                setDataSources(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки источников данных');
            } finally {
                setLoading(false);
            }
        };

        fetchDataSources();
    }, []);

    const handleSelectDataSource = (id: number) => {
        setSelectedDataSources((prev) =>
            prev.includes(id) ? prev.filter((sourceId) => sourceId !== id) : [...prev, id]
        );
    };

    const handleAddDataSource = () => {
        setFormVisible(true);
    };

    const handleCloseModal = () => {
        setFormVisible(false);
        setFormError(null);
    };

    const handleDeleteSelected = async () => {
        if (!selectedDataSources.length || !confirm('Удалить выбранные источники данных?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            await apiRequest(
                'data_source/',
                'delete',
                { data_source_ids: selectedDataSources },
                token
            );

            // Оптимистичное обновление UI
            setDataSources(dataSources.filter(ds => !selectedDataSources.includes(ds.id)));
            setSelectedDataSources([]);
        } catch (err: any) {
            console.error('Ошибка удаления:', err);
            setError(err.message || 'Не удалось удалить источники данных');
        }
    };

    const handleCreateDataSource = async (formData: any) => {
        try {
            setFormError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // Для файла используем FormData
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            if (formData.config) {
                formDataToSend.append('config', formData.config);
            }

            const newDataSource = await apiRequest(
                'data_source/',
                'post',
                formDataToSend,
                token,
                true // asForm = true
            );

            setDataSources([...dataSources, newDataSource]);
            setFormVisible(false);
        } catch (err: any) {
            setFormError(err.message || 'Ошибка создания источника данных');
        }
    };

    const dataSourceItems = dataSources.map((source) => ({
        id: source.id,
        title: (
            <Link
                view="primary"
                href={`/data-source/${source.id}`}
                onClick={(e) => e.stopPropagation()}
            >
                {source.name}
            </Link>
        ),
    }));

    const formFields: Field[] = [
        {name: 'name', label: 'Название источника данных', type: 'text', required: true},
        {name: 'config', label: 'Конфигурационный файл (JSON)', type: 'file', accept: '.json'},
    ];

    if (loading) return <div>Загрузка...</div>;
    if (error) return <Alert theme="danger" title="Ошибка" message={error} />;

    return (
        <Flex direction="column" alignItems="center" style={{marginTop: '40px'}} gap="4">
            <Text variant="header-2">Источники данных</Text>
            
            <List
                items={dataSourceItems}
                selectedItems={selectedDataSources}
                onItemSelect={handleSelectDataSource}
                textIfNull="Нет источников данных"
                withCheckbox={true}
                baseHref="/data-source"
            />

            <Flex gap="2" style={{width: '100%', maxWidth: '500px'}}>
                <Button 
                    view="action" 
                    size="l" 
                    onClick={handleAddDataSource}
                    style={{flex: 1}}
                >
                    Добавить источник
                </Button>
                
                {selectedDataSources.length > 0 && (
                    <Button 
                        view="outlined-danger" 
                        size="l" 
                        onClick={handleDeleteSelected}
                        style={{flex: 1}}
                    >
                        Удалить выбранные ({selectedDataSources.length})
                    </Button>
                )}
            </Flex>

            <Modal open={isFormVisible} onClose={handleCloseModal}>
                <div style={{padding: '20px', maxWidth: '600px'}}>
                    <Flex justifyContent="center" style={{marginBottom: '20px'}}>
                        <Text variant="header-1">Создание источника данных</Text>
                    </Flex>
                    {formError && (
                        <Alert theme="danger" title="Ошибка" message={formError} style={{marginBottom: '20px'}} />
                    )}
                    <DynamicForm 
                        initialData={{}} 
                        fields={formFields} 
                        onSubmit={handleCreateDataSource}
                        submitText="Создать"
                        showDelete={false}
                    />
                </div>
            </Modal>
        </Flex>
    );
}