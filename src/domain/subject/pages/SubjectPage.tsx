// src/domain/subject/pages/SubjectPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectApi } from '../api/subjectApi';
import type { Subject } from '../types/subject.ts';
import '../css/SubjectPage.css';

const SubjectPage = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [subjectName, setSubjectName] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subjectName.trim()) { alert('과목명을 입력하세요'); return; }
        if (subjectName.length > 20) { alert('과목명은 20자를 초과할 수 없습니다.'); return; }

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
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '과목 저장에 실패했습니다.';
            alert(errorMessage);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`"${name}" 과목을 삭제하시겠습니까?`)) return;
        try {
            await subjectApi.delete(id);
            alert('과목이 삭제되었습니다.');
            fetchSubjects();
        } catch {
            alert('과목 삭제에 실패했습니다.');
        }
    };

    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setSubjectName(subject.subjectName);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingSubject(null);
        setSubjectName('');
    };

    return (
        <div className="subject-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>과목 관리</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="subject-body">
                <button className="add-subject-btn" onClick={() => setShowForm(true)}>
                    + 과목 추가
                </button>

                {loading ? (
                    <div className="empty-state">불러오는 중...</div>
                ) : subjects.length === 0 ? (
                    <div className="empty-state">등록된 과목이 없습니다.</div>
                ) : (
                    <div className="subject-list">
                        {subjects.map((subject) => (
                            <div key={subject.subjectId} className="subject-item">
                                <span className="subject-name">{subject.subjectName}</span>
                                <div className="subject-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(subject)}>수정</button>
                                    <button className="delete-btn" onClick={() => handleDelete(subject.subjectId, subject.subjectName)}>삭제</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={handleCloseForm}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingSubject ? '과목 수정' : '과목 추가'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                className="modal-input"
                                type="text"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                placeholder="과목명을 입력하세요"
                                autoFocus
                            />
                            <div className="modal-actions">
                                <button type="button" className="modal-cancel-btn" onClick={handleCloseForm}>취소</button>
                                <button type="submit" className="modal-submit-btn">{editingSubject ? '수정' : '추가'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectPage;