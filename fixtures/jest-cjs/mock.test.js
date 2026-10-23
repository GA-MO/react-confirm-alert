const lib = require('react-confirm-alert')

test('confirmAlert can be mocked and asserted', () => {
  const spy = jest.spyOn(lib, 'confirmAlert').mockImplementation(() => {})
  lib.confirmAlert({ title: 'Delete?' })
  expect(spy).toHaveBeenCalledWith({ title: 'Delete?' })
})
