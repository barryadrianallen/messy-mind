import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ChildTaskItem from '../../components/ChildTaskItem.vue';

describe('ChildTaskItem.vue', () => {
  const defaultProps = {
    title: 'Test Task Title',
    description: 'Test task description.',
    completed: false
  };

  it('renders task title and description', () => {
    const wrapper = mount(ChildTaskItem, { props: defaultProps });
    expect(wrapper.text()).toContain(defaultProps.title);
    expect(wrapper.text()).toContain(defaultProps.description);
  });

  describe('when task is not completed', () => {
    const wrapper = mount(ChildTaskItem, { props: { ...defaultProps, completed: false } });

    it('applies correct styling for incomplete task', () => {
      expect(wrapper.classes()).toContain('bg-white');
      expect(wrapper.classes()).toContain('border-gray-200');
      expect(wrapper.find('p.text-lg').classes()).not.toContain('line-through');
      expect(wrapper.find('p.text-sm').classes()).not.toContain('line-through');
    });

    it('shows "To Do" status badge', () => {
      const badge = wrapper.findAll('span').filter(s => s.text() === 'To Do').at(0);
      expect(badge.exists()).toBe(true);
      expect(badge.classes()).toContain('bg-blue-600');
      expect(badge.classes()).toContain('text-white');
    });

    it('checkbox does not show checkmark svg', () => {
      const checkboxButton = wrapper.find('button');
      expect(checkboxButton.find('svg').exists()).toBe(false);
    });
  });

  describe('when task is completed', () => {
    const wrapper = mount(ChildTaskItem, { props: { ...defaultProps, completed: true } });

    it('applies correct styling for completed task', () => {
      expect(wrapper.classes()).toContain('bg-blue-50');
      expect(wrapper.find('p.text-lg').classes()).toContain('line-through');
      expect(wrapper.find('p.text-sm').classes()).toContain('line-through');
    });

    it('shows "Done!" status badge', () => {
      const badge = wrapper.findAll('span').filter(s => s.text() === 'Done!').at(0);
      expect(badge.exists()).toBe(true);
      expect(badge.classes()).toContain('bg-gray-200');
      expect(badge.classes()).toContain('text-gray-800');
    });

    it('checkbox shows checkmark svg', () => {
      const checkboxButton = wrapper.find('button');
      expect(checkboxButton.find('svg').exists()).toBe(true);
      expect(checkboxButton.find('svg path[fill-rule="evenodd"]').exists()).toBe(true);
    });
  });

  it('emits toggle-completion event when checkbox button is clicked', async () => {
    const wrapper = mount(ChildTaskItem, { props: defaultProps });
    const checkboxButton = wrapper.find('button'); // The first button is the checkbox
    await checkboxButton.trigger('click');
    expect(wrapper.emitted()['toggle-completion']).toBeTruthy();
    expect(wrapper.emitted()['toggle-completion'].length).toBe(1);
  });
});
