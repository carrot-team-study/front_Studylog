// src/domain/todo/pages/TodoPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarView from "../components/CalendarView";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import type { Todo } from "../types/todo";
import type { Subject } from "../../subject/types/subject";
import { subjectApi } from "../../subject/api/subjectApi";
import {getTodos, getTodosByDate, createTodo, updateTodo, deleteTodo, updateTodoComplete,} from "../api/todoApi";
import "../css/TodoPage.css";

function TodoPage() {
    const [content, setContent] = useState("");
    const [subjectId, setSubjectId] = useState<number | null>(null);
    const [targetDate, setTargetDate] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // 리스트 표시용
    const [todos, setTodos] = useState<Todo[]>([]);
    // 캘린더 표시용
    const [allTodos, setAllTodos] = useState<Todo[]>([]);
    // 사용자 과목 목록
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        if (mode === "edit" && !confirm("작성 중인 내용이 사라질 수 있습니다. 이동할까요?")) return;
        navigate(-1);
    };

    const fetchTodos = async () => {
        try {
            const data = await getTodos();
            setTodos(data);
            // 캘린더 표시용 데이터도 저장
            setAllTodos(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchTodosByDate = async (date: string) => {
        try {
            if (!date) return fetchTodos();
            const data = await getTodosByDate(date);
            // 리스트만 업데이트
            setTodos(data);
        } catch (e) {
            console.error(e);
        }
    };

    /**
     * 사용자 과목 목록 조회
     */
    const fetchSubjects = async () => {
        try {
            const data = await subjectApi.getAll();
            setSubjects(data);
        } catch (e) {
            console.error("과목 조회 실패", e);
        }
    };

    useEffect(() => {
        fetchTodos();
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedDate) fetchTodosByDate(selectedDate);
    }, [selectedDate]);

    const handleSubmit = async () => {
        if (!content.trim() || !subjectId || !targetDate) return;

        try {
            setLoading(true);

            if (mode === "create") {
                await createTodo({ content, subjectId, targetDate });
                alert("Todo 저장 완료");
            } else {
                await updateTodo(selectedTodo!.id, { content, subjectId, targetDate });
                alert("Todo 수정 완료");
            }

            setContent("");
            setSubjectId(null);
            setSelectedTodo(null);
            setMode("create");
            setShowForm(false);

            // 전체 todo를 다시 불러와서 캘린더도 갱신
            await fetchTodos();
            await fetchTodosByDate(selectedDate);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (todoId: number) => {
        if (!confirm("정말 삭제할까요?")) return;

        try {
            await deleteTodo(todoId);
            // 캘린더 갱신
            await fetchTodos();
            await fetchTodosByDate(selectedDate);
            alert("삭제 완료");
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggleComplete = async (todoId: number, completed: boolean) => {
        try {
            await updateTodoComplete(todoId, completed);
            await fetchTodos();
            await fetchTodosByDate(selectedDate);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelectTodo = (todo: Todo) => {
        setSelectedTodo(todo);
        setContent(todo.content);
        setSubjectId(todo.subjectId);
        setTargetDate(todo.targetDate);
        setMode("edit");
        setShowForm(true);
    };

    return (
        <div className="todo-container">
            <header className="page-header">
                <button className="back-btn" onClick={handleBack}>←</button>
                <h2>할 일</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="todo-body">
                <CalendarView
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                        setSelectedDate(date);
                        setTargetDate(date);
                        setShowForm(false);
                    }}
                    allTodos={allTodos}/>

                {selectedDate && (
                    <>
                        <h2 className="selected-date-title">{selectedDate}</h2>

                        <TodoList
                            todos={todos}
                            onEdit={handleSelectTodo}
                            onDelete={handleDelete}
                            onToggle={handleToggleComplete}/>

                        <button
                            className="add-todo-btn"
                            onClick={() => {

                                if (showForm) {
                                    // 폼 닫기
                                    setShowForm(false);
                                    return;
                                }

                                // 폼 열기
                                setMode("create");
                                setContent("");
                                setSubjectId(null);
                                setTargetDate(selectedDate);
                                setShowForm(true);
                            }}>
                            {showForm ? "닫기" : "+ Todo 추가"}
                        </button>
                    </>
                )}

                {showForm && (
                    <TodoForm
                        content={content}
                        subjectId={subjectId}
                        targetDate={targetDate}
                        subjects={subjects}
                        onContentChange={setContent}
                        onSubjectChange={setSubjectId}
                        onDateChange={setTargetDate}
                        onSubmit={handleSubmit}
                        disabled={loading}
                        mode={mode}/>
                )}
            </div>
        </div>
    );
}

export default TodoPage;