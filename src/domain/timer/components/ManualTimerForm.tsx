// src/domain/timer/components/ManualTimeForm.tsx

import { useState } from "react";
import { addManualTimer } from "../api/timerApi";

interface ManualTimerFormProps {
    subjectId: number;
    onAdd?: () => void; // 기록 추가 후 리스트 갱신 콜백
}

const ManualTimerForm = ({ subjectId, onAdd }: ManualTimerFormProps) => {
    // 시, 분
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

        <div className="card mt-4 shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-3 fw-bold">
                    수동 학습 기록
                </h5>

                <form onSubmit={handleSubmit}>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        <select className="form-select"
                                style={{ width: "7rem" }}
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}>
                            {Array.from({ length: 13 }).map((_, i) => (
                                <option key={i} value={i}>{i}시간</option>
                            ))}
                        </select>

                        <select className="form-select"
                                style={{ width: "7rem" }}
                                value={minutes}
                                onChange={(e) => setMinutes(Number(e.target.value))}>
                            {Array.from({ length: 60 }).map((_, i) => (
                                <option key={i} value={i}>{i}분</option>
                            ))}
                        </select>

                        <button type="submit" className="btn btn-primary" style={{ backgroundColor:"#5c9edc" }}>
                            기록 추가
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualTimerForm;