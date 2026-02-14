// src/domain/todo/components/CalendarView.tsx

import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Todo } from "../types/todo";

interface Props {
    selectedDate: string;
    onSelectDate: (date: string) => void;
    allTodos: Todo[];
}

const CalendarView: React.FC<Props> = ({selectedDate, onSelectDate, allTodos,}) => {
    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <Calendar
                value={selectedDate ? new Date(selectedDate) : new Date()}
                onClickDay={(value) => {
                    const formatted = formatDate(value);
                    onSelectDate(formatted);
                }}
                tileContent={({ date, view }) => {
                    if (view !== "month") return null;

                    const formatted = formatDate(date);

                    const todosOfDay = allTodos.filter(
                        (t) => t.targetDate === formatted
                    );

                    if (!todosOfDay.length) return null;

                    // 과목 중복 제거
                    const subjectNames = Array.from(
                        new Set(todosOfDay.map((t) => t.subjectName))
                    );

                    const visibleSubjects = subjectNames.slice(0, 2);
                    const remainCount =
                        subjectNames.length - visibleSubjects.length;

                    return (
                        <div
                            style={{
                                marginTop: "4px",
                                fontSize: "10px",
                                textAlign: "center",
                                lineHeight: "1.2",
                            }}>
                            {visibleSubjects.map((name) => (
                                <div key={name}>{name}</div>
                            ))}

                            {remainCount > 0 && (
                                <div>+{remainCount}</div>
                            )}
                        </div>
                    );
                }}/>
        </div>
    );
};

export default CalendarView;
