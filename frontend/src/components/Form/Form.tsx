'use client';
import {useRef, useState} from 'react';
import {Button, Flex, Select, TextArea, TextInput} from '@gravity-ui/uikit';

export type Field = {
    name: string;
    label: string;
    type: 'text' | 'password' | 'email' | 'textarea' | 'select' | 'file';
    options?: {value: string; label: string}[]; // для select
    accept?: string; // для file
};

type DynamicFormProps = {
    initialData: {[key: string]: any};
    fields: Field[];
};

export default function DynamicForm({initialData, fields}: DynamicFormProps) {
    const [formData, setFormData] = useState(initialData);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log('Saving...', formData);
        // здесь отправка данных на сервер
    };

    const handleDelete = () => {
        console.log('Deleting...', formData);
        // здесь логика удаления
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(fieldName, e.target.files?.[0]);
    };

    return (
        <Flex direction="column" gap="4" style={{width: '400px'}}>
            {fields.map((field) => {
                switch (field.type) {
                    case 'textarea':
                        return (
                            <div
                                key={field.name}
                                style={{display: 'flex', flexDirection: 'column', gap: '4px'}}
                            >
                                <label style={{fontWeight: 500}}>{field.label}</label>
                                <TextArea
                                    value={formData[field.name] || ''}
                                    size="xl"
                                    onUpdate={(value) => handleChange(field.name, value)}
                                />
                            </div>
                        );
                    case 'select':
                        return (
                            <div
                                key={field.name}
                                style={{display: 'flex', flexDirection: 'column', gap: '4px'}}
                            >
                                <label style={{fontWeight: 500}}>{field.label}</label>
                                <Select
                                    size="xl"
                                    key={field.name}
                                    value={[formData[field.name]]}
                                    options={field.options || []}
                                    onUpdate={(value) => handleChange(field.name, value[0])}
                                />
                            </div>
                        );
                    case 'file':
                        return (
                            <div
                                key={field.name}
                                style={{display: 'flex', flexDirection: 'column', gap: '4px'}}
                            >
                                <label style={{fontWeight: 500}}>{field.label}</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept={field.accept}
                                    style={{display: 'none'}}
                                    onChange={(e) => handleFileChange(field.name, e)}
                                />
                                <Button view="action" size="xl" onClick={handleFileButtonClick}>
                                    {formData[field.name]?.name || 'Выберите файл'}
                                </Button>
                                {formData[field.name] && (
                                    <div style={{fontSize: '14px', color: '#6D7986'}}>
                                        Выбран: {formData[field.name].name}
                                    </div>
                                )}
                            </div>
                        );
                    default:
                        return (
                            <div
                                key={field.name}
                                style={{display: 'flex', flexDirection: 'column', gap: '4px'}}
                            >
                                <label style={{fontWeight: 500}}>{field.label}</label>
                                <TextInput
                                    size="xl"
                                    key={field.name}
                                    type={field.type}
                                    value={formData[field.name] || ''}
                                    onUpdate={(value) => handleChange(field.name, value)}
                                />
                            </div>
                        );
                }
            })}

            <Flex gap="2" justifyContent="center" style={{marginTop: '20px'}}>
                <Button view="outlined-success" size="l" onClick={handleSave}>
                    Сохранить
                </Button>
                <Button view="outlined-danger" size="l" onClick={handleDelete}>
                    Удалить
                </Button>
            </Flex>
        </Flex>
    );
}
