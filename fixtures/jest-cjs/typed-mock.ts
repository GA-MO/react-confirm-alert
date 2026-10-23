import * as lib from 'react-confirm-alert'

// B5: this compiles only while confirmAlert returns void.
const spy = jest.spyOn(lib, 'confirmAlert').mockImplementation(() => {})
lib.confirmAlert({ title: 'Delete?', afterClose: () => {} })
spy.mockRestore()
