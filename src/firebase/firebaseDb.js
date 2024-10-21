import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { auth, db } from './firebaseConfig'
import {
  handleFirebaseCreateAccount,
  handleFirebaseLogin
} from './firebaseAuth'
import {
  addNewBoard,
  addNewTask,
  editBoard,
  editTask,
  deleteBoard,
  deleteTask,
  deleteColumnAndReturn,
  setSelectedTask,
  setStatus
} from '../features/slices/dummyDataSlice'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export function handleCreateAccount (email, password) {
  return async function (dispatch) {
    dispatch({ type: 'dummyData/startLoading' })
    try {
      const user = await handleFirebaseCreateAccount(email, password)

      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          boards: [],
          id: user.uid
        })
        const boards = []
        dispatch({
          type: 'dummyData/setData',
          payload: { boards, id: user.uid }
        })
        localStorage.setItem('userMode', '')
        return { success: true }
      }
    } catch (error) {
      toast.error(error.message.split(': ').pop())
      return { success: false }
    } finally {
      dispatch({ type: 'dummyData/stopLoading' })
    }
  }
}

export function loginUser (email, password) {
  return async function (dispatch) {
    dispatch({ type: 'dummyData/startLoading' })
    try {
      const user = await handleFirebaseLogin(email, password)

      if (user) {
        return { success: true }
      }
    } catch (error) {
      toast.error(error.message.split(': ').pop())
      return { success: false }
    } finally {
      dispatch({ type: 'dummyData/stopLoading' })
    }
  }
}

export function getUserData () {
  return async function (dispatch, getState) {
    dispatch({ type: 'dummyData/startLoading' })
    try {
      const user = await new Promise(resolve => {
        const unsubscribe = onAuthStateChanged(auth, user => {
          unsubscribe()
          resolve(user)
        })
      })

      if (!user) {
        throw new Error('No user is signed in')
      }
      const state = getState()
      const { status } = state.boards
      if (status === 'complete') {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        const { boards, id } = docSnap.data()
        dispatch({
          type: 'dummyData/setData',
          payload: { boards, id }
        })
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      dispatch({ type: 'dummyData/stopLoading' })
    }
  }
}

export function handleSignout () {
  return async function (dispatch) {
    dispatch({ type: 'dummyData/startLoading' })
    try {
      await signOut(auth)

      // Clear any user-related data from your Redux store
      dispatch(setStatus(''))
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error(error.message)
    } finally {
      dispatch({ type: 'dummyData/stopLoading' })
    }
  }
}

export function updateBoard (editingBoard, newBoard) {
  return async function (dispatch, getState) {
    dispatch({ type: 'dummyData/startLoading' })
    try {
      const state = getState()
      const { selectedBoard, id, selectedColumn, status } = state.boards
      if (status === 'demo') {
        if (editingBoard) {
          dispatch(editBoard(newBoard))
          return
        }
        if (!editingBoard) {
          dispatch(addNewBoard(newBoard))
          return
        }
        if (Object.keys(selectedColumn).length && !editingBoard && !newBoard) {
          deleteColumnAndReturn('editBoardModal')
          toast.success('Board added successfully')
          return
        }
      }

      if (status === 'complete') {
        if (id) {
          const userDocRef = doc(db, 'users', id)
          const userDoc = await getDoc(userDocRef)

          // for editing board
          if (editingBoard) {
            // Get the user document

            if (userDoc.exists()) {
              // Get the boards array from the document data
              const boards = userDoc.data().boards

              // Update the specific board by id
              const updatedBoards = boards.map(board =>
                board.name === selectedBoard.name ? newBoard : board
              )

              await updateDoc(userDocRef, { boards: updatedBoards })
            }
            // Updating redux state
            dispatch(editBoard(newBoard))
            toast.success('Board Edited Successfully')
            return
          }

          // For creating new board
          if (!editingBoard && !Object.keys(selectedColumn).length) {
            await updateDoc(userDocRef, { boards: arrayUnion(newBoard) })
            dispatch(addNewBoard(newBoard))
            toast.success('Board Added Successfully')
            return
          }

          // For deleting board columns
          if (
            Object.keys(selectedColumn).length &&
            !editingBoard &&
            !newBoard
          ) {
            if (userDoc.exists()) {
              const boards = userDoc.data().boards

              const updatedBoard = boards.map(board =>
                board.name === selectedBoard.name
                  ? {
                      ...board,
                      columns: board.columns.filter(
                        column => column.name !== selectedColumn.name
                      )
                    }
                  : board
              )

              await updateDoc(userDocRef, { boards: updatedBoard })
              dispatch(deleteColumnAndReturn('editBoardModal'))
              toast.success('column deleted successfully')
            }
          }
        }
      }
    } catch (error) {
      toast.error(`Failed: ${error.message}`)
    } finally {
      dispatch({ type: 'dummyData/stopLoading' })
    }
  }
}

export function deleteBoardFromFirebase () {
  return async function (dispatch, getState) {
    dispatch({ type: 'dummyData/startLoading' })
    try {
      const state = getState()
      const { selectedBoard, id, status } = state.boards

      if (status === 'demo') {
        dispatch(deleteBoard())
        return
      }

      if (status === 'complete') {
        const userDocRef = doc(db, 'users', id)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const boards = userDoc.data().boards

          const updatedBoard = boards.filter(
            board => board.name !== selectedBoard.name
          )

          await updateDoc(userDocRef, { boards: updatedBoard })
          dispatch(deleteBoard())
          toast.success('Board deleted successfully')
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      dispatch({ type: 'dummyData/stopLoading' })
    }
  }
}

export function updateTask (editingTask, newTask) {
  return async function (dispatch, getState) {
    dispatch({ type: 'dummyData/startLoading' })
    try {
      const state = getState()
      const { selectedBoard, id, selectedTask, status } = state.boards

      if (status === 'demo') {
        dispatch(addNewTask(newTask))
        return
      }

      if (status === 'complete') {
        if (id) {
          const userDocRef = doc(db, 'users', id)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const boards = userDoc.data().boards

            const updatedBoard = boards.map(board => {
              if (board.name === selectedBoard.name) {
                board.columns.map(column =>
                  column.name === newTask.status
                    ? column.tasks.unshift(newTask)
                    : column
                )

                if (Object.keys(selectedTask).length) {
                  const oldColumn = board.columns.find(
                    column => column.name === selectedTask.status
                  )
                  if (oldColumn) {
                    oldColumn.tasks = oldColumn.tasks.filter(
                      task => task.title !== selectedTask.title
                    )
                  }
                }
              }
              return board
            })

            await updateDoc(userDocRef, { boards: updatedBoard })
            if (!editingTask) {
              dispatch(addNewTask(newTask))
              toast.success('Task added successfully')
            }
            if (editingTask) {
              dispatch(editTask(newTask))
              toast.success('Task edited successfully')
            }
          }
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      dispatch({ type: 'dummyData/stopLoading' })
    }
  }
}

export function deleteTaskFromFirebase () {
  return async function (dispatch, getState) {
    dispatch({ type: 'dummyData/startLoading' })
    try {
      const state = getState()
      const { selectedBoard, id, selectedTask, status } = state.boards

      if (status === 'demo') {
        dispatch(deleteTask())
        toast.success('Task deleted successfully')
        return
      }

      if (status === 'complete') {
        const userDocRef = doc(db, 'users', id)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const boards = userDoc.data().boards

          const updatedBoard = boards.map(board =>
            board.name === selectedBoard.name
              ? {
                  ...board,
                  columns: board.columns.map(column =>
                    column.name === selectedTask.status
                      ? {
                          ...column,
                          tasks: column.tasks.filter(
                            task => task.title !== selectedTask.title
                          )
                        }
                      : column
                  )
                }
              : board
          )

          await updateDoc(userDocRef, { boards: updatedBoard })
          dispatch(deleteTask())

          toast.success('Board deleted successfully')
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      dispatch({ type: 'dummyData/stopLoading' })
    }
  }
}

export function toggleSubtask (selectedSubtask) {
  return async function (dispatch, getState) {
    dispatch({ type: 'dummyData/startLoading' })
    try {
      const state = getState()
      const { selectedBoard, id, selectedTask, status, boards } = state.boards

      if (status === 'demo') {
        boards.forEach(board => {
          if (board.name === selectedBoard.name) {
            // Iterate through each column in the selected board
            board.columns.find(column => {
              // Find the task inside the column that matches selectedTask's title or status
              const task = column.tasks.find(
                task => task.title === selectedTask.title
              )

              if (task) {
                // console.log(selectedSubtask)
                dispatch(setSelectedTask(task, selectedSubtask))
                return task
              }
            })
          }
        })
        return
      }

      if (status === 'complete') {
        const userDocRef = doc(db, 'users', id)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const boards = userDoc.data().boards

          const updatedBoard = boards.map(board =>
            board.name === selectedBoard.name
              ? {
                  ...board,
                  columns: board.columns.map(column =>
                    column.name === selectedTask.status
                      ? {
                          ...column,
                          tasks: column.tasks.map(task =>
                            task.title === selectedTask.title
                              ? {
                                  ...task,
                                  subtasks: task.subtasks.map(subtask =>
                                    subtask.title === selectedSubtask.title
                                      ? {
                                          ...subtask,
                                          isCompleted: !subtask.isCompleted
                                        }
                                      : subtask
                                  )
                                }
                              : task
                          )
                        }
                      : column
                  )
                }
              : board
          )

          await updateDoc(userDocRef, { boards: updatedBoard })
          dispatch({
            type: 'dummyData/setData',
            payload: { boards: updatedBoard, id }
          })

          updatedBoard.forEach(board => {
            if (board.name === selectedBoard.name) {
              // Iterate through each column in the selected board
              board.columns.forEach(column => {
                // Find the task inside the column that matches selectedTask's title or status
                const task = column.tasks.find(
                  task => task.title === selectedTask.title
                )

                if (task) {
                  dispatch(setSelectedTask(task))
                }
              })
            }
          })
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      dispatch({ type: 'dummyData/stopLoading' })
    }
  }
}
