deploy:
	rhc apps -v | grep "SSH.*kirosprime" | awk '{print $$2;}' | xargs -I{} scp -r dist/* {}:~/app-root/data/webapp/.
