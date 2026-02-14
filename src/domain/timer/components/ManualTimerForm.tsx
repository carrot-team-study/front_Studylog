import { useState } from "react";
import { addManualTimer } from "../api/timerApi";

interface ManualTimerFormProps {
    subjectId: number;
    onAdd?: () => void; // 기록 추가 후 리스트 갱신 콜백
}

const ManualTimerForm = ({ subjectId, onAdd }: ManualTimerFormProps) => {
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const duration = (hours * 60 + minutes) * 60;
        if (duration <= 0) return;

        try {
            await addManualTimer({ subjectId, duration });
            setHours(0);
            setMinutes(0);
            if (onAdd) onAdd();
        } catch (error) {
            console.error("수동 학습 기록 실패", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <label>
                학습 시간:
                <select
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    style={{ margin: "0 5px" }}
                >
                    {Array.from({ length: 13 }).map((_, i) => (
                        <option key={i} value={i}>
                            {i}시간
                        </option>
                    ))}
                </select>
                <select
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    style={{ margin: "0 5px" }}
                >
                    {Array.from({ length: 60 }).map((_, i) => (
                        <option key={i} value={i}>
                            {i}분
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit" style={{ marginLeft: "10px" }}>
                기록 추가
            </button>
        </form>
    );
};

export default ManualTimerForm;
