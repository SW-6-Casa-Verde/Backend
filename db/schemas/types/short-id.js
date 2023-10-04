import { nanoid } from 'nanoid';

const shortId = {
    type: String,
    default: () => {
        return nanoid()
    },
	index: true,
	unique: true
}

module.exports = shortId;