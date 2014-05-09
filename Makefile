
lesson3:
	mocha verify/app_spec.js -R spec -g 'as handler to http.createServer'
	mocha verify/app_spec.js -R spec -g 'Defining the app.listen method'

lesson4:
	mocha verify/app_spec.js -R spec -g 'Implement Error Handling'
	mocha verify/app_spec.js -R spec -g 'Implement calling the middlewares'
	mocha verify/app_spec.js -R spec -g 'Implement App Embedding As Middleware'

mytest:
	mocha -R spec -g 'calling middleware stack'
