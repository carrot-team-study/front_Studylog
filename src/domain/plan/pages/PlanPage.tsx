// src/domain/plan/pages/PlanPage.tsx
import { useState, useEffect } from 'react';
import { planApi } from '../api/planApi';
import type {Plan} from "../types/plan.ts";

const PlanPage = () => {
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [plans, setPlans] = useState<Plan[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(false);

    // 폼 상태
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');

    // 계획 목록 조회
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

    useEffect(() => {
        fetchPlans(selectedDate);
    }, [selectedDate]);

    // 추가/수정 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('제목을 입력하세요');
            return;
        }

        try {
            const planData = {
                title,
                content,
                targetDate: selectedDate,
                startTime,
                endTime,
            };

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
            const errorMessage = error instanceof Error ? error.message : '계획 저장에 실패했습니다.';
            alert(errorMessage);
        }
    };

    // 삭제 처리
    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`"${title}" 계획을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            await planApi.delete(id);
            alert('계획이 삭제되었습니다.');
            fetchPlans(selectedDate);
        } catch (error) {
            console.error('계획 삭제 실패:', error);
            alert('계획 삭제에 실패했습니다.');
        }
    };

    // 수정 모드
    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setTitle(plan.title);
        setContent(plan.content);
        setStartTime(plan.startTime);
        setEndTime(plan.endTime);
        setShowForm(true);
    };

    // 폼 닫기
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingPlan(null);
        setTitle('');
        setContent('');
        setStartTime('09:00');
        setEndTime('10:00');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>플래너</h1>

            {/* 날짜 선택 */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                <button
                    onClick={() => setShowForm(true)}
                    style={{ marginLeft: '10px', padding: '10px 20px' }}
                >
                    + 계획 추가
                </button>
            </div>

            {/* 계획 목록 */}
            {loading ? (
                <div>로딩 중...</div>
            ) : plans.length === 0 ? (
                <div>등록된 계획이 없습니다.</div>
            ) : (
                <div>
                    {plans.map((plan) => (
                        <div
                            key={plan.planId}
                            style={{
                                border: '1px solid #ddd',
                                padding: '15px',
                                marginBottom: '10px',
                                borderRadius: '4px',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <h3 style={{ margin: 0 }}>{plan.title}</h3>
                                <div>
                                    <button
                                        onClick={() => handleEdit(plan)}
                                        style={{ marginRight: '10px', padding: '5px 10px' }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan.planId, plan.title)}
                                        style={{ padding: '5px 10px' }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                                {plan.startTime} ~ {plan.endTime}
                            </p>
                            {plan.content && <p style={{ margin: '5px 0' }}>{plan.content}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* 추가/수정 모달 */}
            {showForm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onClick={handleCloseForm}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '30px',
                            borderRadius: '8px',
                            width: '500px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{editingPlan ? '계획 수정' : '계획 추가'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>제목</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="계획 제목"
                                    style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                                    autoFocus
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>내용</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="계획 내용 (선택)"
                                    style={{ width: '100%', padding: '8px', fontSize: '16px', minHeight: '80px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>시작 시간</label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>종료 시간</label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    style={{ flex: 1, padding: '10px' }}
                                >
                                    취소
                                </button>
                                <button type="submit" style={{ flex: 1, padding: '10px' }}>
                                    {editingPlan ? '수정' : '추가'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanPage;