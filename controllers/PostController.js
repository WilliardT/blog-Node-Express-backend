import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось получить записи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {
                    viewsCount: 1,
                },
            },
            {
                new: true,
                //returnDocument: 'after',
            }
        )

        res.json(doc)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось получить записи'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = await PostModel.create({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось создать пост'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = await PostModel.findByIdAndDelete(postId)

        if (!doc) {
            return res.status(404).json({
                message: 'Запись не найдена'
            })
        }

        res.json({message: 'Пост удален'})

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось получить запись'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = await PostModel.findByIdAndUpdate(postId,{
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        if (!doc) {
            return res.status(404).json({
                message: 'Запись не обновлена'
            })
        }

        res.json({message: 'Пост обновлен'})

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось найти и обновить запись'
        })
    }
}