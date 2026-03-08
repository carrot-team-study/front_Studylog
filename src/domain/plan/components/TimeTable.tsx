// src/domain/plan/components/PlanPage.tsx
import type { Plan } from '../types/plan';

const COLORS = [
    '#e69f00', // Orange
    '#56b4e9', // Sky blue
    '#00c48f', // Bluish green
    '#0090d4', // Blue
    '#f07040', // Vermillion
    '#e090bb', // Reddish purple
    '#5544aa', // Indigo
    '#2a9a4a', // Forest green
    '#b03370', // Wine
    '#44aa99', // Teal
];

const TimeTable = ({ plans }: { plans: Plan[] }) => {
    const START_HOUR = 5; // 05:00
    const TOTAL_HOURS = 23; // 05:00 ~ 04:00 (23시간)
    const HOUR_HEIGHT = 60; // px per hour

    const getPosition = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        const adjustedHour = h < 5 ? h + 24 : h; // 00~04시는 다음날로
        return (adjustedHour - START_HOUR) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
    };

    const getHeight = (startTime: string, endTime: string) => {
        const start = getPosition(startTime);
        const end = getPosition(endTime);
        return Math.max(end - start, 20); // 최소 20px
    };

    const hours = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
        const h = (START_HOUR + i) % 24;
        return `${String(h).padStart(2, '0')}:00`;
    });

    return (
        <div className="timetable-container">
            <div className="timetable-grid">
                {/* 시간 레이블 */}
                <div className="timetable-labels">
                    {hours.map((h) => (
                        <div key={h} className="timetable-label" style={{ height: HOUR_HEIGHT }}>
                            {h}
                        </div>
                    ))}
                </div>

                {/* 계획 블록 */}
                <div className="timetable-events" style={{ height: TOTAL_HOURS * HOUR_HEIGHT }}>
                    {/* 배경 선 */}
                    {hours.map((h, i) => (
                        <div key={h} className="timetable-line" style={{ top: i * HOUR_HEIGHT }} />
                    ))}

                    {/* 계획 블록 */}
                    {plans.map((plan, index) => (
                        <div
                            key={plan.planId}
                            className="timetable-block"
                            style={{
                                top: getPosition(plan.startTime),
                                height: getHeight(plan.startTime, plan.endTime),
                                background: COLORS[index % COLORS.length], // 추가
                            }}
                        >
                            <span className="timetable-block-title">{plan.title}</span>
                            <span className="timetable-block-time">{plan.startTime}~{plan.endTime}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimeTable;