import { usePrest } from '~/util/prest'

export const roles = ref([])

const api = usePrest('role', roles, 'code')

export const getRoles = api.query

export const roleName = code => roles.value.find(x => x.code === code)?.name
