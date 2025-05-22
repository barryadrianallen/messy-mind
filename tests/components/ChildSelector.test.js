import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ChildSelector from '../../components/ChildSelector.vue';

describe('ChildSelector.vue', () => {
  const mockChildren = [
    { id: 1, name: 'Alex' },
    { id: 2, name: 'Sam' }
  ];
  
  it('renders all children tabs correctly', () => {
    const wrapper = mount(ChildSelector, {
      props: {
        children: mockChildren,
        selectedChildId: 1
      }
    });
    
    // Should render two tab buttons
    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(2);
    
    // The buttons should contain the children's names
    expect(buttons[0].text()).toBe('Alex');
    expect(buttons[1].text()).toBe('Sam');
  });
  
  it('applies active styling to the selected child', () => {
    const wrapper = mount(ChildSelector, {
      props: {
        children: mockChildren,
        selectedChildId: 2
      }
    });
    
    const buttons = wrapper.findAll('button');
    
    // The second button (Sam) should have the active styling
    expect(buttons[1].classes()).toContain('bg-blue-600');
    expect(buttons[1].classes()).toContain('text-white');
    
    // The first button (Alex) should have the inactive styling
    expect(buttons[0].classes()).toContain('bg-gray-200');
    expect(buttons[0].classes()).toContain('text-gray-700');
  });
  
  it('emits select event when a child tab is clicked', async () => {
    const wrapper = mount(ChildSelector, {
      props: {
        children: mockChildren,
        selectedChildId: 1
      }
    });
    
    // Click on the second tab (Sam)
    const buttons = wrapper.findAll('button');
    await buttons[1].trigger('click');
    
    // Check that the select event was emitted with Sam's ID
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')[0]).toEqual([2]);
  });
});
