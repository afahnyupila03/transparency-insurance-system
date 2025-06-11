import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  calculatePolicyService,
  getPolicyService,
  getZonesService,
  savePolicyService
} from '../service/policyService'
import { useEffect, useRef, useState } from 'react'

export const useZones = (search, limit = 10) => {
  const { ...rest } = useInfiniteQuery({
    queryKey: ['zones', search],
    queryFn: ({ pageParams = 0 }) =>
      getZonesService({ search, skip: pageParams, limit }),

    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.flatMap(p => p.data).length
      return loadedCount < lastPage.total ? loadedCount : undefined
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours: data is fresh for 1 day
    cacheTime: 1000 * 60 * 60 * 24 * 7 // 7 days: keep in cache even if unused
  })

  return { ...rest }
}

export const usePolicy = (id, zone) => {
  const toastShownRef = useRef(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['policy', id, zone],
    queryFn: () => getPolicyService(id, zone),
    enabled: !!id && !!zone
  })

  useEffect(() => {
    if (!toastShownRef.current && data && !isError) {
      toast.success('success fetching eligible policy')
      toastShownRef.current = true
    } else if (isError) {
      toast.error('Error fetching eligible policy')
      toastShownRef.current = false
    }
  }, [data, isError])

  return { data, isLoading, isError, error }
}

export const useCalculatePolicy = (id, zone) => {
  const [data, setData] = useState(null)

  const {
    mutateAsync: calculate,
    isPending,
    isSuccess,
    isError,
    error
  } = useMutation({
    mutationFn: payload => calculatePolicyService(id, zone, payload),
    onSuccess: data => {
      if (data) {
        setData(data)
        toast.success('Insurance quotation successfully calculated!')
      }
    },
    onError: error => {
      console.error('Error calculating insurance: ', error.message)
      toast.error('Error calculating insurance quotation')
    }
  })

  return { calculate, data, isPending, isSuccess, isError, error }
}

export const useSavePolicy = (id, zone) => {
  const { mutateAsync: saveQuotation } = useMutation({
    mutationFn: payload => savePolicyService(id, zone, payload),
    onSuccess: data => {
      if (data) {
        toast.success('Insurance quotation successfully saved.')
      }
    },
    onError: error => {
      if (error) {
        console.error('error saving quotation: ', error.message)
        toast.error('Error saving insurance quotation')
      }
    }
  })

  return { saveQuotation }
}
