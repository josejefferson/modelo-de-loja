angular.module('store').animation('.store-requests-client', () => ({ enter: anim.openSlideX, leave: anim.closeSlideX }))
angular.module('store').animation('.store-requests-client-product', () => ({ enter: anim.openSlideY, leave: anim.closeSlideY }))

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

	closeSlideX: (el, done) => {
		anime.timeline({
			targets: el[0],
			easing: 'easeInOutQuad',
			complete: done
		}).add({
			opacity: 0,
			scale: 0.5,
			duration: 150,
			complete() {
				el[0].style.setProperty('overflow', 'hidden', 'important')
			}
		}).add({
			width: 0,
			height: 0,
			marginRight: 0,
			duration: 200
		})

		return done
	},

	openSlideY: (el, done) => {
		const style = {...getComputedStyle(el[0])}
		el[0].style.height = '0'
		el[0].style.opacity = '0'
		el[0].style.paddingTop = '0'
		el[0].style.paddingBottom = '0'
		el[0].style.setProperty('overflow', 'hidden', 'important')

		anime.timeline({
			targets: el[0],
			easing: 'easeInOutQuad',
			complete: done
		}).add({
			height: style.height,
			paddingTop: style.paddingTop,
			paddingBottom: style.paddingBottom,
			duration: 200,
			complete() {
				el[0].style.overflow = null
			}
		}).add({
			opacity: style.opacity,
			duration: 150,
			complete() {
				el[0].style.height = null
				el[0].style.opacity = null
				el[0].style.paddingTop = null
				el[0].style.paddingBottom = null
			}
		})

		return done
	},

	closeSlideY: (el, done) => {
		anime.timeline({
			targets: el[0],
			easing: 'easeInOutQuad',
			complete: done
		}).add({
			opacity: 0,
			duration: 150,
			complete() {
				el[0].style.setProperty('overflow', 'hidden', 'important')
			}
		}).add({
			height: 0,
			paddingTop: 0,
			paddingBottom: 0,
			duration: 200
		})

		return done
	}
}