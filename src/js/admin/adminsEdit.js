const pwd = document.adminsEdit.password
const confPwd = document.adminsEdit.confirmpassword
function validate() {
	if (pwd.value !== confPwd.value) {
		confPwd.setCustomValidity('As senhas não se correspondem')
	} else {
		confPwd.setCustomValidity('')
	}
}

pwd.onchange = validate
confPwd.onchange = validate
pwd.onkeydown = validate
confPwd.onkeydown = validate
pwd.onpaste = validate
confPwd.onpaste = validate