const express = require('express');

const router = express();

const indexRouter = require('./index');
const usersRouter = require('./users');
const productsRouter = require('./products');
const itemsRouter = require('./items');
const shirtsRouter = require('./shirts');
const applesRouter = require('./apples');
const eggsRouter = require('./eggs');
const ballsRouter = require('./balls');
const papersRouter = require('./papers');
const ticketsRouter = require('./tickets');
const chairsRouter = require('./chairs');
const booksRouter = require('./books');
const catsRouter = require('./cats');
const horsesRouter = require('./horses');
const crownsRouter = require('./crowns');


router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/items', itemsRouter);
router.use('/shirts', shirtsRouter);
router.use('/apples', applesRouter);
router.use('/eggs', eggsRouter);
router.use('/balls', ballsRouter);
router.use('/papers', papersRouter);
router.use('/tickets', ticketsRouter);
router.use('/chairs', chairsRouter);
router.use('/books', booksRouter);
router.use('/cats', catsRouter);
router.use('/horses', horsesRouter);
router.use('/crowns', crownsRouter);

/*
houses,
groups,
coins,
reasons,
results,
types,
directions,
voices,
goals,
programms,
plans,
opinions,
rooms,
tables,
markets,
steps,
pictures
*/

module.exports = router;