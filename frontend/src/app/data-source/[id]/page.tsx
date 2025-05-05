'use client';

import {useParams} from 'next/navigation';
import {Flex, Text} from '@gravity-ui/uikit';
import DynamicForm, {Field} from '@/components/Form/Form';

export default function DataSourcePage() {
    const {id} = useParams<{id: string}>();

    const dataSourceData = {
        name: `Источник данных ${id}`,
        description: '',
    };

    const fields: Field[] = [
        {name: 'name', label: 'Название', type: 'text'},
        {name: 'fileInput', label: 'JSON', type: 'file'},
    ];

    return (
        <Flex direction="column" gap="4" alignItems="center" style={{marginTop: '40px'}}>
            <Text variant="header-2">Редактировать источник данных #{id}</Text>
            <DynamicForm initialData={dataSourceData} fields={fields} />
        </Flex>
    );
}
