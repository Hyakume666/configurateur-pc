<script setup>
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps({
  scores: { type: Object, required: true }
})

const chartData = computed(() => ({
  labels: ['Gaming FPS', 'Qualité visuelle', 'Création', 'Rapport Q/P', 'Longévité'],
  datasets: [
    {
      label: 'Performance',
      data: [
        props.scores.gaming || 0,
        props.scores.gaming ? Math.min(100, props.scores.gaming + 5) : 0,
        props.scores.creation || 0,
        props.scores.value || 0,
        props.scores.future || 0
      ],
      backgroundColor: 'rgba(0, 229, 255, 0.18)',
      borderColor: 'rgba(0, 229, 255, 0.9)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(168, 85, 247, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 229, 255, 1)',
      pointRadius: 4
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900, easing: 'easeOutCubic' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(10,13,20,0.95)',
      borderColor: 'rgba(0,229,255,0.4)',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: '#cbd5e1'
    }
  },
  scales: {
    r: {
      angleLines: { color: 'rgba(148,163,184,0.18)' },
      grid: { color: 'rgba(148,163,184,0.18)' },
      pointLabels: { color: '#cbd5e1', font: { size: 12, weight: '500' } },
      ticks: {
        color: 'rgba(148,163,184,0.6)',
        backdropColor: 'transparent',
        stepSize: 25,
        showLabelBackdrop: false
      },
      suggestedMin: 0,
      suggestedMax: 100
    }
  }
}
</script>

<template>
  <div class="relative w-full" style="height: 360px">
    <Radar :data="chartData" :options="options" />
  </div>
</template>
