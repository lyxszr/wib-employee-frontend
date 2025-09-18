import { useApiMutation } from '../shared/useApiMutation'
import { useApiQuery } from '../shared/useApiQuery'

export const useGetMonthlyAttendance = (year, month, email) => {
  return useApiQuery(
    ['userAttendanceData', year, month, email],
    `api/employee/v1/monthly-record?year=${year}&month=${month}&email=${email}`,
    {
      enabled: !!email,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}

export const useSubmitLeaveRequest = () => {
  return useApiMutation(
    'post',
    ({ userId, reason, startDate, endDate, leaveCategory }) => ({
      endpoint: `api/employee/v1/submit-leave-request/${userId}`,
      data: { reason, startDate, endDate, leaveCategory }
    }),
    {
      onSuccess: (data) => console.log('Leave request submitted:', data),
      onError: (error) => console.error('Leave request error:', error)
    }
  )
}

export const useGetEmployeeStatus = (email) => {
  return useApiQuery(
    ['employeeStatus', email],
    `api/employee/v1/get-employee-status?email=${email}`,
    {
      enabled: !!email,
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 60 * 1000, // 1 minute
      refetchInterval: 30 * 1000, // Refetch every 30 seconds to keep status updated
    }
  )
}

export const useTimeInAction = () => {
  return useApiMutation(
    'post',
    ({ email, password, skipBreak }) => ({
      endpoint: 'api/employee/v1/time-in',
      data: { email, password, skipBreak }
    }),
    {
      onSuccess: (data) => console.log('Time action completed:', data),
      onError: (error) => console.error('Time action error:', error)
    }
  )
}

export const useTimeOutAction = () => {
  return useApiMutation(
    'post',
    ({ email, password }) => ({
      endpoint: 'api/employee/v1/time-out',
      data: { email, password }
    }),
    {
      onSuccess: (data) => console.log('Time out completed:', data),
      onError: (error) => console.error('Time out error:', error)
    }
  )
}