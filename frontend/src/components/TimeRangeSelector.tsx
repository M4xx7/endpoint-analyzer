import { rangeLabels, type TimeRange } from "../utils/useTimeFilter";

type Props = {
  timeRange: TimeRange;
  onChange: (range: TimeRange) => void;
};

export function TimeRangeSelector({ timeRange, onChange }: Props) {
  return (
    <div className="time-selector-container">
      {(Object.keys(rangeLabels) as TimeRange[]).map((range) => {
        const isActive = timeRange === range;

        return (
          <button
            key={range}
            onClick={() => onChange(range)}
            className={`time-selector-btn ${isActive ? "time-selector-btn-active" : "time-selector-btn-inactive"
              }`}
          >
            {rangeLabels[range]}
          </button>
        );
      })}
    </div>
  );
}