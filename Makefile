
lesson3:
	mocha verify/app_spec.js -R spec -g 'as handler to http.createServer'
	mocha verify/app_spec.js -R spec -g 'Defining the app.listen method'

lesson4:
	mocha verify/app_spec.js -R spec -g 'Implement Error Handling'
	mocha verify/app_spec.js -R spec -g 'Implement calling the middlewares'
	mocha verify/app_spec.js -R spec -g 'Implement App Embedding As Middleware'

lesson5:
	mocha verify -R spec -g 'Layer class and the match method'
	mocha verify -R spec -g 'app.use should add a Layer to stack'
	mocha verify -R spec -g 'The middlewares called should match request path'
	mocha verify -R spec -g 'The error handlers called should match request path:'

mytest:
	mocha -R spec -g 'calling middleware stack'
