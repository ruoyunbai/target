all:
	git add .  && git commit -m "auto_push" && git pull && git push
git:
	git add * && git commit -m "auto_push" && git pull || git push || git push || git push  || git push  || git push
