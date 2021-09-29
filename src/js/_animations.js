angular.module('store').animation('.store-requests-client', () => ({ enter: anim.openSlide, leave: anim.closeSlide }))
angular.module('store').animation('.store-requests-client-product', () => ({ enter: anim.openSlide, leave: anim.closeSlide }))

const anim = {
	openSlideX: (el, done) => {
		const style = {...getComputedStyle(el[0])}
		el[0].style.width = '0'
		el[0].style.opacity = '0'
		el[0].style.marginRight = '0'
		el[0].style.transform = 'scale(0.5)'
		el[0].style.setProperty('overflow', 'hidden', 'important')

		anime.timeline({
			targets: el[0],
			easing: 'easeInOutQuad',
			complete: done
		}).add({
			width: style.width,
			marginRight: style.marginRight,
			duration: 200,
			complete() {
				el[0].style.overflow = null
			}
		}).add({
			opacity: style.opacity,
			scale: 1,
			duration: 150,
			complete() {
				el[0].style.width = null
				el[0].style.opacity = null
				el[0].style.marginRight = null
				el[0].style.transform = null
			}
		})

		return done
	},

	openSlide: (el, done) => {
		el[0].classList.add('animation-pre-open')
		setTimeout(() => {
			el[0].classList.add('animation-open')
			setTimeout(() => {
				el[0].style.width = el[0].clientWidth + 'px'
				el[0].style.height = el[0].clientHeight + 'px'
			}, 0)
		}, 0)
		setTimeout(done, 3500)
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