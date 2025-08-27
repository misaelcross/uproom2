import React from 'react';

const TopTabsSchedule = ({ timeFrame, onTimeFrameChange }) => {
  return (
    <div className="w-fit min-w-0 rounded-lg h-20 py-6 flex flex-col justify-center">
      {/* Tabs */}
      <div className="flex space-x-2 bg-neutral-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => onTimeFrameChange('Day')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            timeFrame === 'Day'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => onTimeFrameChange('Week')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            timeFrame === 'Week'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => onTimeFrameChange('Month')}
          className={`w-fit px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            timeFrame === 'Month'
              ? 'bg-neutral-700 text-white'
              : 'bg-transparent text-neutral-400 hover:text-gray-300'
          }`}
        >
          Month
        </button>
      </div>
    </div>
  );
};

export default TopTabsSchedule;