<script setup>
import { Sheet as SheetPrimitive } from 'radix-vue'
import { computed } from 'vue'

const props = defineProps({
  side: {
    type: String,
    default: 'right',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value),
  },
})

const sideStyles = computed(() => ({
  top: 'inset-x-0 top-0 border-b',
  right: 'inset-y-0 right-0 h-full w-3/12 border-l',
  bottom: 'inset-x-0 bottom-0 border-t',
  left: 'inset-y-0 left-0 h-full border-r',
}))
</script>