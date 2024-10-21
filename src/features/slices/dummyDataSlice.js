import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  boards: [],
  isLoading: false,
  selectedBoard: {},
  selectedTask: {},
  selectedColumn: {},
  active: 0,
  isSidebarOpen: false,
  activeModal: '',
  columnIndex: 0,
  isDarkMode: true,
  status: localStorage.getItem('userMode') || '',
  id: '',
  selectedAction: ''
}

const dummyDataSlice = createSlice({
  name: 'dummyData',
  initialState,
  reducers: {
    setData (state, action) {
      state.boards = action.payload.boards
      state.selectedBoard =
        action.payload.boards.length > 0 ? action.payload.boards[0] : {}

      state.active = 0
      state.isLoading = false
      state.id = action.payload?.id
    },
    stopLoading (state) {
      state.isLoading = false
    },

    startLoading (state) {
      state.isLoading = true
    },

    changeBoard: {
      prepare (index, board) {
        return {
          payload: { index, board }
        }
      },

      reducer (state, action) {
        state.active = action.payload.index
        state.selectedBoard = action.payload.board
      }
    },

    toggleSidebar (state) {
      state.isSidebarOpen = !state.isSidebarOpen
    },

    // This also sets a selected task or column
    setActiveModal: {
      prepare (modalType, task, column, boardColumns, selectedAction) {
        return {
          payload: {
            modalType,
            task: task ? task : {},
            column: column ? column : {},
            boardColumns: boardColumns ? boardColumns : [],
            selectedAction: selectedAction ? selectedAction : ''
          }
        }
      },
      reducer (state, action) {
        state.activeModal = action.payload.modalType

        state.selectedTask =
          Object.keys(action.payload.task).length > 0
            ? action.payload.task
            : state.selectedTask

        state.selectedColumn =
          Object.keys(action.payload.column).length > 0
            ? action.payload.column
            : state.selectedColumn

        state.selectedBoard.columns =
          action.payload.boardColumns.length > 0
            ? action.payload.boardColumns
            : state.selectedBoard?.columns

        state.selectedAction = action.payload.selectedAction

        if (action.payload.modalType === '') {
          state.selectedColumn = {}
          state.selectedTask = {}
        }
      }
    },

    // This also toggles the subtask
    setSelectedTask: {
      prepare (task, subtask) {
        return {
          payload: {
            task,
            subtask
          }
        }
      },
      reducer (state, action) {
        if (state.status === 'complete') {
          state.selectedTask = action.payload.task
        }

        if (state.status === 'demo') {
          if (action.payload.task) {
            const updatedBoards = state.boards.map(board =>
              board.name === state.selectedBoard.name
                ? {
                    ...board,
                    columns: board.columns.map(column =>
                      column.name === state.selectedTask.status
                        ? {
                            ...column,
                            tasks: column.tasks.map(task =>
                              task.title === state.selectedTask.title
                                ? {
                                    ...task,
                                    subtasks: task.subtasks.map(subtask =>
                                      subtask.title ===
                                      action.payload.subtask.title
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

            let selectedTask
            updatedBoards.forEach(board => {
              if (board.name === state.selectedBoard.name) {
                // Iterate through each column in the selected board
                board.columns.forEach(column => {
                  // Find the task inside the column that matches selectedTask's title or status
                  const task = column.tasks.find(
                    task => task.title === state.selectedTask.title
                  )

                  if (task) {
                    selectedTask = task
                  }
                })
              }
            })

            state.boards = updatedBoards
            state.selectedTask = selectedTask
          }
        }
      }
    },
    deleteSelectedSubtask (state, action) {
      const newSubtask = state.selectedTask.subtasks.filter(
        (subtask, i) => i !== action.payload
      )
      state.selectedTask.subtasks = newSubtask
    },

    addSelectedSubtask (state, action) {
      const newSubtask = { title: '', isCompleted: false }
      state.selectedTask.subtasks = action.payload
      state.selectedTask.subtasks.push(newSubtask)
    },

    addNewBoard (state, action) {
      state.boards.push(action.payload)
      state.active = state.boards.length - 1
      state.selectedBoard = action.payload
      state.activeModal = ''
    },

    addNewBoardColumn (state, action) {
      const newBoardColumn = { name: '', tasks: [] }
      state.selectedBoard.columns = action.payload
      state.selectedBoard.columns.push(newBoardColumn)
    },

    deleteColumnAndReturn (state, action) {
      const updatedColumns = state.selectedBoard.columns.filter(
        arr => arr.name !== state.selectedColumn.name
      )
      state.selectedBoard.columns = updatedColumns
      state.selectedColumn = {}

      state.activeModal = action.payload
    },

    editBoard (state, action) {
      state.boards = state.boards.map((board, i) =>
        i === state.active ? action.payload : board
      )
      state.selectedBoard = action.payload
      state.activeModal = ''
    },

    deleteBoard (state) {
      state.boards = state.boards.filter(
        board => board.name !== state.selectedBoard.name
      )
      state.selectedBoard = state.boards.length > 0 ? state.boards[0] : {}
      state.active = 0
      state.activeModal = ''
    },

    addNewTask (state, action) {
      state.selectedBoard.columns.map(column =>
        column.name === action.payload.status
          ? column.tasks.unshift(action.payload)
          : column
      )
      state.activeModal = ''
    },

    editTask (state, action) {
      const updatedColumns = state.selectedBoard.columns.map(column => {
        // Case where status did not change
        if (
          state.selectedTask.status === action.payload.status &&
          column.name === action.payload.status
        ) {
          const updatedTasks = column.tasks.map((task, i) =>
            i === state.columnIndex ? action.payload : task
          )

          return {
            ...column,
            tasks: updatedTasks
          }
        }

        // Case where status changed
        if (
          state.selectedTask.status !== action.payload.status &&
          column.name === action.payload.status
        ) {
          const updatedTasks = [action.payload, ...column.tasks]

          return {
            ...column,
            tasks: updatedTasks
          }
        }

        // Deleting the task from the previous status when status changed
        if (
          column.name === state.selectedTask.status &&
          state.selectedTask.status !== action.payload.status
        ) {
          const updatedPrevColumnTask = column.tasks.filter(
            task => task.title !== state.selectedTask.title
          )

          return {
            ...column,
            tasks: updatedPrevColumnTask
          }
        }

        return column
      })

      state.selectedBoard.columns = updatedColumns
      state.activeModal = ''
    },

    setColumnIndex (state, action) {
      state.columnIndex = action.payload
    },

    deleteTask (state) {
      const updatedColumns = state.selectedBoard.columns.map(column => {
        if (column.name === state.selectedTask.status) {
          const updatedTasks = column.tasks.filter(
            task => task.title !== state.selectedTask.title
          )
          return {
            ...column,
            tasks: updatedTasks
          }
        }
        return column
      })

      state.selectedBoard.columns = updatedColumns
      state.activeModal = ''
    },
    toggleDarkMode (state) {
      state.isDarkMode = !state.isDarkMode
    },
    setStatus (state, action) {
      state.status = action.payload

      localStorage.setItem('userMode', action.payload && action.payload)
      state.activeModal = ''
    },
    setUserId (state, action) {
      state.id = action.payload
    }
  }
})

export const {
  changeBoard,
  toggleSidebar,
  setActiveModal,
  setSelectedTask,
  deleteSelectedSubtask,
  addSelectedSubtask,
  addNewBoardColumn,
  addNewBoard,
  deleteColumnAndReturn,
  editBoard,
  addNewTask,
  editTask,
  setColumnIndex,
  deleteBoard,
  deleteTask,
  toggleDarkMode,
  setStatus,
  setUserId
} = dummyDataSlice.actions

export function getDummyData () {
  return async function (dispatch, getState) {
    const state = getState()
    const { id } = state.boards
    dispatch({ type: 'dummyData/startLoading' })
    const res = await fetch('/data.json')
    const data = await res.json()
    const { boards } = data
    dispatch({ type: 'dummyData/setData', payload: { boards, id } })
  }
}

export default dummyDataSlice.reducer
