const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();      // creates custom router to handle the various routers.



router.post('/tasks',auth ,async (req, res) => {

    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,         //associated task with user
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);

    } catch (e) {
        res.status(400).send(e)
    }


     

});


// GET /tasks?completed=true
// GET /tasks?limit=2&skip=3
// GET /tasks?sortBy=createdAt:desc||asc
router.get("/tasks", auth, async (req, res) => {
    
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';    
    };

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }


    try {
        // const tasks = await Task.find({ owner: req.user._id });
        
        await req.user.populate({     // customizing the populate func.
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },
         }).execPopulate();
        
        res.send(req.user.tasks);
    

    } catch (e) {
        res.status(500).send();

    }

    
});

router.get("/tasks/:id",auth ,async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id }); // so that only that user can see the task the one who created this.
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();

    }


});


router.patch('/tasks/:id',auth,async (req, res) => {
    const updates = Object.keys(req.body);  // converts key of body unto the string array
    const allowUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowUpdates.includes(update));


    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }




    try {
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

       
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        })

        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send();
    }

})

router.delete('/tasks/:id',auth ,async (req, res) => {

    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);

    } catch (e) {
        res.status(500).send();
    }

})


module.exports = router;