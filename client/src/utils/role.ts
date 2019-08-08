export function getUserRole(indentity: string): string {
  switch(indentity) {
    case 'admin':
      return '管理员'
      break;
    case 'shopowner':
      return '店长'
      break
    case 'shopguide':
      return '导购'
      break
    default:
      return ''
  }
}