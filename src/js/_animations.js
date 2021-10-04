angular.module('store').animation('.store-requests-client', () => ({ enter: anim.openSlide, leave: anim.closeSlide }))
angular.module('store').animation('.store-requests-client-product', () => ({ enter: anim.openSlide, leave: anim.closeSlide }))

const anim = {
	openSlide: (el, done) => {
		const width = el[0].clientWidth
		const height = el[0].clientHeight
		el[0].classList.add('animation-pre-open')
		setTimeout(() => {
			el[0].style.width = width + 'px'
			el[0].style.height = height + 'px'
			el[0].classList.add('animation-open')
		}, 0)
		setTimeout(() => {
			el[0].classList.remove('animation-pre-open')
			el[0].classList.remove('animation-open')
			el[0].style.width = null
			el[0].style.height = null
			done()
		}, 350)
		return done
	},

	closeSlide: (el, done) => {
		el[0].style.width = el[0].clientWidth + 'px'
		el[0].style.height = el[0].clientHeight + 'px'
		setTimeout(() => el[0].classList.add('animation-close'), 0)
		setTimeout(done, 350)
		return done
	}
}