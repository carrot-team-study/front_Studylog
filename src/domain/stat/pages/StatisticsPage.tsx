// src/domain/statistics/pages/StatisticsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { statisticsApi } from '../api/statisticsApi';
import type { Stat, StatSubject } from '../types/statistics.ts';
import '../css/StatisticsPage.css';

const StatisticsPage = () => {
    const navigate = useNavigate();
    const [todayStats, setTodayStats] = useState<Stat | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<Stat | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<Stat | null>(null);
    const [selectedWeekDate, setSelectedWeekDate] = useState<string | null>(null);
    const [selectedWeekDayStats, setSelectedWeekDayStats] = useState<Stat | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentWeekStart, setCurrentWeekStart] = useState<string>(() => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        return monday.toISOString().split('T')[0];
    });

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}시간 ${minutes}분`;
        return `${minutes}분`;
    };

    const getWeekDates = (weekStart: string): string[] => {
        const monday = new Date(weekStart);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d.toISOString().split('T')[0];
        });
    };

    const getWeekLabel = (weekStart: string): string => {
        const start = new Date(weekStart);
        const end = new Date(weekStart);
        end.setDate(end.getDate() + 6);
        return `${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`;
    };

    const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

    const fetchWeekly = async (weekStart: string) => {
        try {
            const weeklyData = await statisticsApi.getWeekly(weekStart);
            setWeeklyStats(weeklyData);
            setSelectedWeekDate(null);
            setSelectedWeekDayStats(null);
        } catch (error) {
            console.error('주간 통계 조회 실패:', error);
        }
    };

    const handlePrevWeek = () => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() - 7);
        const newWeekStart = d.toISOString().split('T')[0];
        setCurrentWeekStart(newWeekStart);
        fetchWeekly(newWeekStart);
    };

    const handleNextWeek = () => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + 7);
        const newWeekStart = d.toISOString().split('T')[0];
        setCurrentWeekStart(newWeekStart);
        fetchWeekly(newWeekStart);
    };

    const handleWeekDateSelect = async (date: string) => {
        if (selectedWeekDate === date) {
            setSelectedWeekDate(null);
            setSelectedWeekDayStats(null);
            return;
        }
        setSelectedWeekDate(date);
        try {
            const data = await statisticsApi.getDailyStats(date);
            setSelectedWeekDayStats(data);
        } catch {
            setSelectedWeekDayStats(null);
        }
    };

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const todayData = await statisticsApi.getTodayStats();
                setTodayStats(todayData);

                const weeklyData = await statisticsApi.getWeekly(currentWeekStart);
                setWeeklyStats(weeklyData);

                const today = new Date();
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

    const SubjectList = ({ subjects }: { subjects: StatSubject[] }) => (
        subjects.length > 0 ? (
            <div className="stat-subject-list">
                {subjects.map((subject, idx) => (
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
        )
    );

    const WeeklyCard = ({ stat }: { stat: Stat }) => {
        const weekDates = getWeekDates(currentWeekStart);
        return (
            <div className="stat-card">
                <p className="stat-card-title">주간 기록</p>
                <div className="week-nav">
                    <button className="week-nav-btn" onClick={handlePrevWeek}>←</button>
                    <span className="week-nav-label">{getWeekLabel(currentWeekStart)}</span>
                    <button className="week-nav-btn" onClick={handleNextWeek}>→</button>
                </div>
                <p className="stat-total">{formatTime(stat.totalStudyTime)}</p>

                <div className="week-date-row">
                    {weekDates.map((date, i) => {
                        const dailyStat = stat.dailyStats?.find(d => d.startDate === date);
                        const isSelected = selectedWeekDate === date;
                        return (
                            <div
                                key={date}
                                className={`week-date-cell ${isSelected ? 'active' : ''}`}
                                onClick={() => handleWeekDateSelect(date)}
                            >
                                <span className="week-day-label">{DAY_LABELS[i]}</span>
                                <span className="week-day-time">
                                    {dailyStat ? formatTime(dailyStat.totalStudyTime) : '-'}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {selectedWeekDate && (
                    <div className="week-day-detail">
                        <p className="week-day-detail-title">
                            {new Date(selectedWeekDate).getMonth() + 1}월{' '}
                            {new Date(selectedWeekDate).getDate()}일
                        </p>
                        {selectedWeekDayStats ? (
                            <SubjectList subjects={selectedWeekDayStats.subjects} />
                        ) : (
                            <p className="no-data">불러오는 중...</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const StatCard = ({ title, stat }: { title: string; stat: Stat | null }) => (
        <div className="stat-card">
            <p className="stat-card-title">{title}</p>
            {stat ? (
                <>
                    <p className="stat-total">{formatTime(stat.totalStudyTime)}</p>
                    <SubjectList subjects={stat.subjects} />
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
                {weeklyStats && <WeeklyCard stat={weeklyStats} />}
                <StatCard title="이번 달" stat={monthlyStats} />
            </div>
        </div>
    );
};

export default StatisticsPage;