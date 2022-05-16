function Rating(element) {
	if (!element) return rate
	const ratingStars = [
		element.querySelector('.rating-star-0'),
		element.querySelector('.rating-star-1'),
		element.querySelector('.rating-star-2'),
		element.querySelector('.rating-star-3'),
		element.querySelector('.rating-star-4'),
		element.querySelector('.rating-star-5')
	]

	for (const i in ratingStars) {
		ratingStars[i].addEventListener('click', () => rate(i, element))
	}

	function rate(stars, element) {
		element.classList.add('rating-disabled')
		return new Promise((resolve, reject) => {
			axios.get(`/products/rate/${element.dataset.product}/${element.dataset.client}/${stars}`).then(() => {
				element.classList.remove('rating-0', 'rating-1', 'rating-2', 'rating-3', 'rating-4', 'rating-5')
				element.classList.add('rating-' + stars)
				element.classList.remove('rating-disabled')
				resolve(stars)
			}).catch((err) => {
				element.classList.remove('rating-disabled')
				reject(err)
			})
		})
	}

	return rate
}