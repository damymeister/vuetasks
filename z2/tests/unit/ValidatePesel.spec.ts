import { mount } from '@vue/test-utils';
import ValidatePesel from '../../src/components/ValidatePesel.vue';

test('should return false for PESEL with non-numeric characters', () => {
  const wrapper = mount(ValidatePesel);
  const validatePesel = wrapper.vm.validatePesel;
  expect(validatePesel('4405140145a')).toBeFalsy();
});


test('should return false for PESEL with incorrect checksum', () => {
  const wrapper = mount(ValidatePesel);
  const validatePesel = wrapper.vm.validatePesel;
  expect(validatePesel('44051401452')).toBeFalsy();
});

test('should return false for PESEL with future birth date', () => {
  const wrapper = mount(ValidatePesel);
  const validatePesel = wrapper.vm.validatePesel;
  expect(validatePesel('04010100000')).toBeFalsy();
});


test('should return false for PESEL with birth date out of range', () => {
  const wrapper = mount(ValidatePesel);
  const validatePesel = wrapper.vm.validatePesel;
  expect(validatePesel('00123100000')).toBeFalsy();
});



test('should return true for valid PESEL', () => {
  const wrapper = mount(ValidatePesel);
  const validatePesel = wrapper.vm.validatePesel;
  expect(validatePesel('01221206677')).toBeTruthy();
});


test('should return false for invalid PESELS with various birth months', () => {
  const wrapper = mount(ValidatePesel);
  const validatePesel = wrapper.vm.validatePesel;

  const inValidPesels = [
    '81810100000',
    '82020100000', 
    '83030300000', 
    '21010100000', 
  ];

  inValidPesels.forEach((pesel) => {
    expect(validatePesel(pesel)).toBeFalsy();
  });
});