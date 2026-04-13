<template>
  <t-dialog v-model:visible="formVisible" header="新建产品" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <t-form :data="formData" :rules="rules" :label-width="100" @submit="onSubmit">
        <t-form-item label="产品名称" name="name">
          <t-input v-model="formData.name" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item label="产品状态" name="status">
          <t-radio-group v-model="formData.status">
            <t-radio value="0">停用</t-radio>
            <t-radio value="1">启用</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="产品描述" name="description">
          <t-input v-model="formData.description" :style="{ width: '480px' }" />
        </t-form-item>
        <t-form-item label="产品类型" name="type">
          <t-select v-model="formData.type" clearable :style="{ width: '480px' }">
            <t-option v-for="(item, index) in SELECT_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="备注" name="mark">
          <t-textarea v-model="textareaValue" :style="{ width: '480px' }" name="description" />
        </t-form-item>
        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit">确定</t-button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>
<script setup lang="ts">
import type { FormRules, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';

export interface FormData {
  name: string;
  status: string;
  description: string;
  type: string;
  mark: string;
  amount: number;
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<FormData>,
    default: undefined,
  },
});

const emit = defineEmits(['update:visible']);

const INITIAL_DATA: FormData = {
  name: '',
  status: '',
  description: '',
  type: '',
  mark: '',
  amount: 0,
};

const SELECT_OPTIONS = [
  { label: '网关', value: '1' },
  { label: '人工智能', value: '2' },
  { label: 'CVM', value: '3' },
];

const formVisible = computed({
  get: () => props.visible,
  set: (v: boolean) => emit('update:visible', v),
});

const formData = ref({ ...INITIAL_DATA });
const textareaValue = ref('');

const rules: FormRules = {
  name: [{ required: true, message: '请输入产品名称', type: 'error' }],
};

watch(
  () => props.data,
  (val) => {
    formData.value = { ...INITIAL_DATA, ...val };
  },
  { deep: true },
);

watch(
  () => props.visible,
  (open) => {
    if (open && props.data) {
      formData.value = { ...INITIAL_DATA, ...props.data };
    }
  },
);

const onClickCloseBtn = () => {
  formVisible.value = false;
};

const onSubmit = (ctx: SubmitContext) => {
  if (ctx.validateResult === true) {
    MessagePlugin.success('提交成功');
    formVisible.value = false;
  }
};
</script>
