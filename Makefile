deploy: build
	s3cmd sync build/. s3://v3.desandro.com
