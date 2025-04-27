"use client";
import { ReactNode } from "react";
import { Checkbox, Text } from "@gravity-ui/uikit";
import styles from "./List.module.scss";

interface Item {
  id: number;
  title: string;
  subtitle?: string;
}

interface ListProps {
  items: Item[];
  actions?: ReactNode;
  selectedItems: number[];
  onItemSelect: (id: number) => void;
  textIfNull?: string;
}

export default function List({ 
  items,
  actions,
  selectedItems,
  onItemSelect,
  textIfNull = "Нет активных задач"
}: ListProps) {
  const isSelected = (id: number) => selectedItems.includes(id);

  const handleItemClick = (e: React.MouseEvent, id: number) => {
    const target = e.target as HTMLElement;
    if (target.closest(`.${styles["list-item__checkbox"]}, .gravity-checkbox`)) {
      return;
    }
    onItemSelect(id);
  };

  return (
    <div className={styles.list}>
      <div className={styles["list__container"]}>
        <div className={styles["list__items"]}>
          {items.length > 0 ? (
            items.map((item) => (
              <div 
                key={item.id}
                className={`${styles["list-item"]} ${isSelected(item.id) ? styles["list-item--selected"] : ''}`}
                onClick={(e) => handleItemClick(e, item.id)}
              >
                <div className={styles["list-item__content"]}>
                  <Text variant="subheader-2" color="primary">
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text variant="body-2" color="secondary">
                      {item.subtitle}
                    </Text>
                  )}
                </div>
                <div className={styles["list-item__checkbox"]}>
                  <Checkbox
                    checked={isSelected(item.id)}
                    onChange={() => onItemSelect(item.id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className={styles["list__empty"]}>
              {textIfNull && (
                <Text variant="body-2" color="secondary">
                  {textIfNull}
                </Text>
              )}
            </div>
          )}
        </div>
      </div>

        <div className={styles["list__actions"]}>
      {selectedItems.length > 0 && (
          actions
        )}
        </div>
    </div>
  );
}
