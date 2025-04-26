"use client";
import { useState } from "react";
import { Checkbox, Text, Button } from "@gravity-ui/uikit";
import "./List.scss";

interface Item {
  id: number;
  title: string;
  subtitle: string;
}

interface ListProps {
  items: Item[];
}

export default function List({ items: initialItems }: ListProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const isSelected = (id: number) => selectedItems.includes(id);

  const handleCancel = () => {
    setSelectedItems([]);
  };

  const handleCloseTasks = () => {
    setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleItemClick = (e: React.MouseEvent, id: number) => {
    // Если клик был по чекбоксу или его label, не обрабатываем клик на элементе
    const target = e.target as HTMLElement;
    if (target.closest('.list-item__checkbox, .gravity-checkbox')) {
      return;
    }
    toggleSelect(id);
  };

  return (
    <div className="list">
      <div className="list__container">
        <div className="list__items">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className={`list-item ${isSelected(item.id) ? "list-item--selected" : ""}`}
                onClick={(e) => handleItemClick(e, item.id)} // Измененный обработчик
              >
                <div className="list-item__content">
                  <Text variant="subheader-2" color="primary">
                    {item.title}
                  </Text>
                  <Text variant="body-2" color="secondary">
                    {item.subtitle}
                  </Text>
                </div>
                <div className="list-item__checkbox">
                  <Checkbox
                    checked={isSelected(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="list__empty">
              <Text variant="body-2" color="secondary">
                Нет активных задач
              </Text>
            </div>
          )}
        </div>
      </div>

      <div className="list__buttons">
        <Button
          view="outlined"
          size="l"
          onClick={handleCancel}
          className="list__button"
        >
          Отмена
        </Button>
        <Button
          view="action"
          size="l"
          onClick={handleCloseTasks}
          className="list__button"
        >
          Закрыть выбранные задачи
        </Button>
      </div>
    </div>
  );
}