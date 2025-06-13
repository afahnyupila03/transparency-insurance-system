import { useQuery } from '@tanstack/react-query'
import {
  viewQuotationService,
  viewQuotationsServices
} from '../service/quotationService'

export const useQuotationsHook = carId => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['quotations', carId],
    queryFn: () => viewQuotationsServices(carId),
    refetchOnWindowFocus: false
    // staleTime: 60
  })

  return { data, isLoading, error, isError }
}

export const useQuotationHook = id => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['quotation', id],
    queryFn: () => viewQuotationService(id)
  })

  return { data, isLoading, isError, error }
}
