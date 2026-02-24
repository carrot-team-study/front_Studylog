// src/domain/plan/pages/PlanPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { planApi } from '../api/planApi';
import type { Plan } from '../types/plan.ts';
import '../css/PlanPage.css';

const PlanPage = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');

    const fetchPlans = async (date: string) => {
        try {
            setLoading(true);
            const data = await planApi.getByDate(date);
            setPlans(data);
        } catch (error) {
            console.error('계획 조회 실패:', error);
            alert('계획을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(selectedDate); }, [selectedDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) { alert('제목을 입력하세요'); return; }

        try {
            const planData = { title, content, targetDate: selectedDate, startTime, endTime };
            if (editingPlan) {
                await planApi.update(editingPlan.planId, planData);
                alert('계획이 수정되었습니다.');
            } else {
                await planApi.create(planData);
                alert('계획이 추가되었습니다.');
            }
            handleCloseForm();
            fetchPlans(selectedDate);
        } catch (error) {
            const msg = error instanceof Error ? error.message : '계획 저장에 실패했습니다.';
            alert(msg);
        }
    };

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`"${title}" 계획을 삭제하시겠습니까?`)) return;
        try {
            await planApi.delete(id);
            alert('계획이 삭제되었습니다.');
            fetchPlans(selectedDate);
        } catch {
            alert('계획 삭제에 실패했습니다.');
        }
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setTitle(plan.title);
        setContent(plan.content);
        setStartTime(plan.startTime);
        setEndTime(plan.endTime);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingPlan(null);
        setTitle('');
        setContent('');
        setStartTime('09:00');
        setEndTime('10:00');
    };

    return (
        <div className="plan-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>플래너</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="plan-body">
                <div className="plan-toolbar">
                    <input
                        className="date-input"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button className="add-plan-btn" onClick={() => setShowForm(true)}>
                        + 계획 추가
                    </button>
                </div>

                {loading ? (
                    <div className="empty-state">불러오는 중...</div>
                ) : plans.length === 0 ? (
                    <div className="empty-state">등록된 계획이 없습니다.</div>
                ) : (
                    <div className="plan-list">
                        {plans.map((plan) => (
                            <div key={plan.planId} className="plan-item">
                                <div className="plan-item-header">
                                    <h3 className="plan-title">{plan.title}</h3>
                                    <div className="plan-actions">
                                        <button className="edit-btn" onClick={() => handleEdit(plan)}>수정</button>
                                        <button className="delete-btn" onClick={() => handleDelete(plan.planId, plan.title)}>삭제</button>
                                    </div>
                                </div>
                                <p className="plan-time">{plan.startTime} ~ {plan.endTime}</p>
                                {plan.content && <p className="plan-content">{plan.content}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={handleCloseForm}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingPlan ? '계획 수정' : '계획 추가'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">제목</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="계획 제목"
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">내용</label>
                                <textarea
                                    className="form-textarea"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="계획 내용 (선택)"
                                />
                            </div>
                            <div className="time-row">
                                <div className="form-group">
                                    <label className="form-label">시작 시간</label>
                                    <input className="form-input" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">종료 시간</label>
                                    <input className="form-input" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="modal-cancel-btn" onClick={handleCloseForm}>취소</button>
                                <button type="submit" className="modal-submit-btn">{editingPlan ? '수정' : '추가'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanPage;