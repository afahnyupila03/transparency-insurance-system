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

  return { data, refetch, isLoading, isError, error }
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
      toast.success('Car created successfully!')
      queryClient.setQueryData(['cars'], old =>
        old ? [...old, data.data] : [data.data]
      )
    },
    onError: error => {
      console.error('Failed to create car: ', error)
      toast.error('Could not create car, please try again.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    }
  })

  return createCar
}

export const useUpdateCar = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateCar } = useMutation({
    mutationFn: ({ id, payload }) => updateCarService(id, payload),

    onSuccess: (_, { id }) => {
      toast.success('Car profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      queryClient.invalidateQueries({ queryKey: ['car', id] })
    },

    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['cars']
      })
      queryClient.invalidateQueries({
        queryKey: ['car', id]
      })
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
      toast.success('Car profile status updated successfully')
      queryClient.invalidateQueries({
        queryKey: ['car', id]
      })
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['car', id]
      })
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
    onError: error => {
      console.error('Error update car profile status: ', error)
      toast.error('Failed to update car profile status, please try again!')
    }
  })

  return updateCarStatus
}
