"use client";
import List from "@/components/List/List";
import { Text } from "@gravity-ui/uikit";

const items = [
  { id: 1, title: "One", subtitle: "First item in the list First item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the listFirst item in the list" },
  { id: 2, title: "Two", subtitle: "Second item with description" },
  { id: 3, title: "Three", subtitle: "Third element with details" },
  { id: 4, title: "Four", subtitle: "Fourth position in sequence" },
  { id: 5, title: "Five", subtitle: "Middle of the list" },
  { id: 6, title: "Five", subtitle: "Middle of the list" },
  { id: 7, title: "Five", subtitle: "Middle of the list" },
  { id: 8, title: "Five", subtitle: "Middle of the list" },
  { id: 9, title: "Five", subtitle: "Middle of the list" },
  { id: 10, title: "Five", subtitle: "Middle of the list" },
  { id: 11, title: "Five", subtitle: "Middle of the list" },
  { id: 12, title: "Five", subtitle: "Middle of the list" },
  { id: 13, title: "Five", subtitle: "Middle of the list" },

];

export default function Home() {
  return (
    <div className="list-page">
        <Text variant="header-1" className="list-page__title">
            Задачи работника
        </Text>
        <List items={items} />
    </div>
  );
}