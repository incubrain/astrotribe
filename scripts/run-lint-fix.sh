
#!/bin/bash

echo "Linting all packages..."
lerna run lint:fix --stream
echo "Linting completed."