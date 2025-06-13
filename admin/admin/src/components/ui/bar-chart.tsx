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

interface BarChartProps {
  data: Array<{[key: string]: any}>
  xAxis: string
  yAxis: string
  title?: string
}

export function BarChart({ data, xAxis, yAxis, title }: BarChartProps) {
  const chartData = {
    labels: data.map(item => item[xAxis]),
    datasets: [{
      label: yAxis,
      data: data.map(item => item[yAxis]),
      backgroundColor: 'rgba(59, 130, 246, 0.5)'
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
    },
  }

  return <Bar options={options} data={chartData} />
}