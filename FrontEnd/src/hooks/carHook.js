import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  createCarService,
  updateCarService,
  updateCarStatusService,
  viewCarService,
  viewCarsService
} from '../service/carService'

export const useCars = () => {
  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: ['cars'],
    queryFn: viewCarsService,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: 10 * 60 * 1000
  })

  const cars = data?.data?.filter(car => car.status !== 'deleted')

  return { cars, refetch, isLoading, isError, error }
}

export const useCar = id => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['car', id],
    queryFn: () => viewCarService(id),
    enabled: !!id
  })

  return { data, isLoading, isError, error }
}

export const useCreateCar = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: createCar } = useMutation({
    mutationFn: payload => createCarService(payload),
    onSuccess: data => {
      queryClient.setQueryData(['cars'], old =>
        old ? [...old, data.data] : [data.data]
      )
    },
    onError: error => {
      console.error('Failed to create car: ', error)
      toast.error('Could not create car, please try again.')
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })

      if (!error && data?.data) {
        toast.success('Car created successfully!')
      }
    }
  })

  return createCar
}

export const useUpdateCar = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateCar } = useMutation({
    mutationFn: ({ id, payload }) => updateCarService(id, payload),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      queryClient.invalidateQueries({ queryKey: ['car', id] })
    },

    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['cars']
      })
      queryClient.invalidateQueries({
        queryKey: ['car', id]
      })

      if (!error && data?.data) {
        toast.success('Car profile updated successfully!')
      }
    },

    onError: error => {
      console.error('Failed to update car profile: ', error)
      toast.error('Failed to update car profile, please try again!')
    }
  })

  return updateCar
}

export const useUpdateCarStatus = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateCarStatus } = useMutation({
    mutationFn: ({ id, status }) => updateCarStatusService(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['car', id]
      })
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['car', id]
      })
      queryClient.invalidateQueries({ queryKey: ['cars'] })

      if (!error && data?.data) {
        toast.success('Car profile status updated successfully')
      }
    },
    onError: error => {
      console.error('Error update car profile status: ', error)
      toast.error('Failed to update car profile status, please try again!')
    }
  })

  return updateCarStatus
}
