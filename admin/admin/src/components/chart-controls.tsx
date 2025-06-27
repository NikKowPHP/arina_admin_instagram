'use client'

interface ChartControlsProps {
  dateRange: string
  onDateRangeChange: (range: string) => void
  chartType: string
  onChartTypeChange: (type: string) => void
  visibleData: string[]
  onVisibleDataChange: (data: string[]) => void
}

export function ChartControls({
  dateRange,
  onDateRangeChange,
  chartType,
  onChartTypeChange,
  visibleData,
  onVisibleDataChange
}: ChartControlsProps) {
  return (
    <div className="space-y-4 p-4 border rounded">
      <div>
        <label className="block text-sm font-medium mb-1">Date Range</label>
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Chart Type</label>
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Visible Data</label>
        <div className="space-y-2">
          {['Triggers', 'Users', 'Templates'].map((item) => (
            <label key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={visibleData.includes(item)}
                onChange={(e) => {
                  const newVisible = e.target.checked
                    ? [...visibleData, item]
                    : visibleData.filter((v) => v !== item)
                  onVisibleDataChange(newVisible)
                }}
                className="rounded"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}