const router = require('express').Router()
const Todo = require('../models/Todo')

router.get('/users', async (req, res) => {
  try {
    const todos = await Todo.find({}).select('username -_id')
    const users = todos.map(todo => todo.username)
    const usernames = {}
    users.forEach(username => (usernames[username] = username))
    return res.json(Object.keys(usernames))
  } catch (e) {
    return res.send(e.message)
  }
})

router.get('/:username', async (req, res) => {
  try {
    const todos = await Todo.find({ username: req.params.username }).select(
      'content isCompleted'
    )
    console.log(req.params.user, todos)
    return res.json(todos)
  } catch (e) {
    return res.send(e.message)
  }
})

router.post('/:username', async (req, res) => {
  try {
    const { username } = req.params
    const { content } = req.body

    const newTodo = new Todo({
      username,
      content,
      isCompleted: false,
    })

    await newTodo.save()

    return res.json({
      content: newTodo.content,
      isCompleted: newTodo.isCompleted,
    })
  } catch (e) {
    return res.send(e.message)
  }
})

router.delete('/:username/:todoId', async (req, res) => {
  try {
    const { todoId } = req.params
    await Todo.findByIdAndRemove(req.params.todoId)
    return res.json({
      message: `todoId ${todoId} removed.`,
    })
  } catch (e) {
    return res.send(e.message)
  }
})

router.put('/:usename/:todoId/toggle', async (req, res) => {
  try {
    const { todoId } = req.params
    const todo = await Todo.findById(req.params.todoId)
    todo.isCompleted = !todo.isCompleted
    await todo.save()
    console.log(`todoId ${todoId} updated`)
    return res.json({
      message: `todoId ${todoId} updated`,
    })
  } catch (e) {
    return res.send(e.message)
  }
})

module.exports = router
