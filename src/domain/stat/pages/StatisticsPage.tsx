// src/domain/statistics/pages/StatisticsPage.tsx
import { useState, useEffect } from 'react';
import { statisticsApi } from '../api/statisticsApi';
import type {Stat} from "../types/statistics.ts";

const StatisticsPage = () => {
    const [todayStats, setTodayStats] = useState<Stat | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<Stat | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<Stat | null>(null);
    const [loading, setLoading] = useState(true); // true로 시작

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}시간 ${minutes}분`;
    };

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                // 오늘 통계
                const todayData = await statisticsApi.getTodayStats();
                setTodayStats(todayData);

                // 주간 통계
                const today = new Date();
                const monday = new Date(today);
                monday.setDate(today.getDate() - today.getDay() + 1);
                const weekStart = monday.toISOString().split('T')[0];
                const weeklyData = await statisticsApi.getWeekly(weekStart);
                setWeeklyStats(weeklyData);

                // 월간 통계
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

    if (loading) {
        return <div style={{ padding: '20px' }}>로딩 중...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>학습 통계</h1>

            {/* 오늘 통계 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>오늘</h2>
                {todayStats && (
                    <>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            총 {formatTime(todayStats.totalStudyTime)}
                        </p>
                        <div>
                            <h3>과목별</h3>
                            {todayStats.subjects.length > 0 ? (
                                todayStats.subjects.map((subject, idx) => (
                                    <div key={idx} style={{ marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{subject.subjectName}</span>
                                            <span>{formatTime(subject.totalStudyTime)} ({subject.ratio}%)</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>학습 기록이 없습니다.</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* 주간 통계 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>이번 주</h2>
                {weeklyStats && (
                    <>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            총 {formatTime(weeklyStats.totalStudyTime)}
                        </p>
                        <div>
                            <h3>과목별</h3>
                            {weeklyStats.subjects.length > 0 ? (
                                weeklyStats.subjects.map((subject, idx) => (
                                    <div key={idx} style={{ marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{subject.subjectName}</span>
                                            <span>{formatTime(subject.totalStudyTime)} ({subject.ratio}%)</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>학습 기록이 없습니다.</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* 월간 통계 */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h2>이번 달</h2>
                {monthlyStats && (
                    <>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            총 {formatTime(monthlyStats.totalStudyTime)}
                        </p>
                        <div>
                            <h3>과목별</h3>
                            {monthlyStats.subjects.length > 0 ? (
                                monthlyStats.subjects.map((subject, idx) => (
                                    <div key={idx} style={{ marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{subject.subjectName}</span>
                                            <span>{formatTime(subject.totalStudyTime)} ({subject.ratio}%)</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>학습 기록이 없습니다.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StatisticsPage;