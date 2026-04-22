<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  label: { type: String, default: '' },
  formatValue: { type: Function, default: (v) => v }
})

const emit = defineEmits(['update:modelValue'])

const fillPct = computed(
  () => ((props.modelValue - props.min) / (props.max - props.min)) * 100
)

function update(e) {
  emit('update:modelValue', Number(e.target.value))
}
</script>

<template>
  <div class="w-full">
    <div v-if="label" class="flex items-center justify-between mb-2">
      <label class="text-sm font-medium text-text-secondary">{{ label }}</label>
      <span class="text-sm text-neon-blue font-mono">{{ formatValue(modelValue) }}</span>
    </div>
    <div class="relative h-2 bg-bg-700 rounded-full overflow-hidden">
      <div
        class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-neon-blue transition-all duration-150"
        :style="{ width: `${fillPct}%` }"
      />
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      class="block w-full -mt-2 h-2 appearance-none bg-transparent cursor-pointer focus:outline-none range-input"
      @input="update"
    />
  </div>
</template>

<style scoped>
.range-input::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #00e5ff;
  border-radius: 9999px;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  cursor: pointer;
  margin-top: -8px;
}
.range-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #00e5ff;
  border-radius: 9999px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  cursor: pointer;
}
</style>
