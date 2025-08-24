import { useMutation, useQueryClient } from '@tanstack/react-query'

export function usePrismateMutations(prismateInstance: any, modelName?: string) {
  const queryClient = useQueryClient()
  
  const createRecord = async (data: any) => {
    if (!prismateInstance || !modelName) throw new Error('Prismate instance not available')
    
    // Try different Prismate API patterns
    if (prismateInstance[modelName]?.create) {
      return await prismateInstance[modelName].create({ data })
    }
    
    if (prismateInstance.create) {
      return await prismateInstance.create(modelName, data)
    }
    
    throw new Error('Create method not found')
  }
  
  const updateRecord = async (id: any, data: any) => {
    if (!prismateInstance || !modelName) throw new Error('Prismate instance not available')
    
    // Try different Prismate API patterns
    if (prismateInstance[modelName]?.update) {
      return await prismateInstance[modelName].update({
        where: { id },
        data
      })
    }
    
    if (prismateInstance.update) {
      return await prismateInstance.update(modelName, id, data)
    }
    
    throw new Error('Update method not found')
  }
  
  const deleteRecord = async (id: any) => {
    if (!prismateInstance || !modelName) throw new Error('Prismate instance not available')
    
    // Try different Prismate API patterns
    if (prismateInstance[modelName]?.delete) {
      return await prismateInstance[modelName].delete({
        where: { id }
      })
    }
    
    if (prismateInstance.delete) {
      return await prismateInstance.delete(modelName, id)
    }
    
    throw new Error('Delete method not found')
  }
  
  // Invalidate queries after mutations
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['prismate', modelName] })
  }
  
  return {
    createRecord: useMutation({
      mutationFn: createRecord,
      onSuccess
    }).mutateAsync,
    
    updateRecord: useMutation({
      mutationFn: ({ id, data }: { id: any; data: any }) => updateRecord(id, data),
      onSuccess
    }).mutateAsync,
    
    deleteRecord: useMutation({
      mutationFn: deleteRecord,
      onSuccess
    }).mutateAsync
  }
}