// src/components/companydashboard/Widgets/ProgressBar.jsx
export default function ProgressBar({ value = 0 }) {
  const getColor = (val) => {
    if (val >= 80) return "from-green-400 to-emerald-500";
    if (val >= 50) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-red-500";
  };

  return (
    <div className="w-48 h-3 bg-gray-100 rounded-full overflow-hidden relative">
      <div
        style={{ width: `${value}%` }}
        className={`h-full bg-gradient-to-r ${getColor(value)} transition-all duration-500 ease-out rounded-full relative`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
      </div>
    </div>
  );
}