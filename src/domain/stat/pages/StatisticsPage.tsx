// src/domain/statistics/pages/StatisticsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { statisticsApi } from '../api/statisticsApi';
import type { Stat } from '../types/statistics.ts';
import '../css/StatisticsPage.css';

const StatisticsPage = () => {
    const navigate = useNavigate();
    const [todayStats, setTodayStats] = useState<Stat | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<Stat | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<Stat | null>(null);
    const [loading, setLoading] = useState(true);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}시간 ${minutes}분`;
        return `${minutes}분`;
    };

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const todayData = await statisticsApi.getTodayStats();
                setTodayStats(todayData);

                const today = new Date();
                const monday = new Date(today);
                monday.setDate(today.getDate() - today.getDay() + 1);
                const weekStart = monday.toISOString().split('T')[0];
                const weeklyData = await statisticsApi.getWeekly(weekStart);
                setWeeklyStats(weeklyData);

                const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
                const monthlyData = await statisticsApi.getMonthly(month);
                setMonthlyStats(monthlyData);
            } catch (error) {
                console.error('통계 조회 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllStats();
    }, []);

    const StatCard = ({ title, stat }: { title: string; stat: Stat | null }) => (
        <div className="stat-card">
            <p className="stat-card-title">{title}</p>
            {stat ? (
                <>
                    <p className="stat-total">{formatTime(stat.totalStudyTime)}</p>
                    {stat.subjects.length > 0 ? (
                        <div className="stat-subject-list">
                            {stat.subjects.map((subject, idx) => (
                                <div key={idx} className="stat-subject-row">
                                    <div className="stat-subject-info">
                                        <span className="stat-subject-name">{subject.subjectName}</span>
                                        <span className="stat-subject-time">
                                            {formatTime(subject.totalStudyTime)} · {subject.ratio}%
                                        </span>
                                    </div>
                                    <div className="stat-bar-track">
                                        <div className="stat-bar-fill" style={{ width: `${subject.ratio}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">학습 기록이 없습니다.</p>
                    )}
                </>
            ) : (
                <p className="no-data">데이터를 불러오는 중...</p>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="stat-container">
                <header className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2>학습 통계</h2>
                    <div style={{ width: 40 }} />
                </header>
                <div className="loading-state">불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="stat-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>학습 통계</h2>
                <div style={{ width: 40 }} />
            </header>

            <div className="stat-body">
                <StatCard title="오늘" stat={todayStats} />
                <StatCard title="이번 주" stat={weeklyStats} />
                <StatCard title="이번 달" stat={monthlyStats} />
            </div>
        </div>
    );
};

export default StatisticsPage;