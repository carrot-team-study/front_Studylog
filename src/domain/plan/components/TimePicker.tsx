// src/domain/plan/components/TimePicker.tsx
import { useState} from 'react';

const TimePicker = ({ value, onChange, minTime }: {
    value: string;
    onChange: (v: string) => void;
    minTime?: string;
}) => {
    const [ampm, setAmpm] = useState<'AM' | 'PM'>(() => {
        const h = parseInt(value.split(':')[0]);
        return h < 12 ? 'AM' : 'PM';
    });

    const selectedHour = parseInt(value.split(':')[0]);
    const selectedMin = parseInt(value.split(':')[1]);

    const minH = minTime ? parseInt(minTime.split(':')[0]) : -1;
    const minM = minTime ? parseInt(minTime.split(':')[1]) : -1;

    const hours = Array.from({ length: 12 }, (_, i) => {
        const h = ampm === 'AM' ? i : i + 12; // 0~11, 12~23
        return h;
    });

    const minutes = Array.from({ length: 6 }, (_, i) => i * 10); // 0,10,20,30,40,50

    const isHourDisabled = (h: number) => {
        if (!minTime) return false;
        return h < minH;
    };

    const isMinDisabled = (m: number) => {
        if (!minTime) return false;
        return selectedHour === minH && m <= minM;
    };

    const handleAmpmChange = (selected: 'AM' | 'PM') => {
        setAmpm(selected);
        const newH = selected === 'AM' ? selectedHour - 12 : selectedHour + 12;
        const clamped = Math.max(0, Math.min(23, newH));
        onChange(`${String(clamped).padStart(2, '0')}:${String(selectedMin).padStart(2, '0')}`);
    };

    const handleHour = (h: number) => {
        onChange(`${String(h).padStart(2, '0')}:${String(selectedMin).padStart(2, '0')}`);
    };

    const handleMin = (m: number) => {
        onChange(`${String(selectedHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    };

    const displayHour = selectedHour % 12 || 12;

    return (
        <div className="time-picker">
            <div className="ampm-toggle">
                <button type="button" className={`ampm-btn ${ampm === 'AM' ? 'active' : ''}`}
                        onClick={() => handleAmpmChange('AM')}>오전</button>
                <button type="button" className={`ampm-btn ${ampm === 'PM' ? 'active' : ''}`}
                        onClick={() => handleAmpmChange('PM')}>오후</button>
            </div>
            <div className="time-scroll-row">
                {/* 시 */}
                <div className="time-scroll-col">
                    {hours.map(h => {
                        const display = h % 12 || 12;
                        const disabled = isHourDisabled(h);
                        return (
                            <button
                                key={h}
                                type="button"
                                className={`time-scroll-cell ${displayHour === display && selectedHour === h ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                                onClick={() => !disabled && handleHour(h)}
                            >
                                {display}시
                            </button>
                        );
                    })}
                </div>
                <div className="time-scroll-divider" />
                {/* 분 */}
                <div className="time-scroll-col">
                    {minutes.map(m => {
                        const disabled = isMinDisabled(m);
                        return (
                            <button
                                key={m}
                                type="button"
                                className={`time-scroll-cell ${selectedMin === m ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                                onClick={() => !disabled && handleMin(m)}
                            >
                                {String(m).padStart(2, '0')}분
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TimePicker;