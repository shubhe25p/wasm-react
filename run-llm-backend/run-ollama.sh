echo "Running ollama on Linux machine"

curl -fsSL https://ollama.com/install.sh | sh

echo "Ollama installed successfully"

echo "Starting ollama server..."


nohup ollama serve &

echo "Ollama server started successfully"

echo "Sleeping for 15sec"

sleep 15

ollama pull gemma:2b-instruct

pip install ollama
