// src/domain/timer/components/TimerDisplay.tsx

interface Props {
    elapsed: number;
}

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const TimerDisplay = ({ elapsed }: Props) => {
    return <h1>{formatTime(elapsed)}</h1>;
};

export default TimerDisplay;
