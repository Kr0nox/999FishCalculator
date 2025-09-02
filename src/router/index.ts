import MainView from '@/views/MainView.vue'
import MathView from '@/views/MathView.vue'
import ChangeLogView from '@/views/ChangeLog.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ResizableView from '@/views/ResizableView.vue'

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
      path: '/changelog',
      name: 'Changelog',
      component: ChangeLogView
    },
    {
      path: '/resize',
      name: 'Resizable',
      component: ResizableView
    }
  ]
})
