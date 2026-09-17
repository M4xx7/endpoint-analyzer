import { rangeLabels, type TimeRange } from "./useTimeFilter";

type Props = {
  timeRange: TimeRange;
  onChange: (range: TimeRange) => void;
};

export function TimeRangeSelector({ timeRange, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2 ">
      {(Object.keys(rangeLabels) as TimeRange[]).map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors text-center w-[120px] ${timeRange === range
            ? "bg-indigo-500 text-white shadow-md"
            : "bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
        >
          {rangeLabels[range]}
        </button>
      ))}
    </div>
  );
}