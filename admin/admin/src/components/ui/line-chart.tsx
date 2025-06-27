'use client'

import { Line } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type LineChartDataItem = Record<string, unknown>

interface LineChartProps {
  datasets: LineChartDataItem[]
  xAxis: string
  yFields: string[]
  title?: string
  colors?: string[]
}

export function LineChart({ datasets, xAxis, yFields, title, colors }: LineChartProps) {
  const chartData = {
    labels: datasets.map(item => item[xAxis]),
    datasets: yFields.map((field, index) => ({
      label: field,
      data: datasets.map(item => item[field]),
      borderColor: colors?.[index] || 'rgba(59, 130, 246, 0.5)',
      backgroundColor: colors?.[index] || 'rgba(59, 130, 246, 0.2)'
    }))
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  }

  return <Line options={options} data={chartData} />
}