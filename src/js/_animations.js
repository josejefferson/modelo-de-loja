angular.module('store').animation('.request', () => ({ enter: anim.open, leave: anim.close }))

const anim = {
	open: (el, done) => {
		console.log('ANIMATION')
		el.stop(true, false).css({ display: 'none', opacity: 0 }).slideDown(100).fadeTo(300, 1, done)
		return done
	},
	
	close: (el, done) => {
		console.log('ANIMATION')
		el.stop(true, false).fadeTo(500, 0).slideUp(100, done)
		return done
	},
}