<template>
  <ContainerComponent class="border-amber-300! bg-amber-100 p-2!">
    <div class="flex flex-col gap-2">
      <ContainerComponent class="bg-slate-100">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <input id="cancelFish" v-model="store().cancelOtherFish" type="checkbox" />
            <label for="cancelFish">Cancel other fish</label>
          </div>
          <ToolTipComponent direction="right">
            <template #default>
              <div class="flex items-center gap-2" :class="{ disabled: !store().cancelOtherFish }">
                Cancel after
                <NumberInput
                  v-model="store().cancelOtherFishTime"
                  :disabled="!store().cancelOtherFish"
                />
                seconds
              </div>
            </template>
            <template #tooltip>
              This is the time you take to cancel an undesired fish after hooking it. (E.g. If you
              use a sonar bobber this time might be lower, if you react to the fish's pattern it
              might be higher)
            </template>
          </ToolTipComponent>
          <ContainerComponent
            class="bg-white py-0! text-center"
            :class="{ disabled: !store().cancelOtherFish }"
            @click="setShowSelector(true)"
            >Configure Fish</ContainerComponent
          >
          <TargetedFishSelector v-if="showSelector" @close="showSelector = false" />
        </div>
      </ContainerComponent>

      <ContainerComponent class="bg-slate-100">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <input id="cancelChests" v-model="store().cancelChests" type="checkbox" />
            <label for="cancelChests">Cancel no chest</label>
          </div>
          <ToolTipComponent direction="right">
            <template #default>
              <div class="flex items-center gap-2" :class="{ disabled: !store().cancelChests }">
                Cancel after
                <NumberInput v-model="store().chestCancelTime" :disabled="!store().cancelChests" />
                seconds
              </div>
            </template>
            <template #tooltip>
              This is the time you wait for a chest to appear after hooking a fish before you cancel
              the catch. Chests always appear in the first 5 seconds, but you may choose to wait
              longer to be safe.
            </template>
          </ToolTipComponent>
        </div>
      </ContainerComponent>

      <div class="flex flex-col gap-2">
        <ToolTipComponent direction="right">
          <template #default>
            <div class="flex items-center gap-2">
              <label class="w-21">Catch Time:</label>
              <NumberInput v-model="store().castingOverhead" />
              <span>seconds</span>
            </div>
          </template>
          <template #tooltip>
            This is the average time you spend in the minigame. For harder fish this time should be
            higher.
          </template>
        </ToolTipComponent>
        <ToolTipComponent direction="right">
          <template #default>
            <div class="flex items-center gap-2">
              <label class="w-21">Cast Time:</label>
              <NumberInput v-model="store().castingOverhead" />
              <span>seconds</span>
            </div>
          </template>
          <template #tooltip>
            This is all the extra time a cast takes. This should include: The cast duration, the
            real in time
          </template>
        </ToolTipComponent>
      </div>
    </div>
  </ContainerComponent>
</template>

<script setup lang="ts">
import { store } from '@/store'
import NumberInput from '../base/NumberInput.vue'
import ContainerComponent from '../ContainerComponent.vue'
import TargetedFishSelector from './TargetedFishSelector.vue'
import { ref } from 'vue'
import ToolTipComponent from '../base/ToolTipComponent.vue'

const showSelector = ref(false)

function setShowSelector(value: boolean) {
  if (!store().cancelOtherFish) return
  showSelector.value = value
}
</script>

<style>
@reference "../../style.css";

.disabled,
.disabled * {
  @apply text-slate-400!;
}
</style>
