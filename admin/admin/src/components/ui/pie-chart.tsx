'use client'

import { Pie } from 'react-chartjs-2'
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

type PieChartDataItem = Record<string, unknown>

interface PieChartProps {
  datasets: PieChartDataItem[]
  labelField: string
  valueField: string
  title?: string
  colors?: string[]
}

export function PieChart({ datasets, labelField, valueField, title, colors }: PieChartProps) {
  const chartData = {
    labels: datasets.map(item => item[labelField]),
    datasets: [{
      label: valueField,
      data: datasets.map(item => item[valueField]),
      backgroundColor: colors || [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
      ],
      borderWidth: 1,
    }]
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
  }

  return <Pie options={options} data={chartData} />
}