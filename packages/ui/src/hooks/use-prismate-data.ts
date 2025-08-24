import { useQuery } from '@tanstack/react-query'

export function usePrismateData(prismateInstance: any, modelName?: string) {
  return useQuery({
    queryKey: ['prismate', modelName],
    queryFn: async () => {
      if (!prismateInstance || !modelName) return []
      
      try {
        // Try to use Prismate's built-in methods
        if (prismateInstance[modelName]?.findMany) {
          return await prismateInstance[modelName].findMany()
        }
        
        // Fallback to generic query method
        if (prismateInstance.query) {
          return await prismateInstance.query(modelName, { method: 'findMany' })
        }
        
        // If Prismate has a different API
        if (prismateInstance.getAll) {
          return await prismateInstance.getAll(modelName)
        }
        
        return []
      } catch (error) {
        console.error('Error fetching data:', error)
        throw error
      }
    },
    enabled: !!prismateInstance && !!modelName,
  })
}