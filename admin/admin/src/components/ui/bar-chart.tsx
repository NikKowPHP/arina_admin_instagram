'use client'

import { Bar } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type BarChartDataItem = Record<string, unknown> // Generic chart data type

interface BarChartProps {
  datasets: BarChartDataItem[]
  xAxis: string
  yFields: string[]
  title?: string
  colors?: string[]
}

export function BarChart({ datasets, xAxis, yFields, title, colors }: BarChartProps) {
  const chartData = {
    labels: datasets.map(item => item[xAxis]),
    datasets: yFields.map((field, index) => ({
      label: field,
      data: datasets.map(item => item[field]),
      backgroundColor: colors?.[index] || 'rgba(59, 130, 246, 0.5)'
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

  return <Bar options={options} data={chartData} />
}