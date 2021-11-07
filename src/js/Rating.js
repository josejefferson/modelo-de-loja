function Rating(element) {
	if (!element) return
	let currentRating = element.dataset.rating
	const productID = element.dataset.product
	const clientID = element.dataset.client

	const ratingStars = [
		element.querySelector('.rating-star-0'),
		element.querySelector('.rating-star-1'),
		element.querySelector('.rating-star-2'),
		element.querySelector('.rating-star-3'),
		element.querySelector('.rating-star-4'),
		element.querySelector('.rating-star-5')
	]

	for (const i in ratingStars) {
		ratingStars[i].addEventListener('click', () => {
			element.classList.add('rating-disabled')
			axios.get(`/products/rate/${productID}/${clientID}/${i}`).then(() => {
				element.classList.remove('rating-0', 'rating-1', 'rating-2', 'rating-3', 'rating-4', 'rating-5')
				element.classList.add('rating-' + i)
				element.classList.remove('rating-disabled')
			}).catch(() => {
				element.classList.remove('rating-disabled')
			})
		})
	}
}

document.querySelectorAll('.rating').forEach(e => Rating(e))
