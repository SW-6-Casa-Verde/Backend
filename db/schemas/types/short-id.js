import { nanoid } from 'nanoid';

const shortId = {
    type: String,
    default: () => {
        return nanoid()
    },
    require: true,
	index: true,
	unique: true
}

module.exports = shortId;