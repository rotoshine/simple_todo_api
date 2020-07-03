const router = require('express').Router()
const Todo = require('../models/Todo')

const delayedReturn = (req, res, returnJSON) => {
  try {
    const delayParam = parseInt(req.query.delay, 10)
    const delay = isNaN(delayParam) ? 0 : delayParam

    setTimeout(() => {
      return res.json(returnJSON)
    }, delay)
  } catch (e) {
    console.error(e)
    return res.json(returnJSON)
  }
}
router.get('/users', async (req, res) => {
  if (req.query.hasError) {
    return res.status(500).send('서버에서 알 수 없는 에러가 발생!')
  }
  try {
    const todos = await Todo.find({}).select('username -_id')
    const users = todos.map(todo => todo.username)
    const usernames = {}
    users.forEach(username => (usernames[username] = username))
    return delayedReturn(req, res, Object.keys(usernames))
  } catch (e) {
    return res.send(e.message)
  }
})

router.get('/:username', async (req, res) => {
  if (req.query.hasError) {
    return res.status(500).send('서버에서 알 수 없는 에러가 발생!')
  }
  try {
    const todos = await Todo.find({ username: req.params.username }).select(
      'content isCompleted'
    )
    console.log(req.params.user, todos)
    return delayedReturn(req, res, todos)
  } catch (e) {
    return res.send(e.message)
  }
})

router.post('/:username', async (req, res) => {
  if (req.query.hasError) {
    return res.status(500).send('서버에서 알 수 없는 에러가 발생!')
  }
  try {
    const { username } = req.params
    const { content } = req.body

    const newTodo = new Todo({
      username,
      content,
      isCompleted: false,
    })

    const persistentTodo = await newTodo.save()

    return delayedReturn(req, res, {
      _id: persistentTodo._id,
      content: persistentTodo.content,
      isCompleted: persistentTodo.isCompleted,
    })
  } catch (e) {
    return res.send(e.message)
  }
})

router.delete('/:username/:todoId', async (req, res) => {
  if (req.query.hasError) {
    return res.status(500).send('서버에서 알 수 없는 에러가 발생!')
  }
  try {
    const { todoId } = req.params
    await Todo.findByIdAndRemove(req.params.todoId)
    return delayedReturn(req, res, {
      message: `todoId ${todoId} removed.`,
    })
  } catch (e) {
    return res.send(e.message)
  }
})

router.put('/:usename/:todoId/toggle', async (req, res) => {
  if (req.query.hasError) {
    return res.status(500).send('서버에서 알 수 없는 에러가 발생!')
  }
  try {
    const { todoId } = req.params
    const todo = await Todo.findById(req.params.todoId)
    todo.isCompleted = !todo.isCompleted
    await todo.save()
    console.log(`todoId ${todoId} updated`)
    return delayedReturn(req, res, {
      message: `todoId ${todoId} updated`,
    })
  } catch (e) {
    return res.send(e.message)
  }
})

module.exports = router
