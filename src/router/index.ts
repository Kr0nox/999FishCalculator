import MainView from '@/views/MainView.vue'
import MathView from '@/views/MathView.vue'
import StackCalcView from '@/views/StackCalcView.vue'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * The router is used to navigate between the different views of the application.
 */
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainView
    },
    {
      path: '/math',
      name: 'Math',
      component: MathView
    },
    {
      path: '/stacks',
      name: 'Stacks',
      component: StackCalcView
    }
  ]
})
