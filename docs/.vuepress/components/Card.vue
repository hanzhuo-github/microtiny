<template>
  <div class="card">
    <div class="title">{{ title }}</div>
    <div class="content">
      <slot name="menu">
        <div class="sub-title-wrapper">
          <div class="sub-title" v-for="(title, i) in subTitles" :key="'title'+i">
            <span>{{ title }}</span>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface CardProps {
  title: string
  subTitles: string[]
}
const props = defineProps<CardProps>()
</script>
<style lang="scss" scoped>
.card {
  border: 1px solid var(--mt-border-color);
  border-radius: 6px;
  padding: 10px;
  width: fit-content;
  background-color: var(--mt-bg-color-secondary);

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
  }
  .sub-title-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .sub-title {
      text-align: center;
      padding: 12px 16px;
      border-radius: 4px;
      background-color: var(--mt-bg-color);
    }
  }
}
</style>