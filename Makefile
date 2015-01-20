deploy: build
	s3cmd -c ~/.s3cfg-desandro sync build/. s3://v3.desandro.com
