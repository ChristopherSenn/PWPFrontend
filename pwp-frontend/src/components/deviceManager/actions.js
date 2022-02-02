export function handleDeviceClicked(id) {
    return ({
      type: 'HANDLE_DEVICE_CLICKED',
      payload: id
    });
  }