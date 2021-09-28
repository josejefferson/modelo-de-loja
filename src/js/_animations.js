angular.module('store').animation('.store-requests-client', () => ({ enter: anim.openSlideX, leave: anim.closeSlideX }))
angular.module('store').animation('.store-requests-client-product', () => ({ enter: anim.open, leave: anim.close }))

const anim = {
	openSlideX: (el, done) => {
		done()
		return done
	},
	closeSlideX: (el, done) => {
		console.log('Closing')
		anime.timeline({
			targets: el[0],
			easing: 'linear',
			complete: done
		}).add({
			opacity: 0,
			scale: 0.5,
			duration: 150,
			complete: () => el[0].style.setProperty('overflow', 'hidden', 'important')
		}).add({
			width: 0,
			height: 0,
			marginRight: 0,
			duration: 200
		})

		return done
	},
	open: (el, done) => {
		console.log('ANIMATION')
		done()
		// el.stop(true, false).css({ display: 'none', opacity: 0 }).slideDown(1000).fadeTo(3000, 1, done)
		return done
	},

	close: (el, done) => {
		console.log('ANIMATION')
		done()
		// el.stop(true, false).fadeTo(5000, 0).slideUp(1000, done)
		return done
	},
}