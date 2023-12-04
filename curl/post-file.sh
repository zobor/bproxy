curl -x "http://127.0.0.1:8888" \
  https://www.bproxy.dev/ip \
  -F "filename=post-json.sh" \
  -F "name=testFile" \
  -F "image=@./post-json.sh"
