'use client';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, Text, useToaster, TextInput, Select, Modal, Icon } from '@gravity-ui/uikit';
import { Plus } from '@gravity-ui/icons';
import List from '@/components/List/List';
import styles from './tasks.module.scss';
import { apiRequest } from '@/utils';

export default function TasksPage() {
  const { add } = useToaster();
  const [items, setItems] = useState<{ id: number; title: string; subtitle: string }[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<{ id: number; login: string }[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'planned',
    assignedTo: null as number | null,
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Получаем ID текущего пользователя
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await apiRequest('/admins/current', 'get', undefined, token);
      localStorage.setItem('user_id', response.id.toString());
      setCurrentUserId(response.id);
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
      add({
        name: 'user_fetch_error',
        title: 'Ошибка при получении данных пользователя',
        theme: 'danger',
      });
    }
  };

  // Загружаем задачи
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const tasks = await apiRequest('/tasks', 'get', undefined, token);
      setItems(tasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        subtitle: t.description,
      })));
    } catch (error) {
      console.error('Ошибка при загрузке задач', error);
    }
  };

  // Загружаем пользователей
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const workers = await apiRequest('/workers', 'get', undefined, token);
      setUsers(workers);
    } catch (e) {
      console.error('Ошибка при загрузке работников:', e);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    setIsAllSelected(items.length > 0 && selectedItems.length === items.length);
  }, [selectedItems, items]);

  const toggleIsAllSelected = () => {
    setSelectedItems(isAllSelected ? [] : items.map((item) => item.id));
  };

  const handleItemSelect = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  };

  const handleCreateTask = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token || !newTask.assignedTo || !currentUserId) {
      add({
        name: 'missing_data',
        title: 'Заполните все обязательные поля',
        theme: 'warning',
      });
      return;
    }

    // Формируем данные в ТОЧНОМ формате, который ожидает бэкенд
    const taskData = {
      title: newTask.title,
      status: newTask.status, // Должен соответствовать TaskStatus на бэкенде
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Дефолтный дедлайн: +7 дней
      assigned_to: newTask.assignedTo, // Обратите внимание на snake_case
      created_by: currentUserId,
      description: newTask.description || null, // Явно указываем null если undefined
    };

    console.log('Отправляемые данные:', taskData);

    await apiRequest('/tasks', 'post', taskData, token);

    add({
      name: 'task_created',
      title: 'Задача успешно создана',
      theme: 'success',
    });

    setIsModalOpen(false);
    setNewTask({ 
      title: '', 
      description: '', 
      status: 'planned', 
      assignedTo: null 
    });
    fetchTasks();
  } catch (e) {
    console.error('Полная ошибка:', e);
    add({
      name: 'create_error',
      title: 'Ошибка создания задачи',
    //   content: e.response?.data?.detail || 'Проверьте правильность данных',
      theme: 'danger',
    });
  }
};

  const actions = () => {
    const handleCancel = () => {
      setSelectedItems([]);
    };

    const handleCloseTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        await apiRequest('/tasks', 'delete', { ids: selectedItems }, token);
        setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));

        add({
          name: 'task_deleted',
          title: `Задач${selectedItems.length < 2 ? 'а' : 'и'} удален${selectedItems.length < 2 ? 'а' : 'ы'}`,
          theme: 'success',
        });

        setSelectedItems([]);
      } catch (error) {
        console.error('Ошибка при удалении задач:', error);
        add({
          name: 'delete_error',
          title: 'Ошибка при удалении задач',
          theme: 'danger',
        });
      }
    };

    return (
      <>
        <Button view="outlined" size="l" onClick={handleCancel} className={styles.button}>
          Отмена
        </Button>
        <Button
          view="action"
          size="l"
          onClick={handleCloseTasks}
          className={styles.button}
          disabled={selectedItems.length === 0}
        >
          Удалить выбранные задачи
        </Button>
      </>
    );
  };

  return (
    <>
      <Flex
        justifyContent={items.length > 0 ? 'space-between' : 'center'}
        alignItems={'center'}
        width={'394px'}
      >
        <Text variant="header-1">Задачи работника</Text>
        {items.length > 0 && (
          <Checkbox checked={isAllSelected} onUpdate={toggleIsAllSelected} />
        )}
      </Flex>
      <List
        actions={actions()}
        items={items}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
        textIfNull={'Нет активных задач'}
        withCheckbox={true}
      />

    <Button
        view="action"
        size="xl"
        className={styles.fab}
        onClick={() => setIsModalOpen(true)}
        pin="circle-circle"
        >
        <span className={styles.fabText}>Создать задачу</span>
        <Icon data={Plus} size={24} />
    </Button>

    <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentClassName={styles.modal}
        >
        <Flex direction="column" gap="5" className={styles.modalContent}>
            <Text variant="header-2">Создать задачу</Text>

            <TextInput
            value={newTask.title}
            onUpdate={(v) => setNewTask({ ...newTask, title: v })}
            placeholder="Название задачи"
            size="l"
            />

            <TextInput
            value={newTask.description}
            onUpdate={(v) => setNewTask({ ...newTask, description: v })}
            placeholder="Описание задачи"
            size="l"
            />

            <Select
            value={[newTask.status]}
            onUpdate={(v) => setNewTask({ ...newTask, status: v[0] })}
            options={[
                { value: 'planned', content: 'Запланирована' },
                { value: 'in_progress', content: 'В работе' },
                { value: 'completed', content: 'Завершена' },
                { value: 'overdue', content: 'Просрочена' },
                { value: 'evaluation', content: 'На оценке' },
            ]}
            placeholder="Статус"
            size="l"
            />

            <Select
            value={newTask.assignedTo ? [newTask.assignedTo.toString()] : []}
            onUpdate={(v) => setNewTask({ ...newTask, assignedTo: Number(v[0]) })}
            options={users.map((u) => ({
                value: u.id.toString(),
                content: u.login,
            }))}
            placeholder="Назначить работника"
            size="l"
            />

            <Button 
            size="l" 
            view="action" 
            onClick={handleCreateTask}
            disabled={!newTask.assignedTo}
            className={styles.createButton}
            >
            Создать задачу
            </Button>
        </Flex>
    </Modal>

    </>
  );
}