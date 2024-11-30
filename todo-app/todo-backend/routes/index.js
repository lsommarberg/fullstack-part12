const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const { getAsync } = require('../redis') 

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (_, res) => {
  const added_todos = await getAsync('added_todos') || 0
  console.log('Added todos:', added_todos);
  res.send({ added_todos })
})

module.exports = router;
