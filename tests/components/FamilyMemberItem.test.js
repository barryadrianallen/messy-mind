import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FamilyMemberItem from '../../components/FamilyMemberItem.vue';

describe('FamilyMemberItem.vue', () => {
  const defaultMemberProps = {
    id: 1,
    name: 'Alex Allen',
    age: 10,
    username: 'alexa',
    level: 5,
    points: 1200,
    role: 'Child',
  };

  it('renders member details correctly', () => {
    const wrapper = mount(FamilyMemberItem, { props: { member: defaultMemberProps } });

    expect(wrapper.text()).toContain(defaultMemberProps.name);
    expect(wrapper.text()).toContain(`Age: ${defaultMemberProps.age}`);
    expect(wrapper.text()).toContain(`@${defaultMemberProps.username}`);
    expect(wrapper.text()).toContain(`Level ${defaultMemberProps.level}`);
    expect(wrapper.text()).toContain(`${defaultMemberProps.points} points`);
    expect(wrapper.text()).toContain(defaultMemberProps.role);
  });

  it('renders correct avatar initial', () => {
    const wrapper = mount(FamilyMemberItem, { props: { member: defaultMemberProps } });
    expect(wrapper.find('div.h-10.w-10').text()).toBe('A'); // First letter of 'Alex Allen'
  });

  it('renders "?" as avatar initial if name is empty or undefined', () => {
    const wrapperEmptyName = mount(FamilyMemberItem, { 
      props: { member: { ...defaultMemberProps, name: '' } } 
    });
    expect(wrapperEmptyName.find('div.h-10.w-10').text()).toBe('?');

    const wrapperUndefinedName = mount(FamilyMemberItem, { 
      props: { member: { ...defaultMemberProps, name: undefined } } 
    });
    expect(wrapperUndefinedName.find('div.h-10.w-10').text()).toBe('?');
  });

  it('applies correct styling for Child role', () => {
    const wrapper = mount(FamilyMemberItem, { props: { member: defaultMemberProps } });
    const roleBadge = wrapper.findAll('span').filter(s => s.text() === 'Child').at(0);
    expect(roleBadge.classes()).toContain('bg-indigo-100');
    expect(roleBadge.classes()).toContain('text-indigo-700');
  });

  it('applies correct styling for Parent role', () => {
    const parentMember = { ...defaultMemberProps, id: 2, name: 'Christine Doe', role: 'Parent', age: null }; // Age can be null or undefined for parent
    const wrapper = mount(FamilyMemberItem, { props: { member: parentMember } });
    const roleBadge = wrapper.findAll('span').filter(s => s.text() === 'Parent').at(0);
    expect(roleBadge.classes()).toContain('bg-blue-100');
    expect(roleBadge.classes()).toContain('text-blue-700');
    
    // Verify Age is not displayed for Parent
    const paragraphText = wrapper.find('p.text-xs.text-gray-500').text();
    expect(paragraphText).not.toContain('Age:');
    expect(paragraphText).toContain(`@${parentMember.username}`);
  });

  it('emits "edit" event with member id when edit button is clicked', async () => {
    const wrapper = mount(FamilyMemberItem, { props: { member: defaultMemberProps } });
    const editButton = wrapper.find('button[title="Edit Member"]');
    await editButton.trigger('click');
    expect(wrapper.emitted().edit).toBeTruthy();
    expect(wrapper.emitted().edit[0]).toEqual([defaultMemberProps.id]);
  });

  it('emits "delete" event with member id when delete button is clicked', async () => {
    const wrapper = mount(FamilyMemberItem, { props: { member: defaultMemberProps } });
    const deleteButton = wrapper.find('button[title="Delete Member"]');
    await deleteButton.trigger('click');
    expect(wrapper.emitted().delete).toBeTruthy();
    expect(wrapper.emitted().delete[0]).toEqual([defaultMemberProps.id]);
  });

  it('renders default prop values if member prop is not fully provided', () => {
    // Suppress the expected "Missing required prop" warning for this specific test
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mounting without the member prop to test default values from the component's prop definition
    const wrapper = mount(FamilyMemberItem);
    
    // Restore console.warn
    consoleWarnSpy.mockRestore();

    // Check a few default values from the component's prop definition
    expect(wrapper.text()).toContain('Unknown'); // Default name
    expect(wrapper.text()).toContain('Age: 0'); // Default age
    expect(wrapper.text()).toContain('@unknown'); // Default username
    expect(wrapper.text()).toContain('Child'); // Default role
    expect(wrapper.find('div.h-10.w-10').text()).toBe('U'); // Default avatarInitial (derived from 'Unknown')
  });
});
