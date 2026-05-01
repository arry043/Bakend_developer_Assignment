import { useState, useCallback } from 'react'
import * as taskApi from '../api/task.api'

export const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async (params = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await taskApi.getTasks(params)
      setTasks(res.data.tasks)
      setPagination(res.meta)
      return res.data.tasks
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTask = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await taskApi.createTask(data)
      return res
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateTask = async (id, data) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await taskApi.updateTask(id, data)
      return res
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTask = async (id) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await taskApi.deleteTask(id)
      return res
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    tasks,
    pagination,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
}
