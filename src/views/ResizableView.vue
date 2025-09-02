<template>
  <div class="- relative h-full w-full">
    <div
      ref="resizable"
      class="resizable relative -m-3 box-border h-full w-full rounded border-2 border-slate-600 p-3"
    >
      <MainView class="h-full min-h-full w-full" />
    </div>
    <ContainerComponent class="absolute right-2.5 -bottom-8 bg-slate-100 p-0.5!" @click="reset()"
      >Reset Resize</ContainerComponent
    >
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import MainView from './MainView.vue'
import ContainerComponent from '@/components/ContainerComponent.vue'
type Side = 'left' | 'right' | 'top' | 'bottom'
const sides: Side[] = ['left', 'right', 'top', 'bottom']
const corners: Side[][] = [
  ['top', 'left'],
  ['top', 'right'],
  ['bottom', 'left'],
  ['bottom', 'right']
]

const resizable = useTemplateRef('resizable')
function getResizers() {
  return [...sides.map((s) => buildResizer([s])), ...corners.map(buildResizer)]
}
function buildResizer(sides: Side[]) {
  const e = document.createElement('div')
  e.classList.add('resizer', ...sides)
  if (sides.length > 1) {
    e.classList.add('corner')
  } else {
    e.classList.add('edge')
  }
  e.onmousedown = buildClickListener(e, sides)
  return e
}
function buildClickListener(el: HTMLElement, sides: Side[]) {
  void el
  void sides
  let originalX = -1
  let originalY = -1
  let originalWidth = -1
  let originalHeight = -1
  let mouseStartX = -1
  let mouseStartY = -1
  function onMouseDown(e: MouseEvent) {
    originalX = resizable.value!.getBoundingClientRect().left
    originalY = resizable.value!.getBoundingClientRect().top
    originalWidth = parseFloat(getComputedStyle(resizable.value!, null).width.replace('px', ''))
    originalHeight = parseFloat(getComputedStyle(resizable.value!, null).height.replace('px', ''))

    mouseStartX = e.pageX
    mouseStartY = e.pageY

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    document.body.classList.add('no-select')
  }
  function onMouseMove(e: MouseEvent) {
    const dx = e.pageX - mouseStartX
    const dy = e.pageY - mouseStartY

    if (sides.includes('top')) {
      resizable.value!.style.top = originalY + dy + 'px'
      resizable.value!.style.height = originalHeight - dy + 'px'
    }
    if (sides.includes('bottom')) {
      resizable.value!.style.height = originalHeight + dy + 'px'
    }
    if (sides.includes('left')) {
      resizable.value!.style.left = originalX + dx + 'px'
      resizable.value!.style.width = originalWidth - dx + 'px'
    }
    if (sides.includes('right')) {
      resizable.value!.style.width = originalWidth + dx + 'px'
    }
    save()
  }
  function onMouseUp() {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    document.body.classList.remove('no-select')
  }
  return onMouseDown
}

onMounted(() => {
  if (!resizable.value) {
    console.error('No resizable container found')
    return
  }
  load()

  getResizers().forEach((r) => resizable.value?.appendChild(r))
})

function reset() {
  if (!resizable.value) {
    return
  }
  resizable.value.style.width = '100%'
  resizable.value.style.height = '100%'
  resizable.value.style.left = '0'
  resizable.value.style.top = '0'

  save()
}
const prefix = '999fish-resize'
const cssValues = ['top', 'left', 'height', 'width'] as const
type CssValues = (typeof cssValues)[number]
function save() {
  if (!resizable.value) {
    return
  }
  const numbers: Record<CssValues, number> = {
    top: resizable.value.getBoundingClientRect().top,
    left: resizable.value.getBoundingClientRect().left,
    width: parseFloat(getComputedStyle(resizable.value!, null).width.replace('px', '')),
    height: parseFloat(getComputedStyle(resizable.value!, null).height.replace('px', ''))
  }

  for (const s of cssValues) {
    localStorage.setItem(`${prefix}:${s}`, numbers[s].toString())
  }
}
function load() {
  if (!resizable.value) {
    return
  }
  const numbers: Partial<Record<CssValues, number>> = {}
  for (const s of cssValues) {
    const item = localStorage.getItem(`${prefix}:${s}`)
    if (!item) continue
    numbers[s] = parseFloat(item)
  }
  if (numbers.top) {
    resizable.value.style.top = numbers.top + 'px'
  }
  if (numbers.left) {
    resizable.value.style.left = numbers.left + 'px'
  }
  if (numbers.height) {
    resizable.value.style.height = numbers.height + 'px'
  }
  if (numbers.width) {
    resizable.value.style.width = numbers.width + 'px'
  }
}
</script>

<style>
body.no-select * {
  user-select: none;
}

.resizer {
  position: absolute;
  z-index: 100;
  --corner-size: 10px;
  --corner-outset: -5px;
  --edge-width: 5px;
  --edge-outset: -3px;
}

.resizer.edge.top,
.resizer.edge.bottom {
  cursor: ns-resize;
  left: 0;
  right: 0;
  height: var(--edge-width);
}
.resizer.edge.top {
  top: var(--edge-outset);
}
.resizer.edge.bottom {
  bottom: var(--edge-outset);
}
.resizer.edge.left,
.resizer.edge.right {
  cursor: ew-resize;
  top: 0;
  bottom: 0;
  width: var(--edge-width);
}
.resizer.edge.left {
  left: var(--edge-outset);
}
.resizer.edge.right {
  right: var(--edge-outset);
}

.resizer.corner {
  width: var(--corner-size);
  height: var(--corner-size);
}
.resizer.corner.top {
  top: var(--corner-outset);
}
.resizer.corner.bottom {
  bottom: var(--corner-outset);
}
.resizer.corner.left {
  left: var(--corner-outset);
}
.resizer.corner.right {
  right: var(--corner-outset);
}
.resizer.corner.top.right,
.resizer.corner.bottom.left {
  cursor: nesw-resize;
}
.resizer.corner.top.left,
.resizer.corner.bottom.right {
  cursor: nwse-resize;
}
</style>
