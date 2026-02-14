// src/domain/subject/pages/SubjectPage.tsx
import { useState, useEffect } from 'react';
import { subjectApi } from '../api/subjectApi';
import type {Subject} from "../types/subject.ts";

const SubjectPage = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [subjectName, setSubjectName] = useState('');
    const [loading, setLoading] = useState(false);

    // 과목 목록 조회
    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const data = await subjectApi.getAll();
            setSubjects(data);
        } catch (error) {
            console.error('과목 조회 실패:', error);
            alert('과목 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    // 추가/수정 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subjectName.trim()) {
            alert('과목명을 입력하세요');
            return;
        }

        if (subjectName.length > 20) {
            alert('과목명은 20자를 초과할 수 없습니다.');
            return;
        }

        try {
            if (editingSubject) {
                await subjectApi.update(editingSubject.subjectId, { subjectName });
                alert('과목이 수정되었습니다.');
            } else {
                await subjectApi.create({ subjectName });
                alert('과목이 추가되었습니다.');
            }
            setShowForm(false);
            setEditingSubject(null);
            setSubjectName('');
            fetchSubjects();
        } catch (error) {  // ← any 제거
            console.error('과목 저장 실패:', error);
            const errorMessage = error instanceof Error ? error.message : '과목 저장에 실패했습니다.';
            alert(errorMessage);
        }
    };

    // 삭제 처리
    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`"${name}" 과목을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            await subjectApi.delete(id);
            alert('과목이 삭제되었습니다.');
            fetchSubjects();
        } catch (error) {
            console.error('과목 삭제 실패:', error);
            alert('과목 삭제에 실패했습니다.');
        }
    };

    // 수정 모드
    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setSubjectName(subject.subjectName);
        setShowForm(true);
    };

    // 폼 닫기
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingSubject(null);
        setSubjectName('');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>과목 관리</h1>

            <button
                onClick={() => setShowForm(true)}
                style={{ marginBottom: '20px', padding: '10px 20px' }}
            >
                + 과목 추가
            </button>

            {loading ? (
                <div>로딩 중...</div>
            ) : subjects.length === 0 ? (
                <div>등록된 과목이 없습니다.</div>
            ) : (
                <div>
                    {subjects.map((subject) => (
                        <div
                            key={subject.subjectId}
                            style={{
                                border: '1px solid #ddd',
                                padding: '15px',
                                marginBottom: '10px',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span>{subject.subjectName}</span>
                            <div>
                                <button
                                    onClick={() => handleEdit(subject)}
                                    style={{ marginRight: '10px', padding: '5px 10px' }}
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(subject.subjectId, subject.subjectName)}
                                    style={{ padding: '5px 10px' }}
                                >
                                    삭제
                                </button>
                            </div>
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
                        alignItems: 'center'
                    }}
                    onClick={handleCloseForm}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '30px',
                            borderRadius: '8px',
                            width: '400px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{editingSubject ? '과목 수정' : '과목 추가'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                placeholder="과목명을 입력하세요"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '20px',
                                    fontSize: '16px'
                                }}
                                autoFocus
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    style={{ flex: 1, padding: '10px' }}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '10px' }}
                                >
                                    {editingSubject ? '수정' : '추가'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectPage;