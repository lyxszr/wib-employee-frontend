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
    ({ userId, reason, startDate, endDate }) => ({
      endpoint: `api/employee/v1/submit-leave-request/${userId}`,
      data: { reason, startDate, endDate }
    }),
    {
      onSuccess: (data) => console.log('Leave request submitted:', data),
      onError: (error) => console.error('Leave request error:', error)
    }
  )
}

