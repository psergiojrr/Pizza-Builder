# Pizza App (API + Web)

## 📌 Overview
Complete application to compose, search, and list pizzas. The project is split into two parts: a Node.js/TypeScript (Express) API and a React front-end with Ant Design, both served via Docker. The front-end consumes the API to list sizes, ingredients, and create pizzas.

## 🚀 Technologies
- **Node.js + Express**: HTTP server for the API.
- **TypeScript**: Static typing across API and Web.
- **Yarn Workspaces**: Monorepo with the shared package `@pizza/types`.
- **React (Create React App)**: Client SPA.
- **Ant Design (`antd`)**: UI components.
- **CORS**: Cross-origin access for the API.
- **ts-node-dev**: Dev server with API hot reload.
- **Docker + Docker Compose**: Containerization and orchestration.
- **Nginx**: Serves the client build in production.

## 🧩 Structure
- `apps/api`: Express/TypeScript API. Entrypoint at `src/server.ts`.
- `apps/client`: React App with Ant Design.
- `packages/types`: TypeScript types shared between API and Web.
- `docker-compose.yml`: Brings up `api` (port 8080) and `client` (port 3000 → 80 inside Nginx container).

## 🛠️ Prerequisites
You can run with Docker (recommended) or locally.

### Option A: Docker (recommended)
- macOS: install **Docker Desktop**.
  - Download: https://www.docker.com/products/docker-desktop/
- Verify installation:

```bash
docker --version
docker compose version
```

#### Linux
- Install Docker Engine and Docker Compose Plugin.
  - Ubuntu:
    - Set up Docker's official repo and install `docker-ce`, `docker-ce-cli`, `containerd.io`, `docker-compose-plugin`.
    - Guide: https://docs.docker.com/engine/install/ubuntu/
  - Fedora:
    - Guide: https://docs.docker.com/engine/install/fedora/
- Add your user to the `docker` group to run without `sudo` (log out/in afterwards):

```bash
sudo usermod -aG docker "$USER"
newgrp docker
docker run hello-world
```

#### Windows
- Install **Docker Desktop for Windows** (requires WSL2 or Hyper-V).
  - Download: https://www.docker.com/products/docker-desktop/
- Enable WSL2 and install Ubuntu from Microsoft Store (recommended).
  - Quick guide: https://learn.microsoft.com/windows/wsl/install
- Verify in PowerShell or Terminal:

```powershell
docker --version
docker compose version
```

### Option B: Local environment (without Docker)
- **Node.js 18+** and **Yarn**.
- Install Yarn (if needed):

```bash
npm install -g yarn
```

#### Linux
- Install Node.js 18+ using your distro's package manager or `nvm`.
  - `nvm` install:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18
node -v
npm -v
```

#### Windows
- Install Node.js 18+ via official installer: https://nodejs.org/
- Or use `nvm-windows`: https://github.com/coreybutler/nvm-windows
- Install Yarn globally:

```powershell
npm install -g yarn
yarn -v
```

## ⚙️ Setup
This is a Yarn Workspaces monorepo; each package has its own scripts.

### With Docker
1. Build and start services:

```bash
docker compose up --build
```

2. Access:
- API: http://localhost:8080
- Web (client): http://localhost:3000

Notes:
- The `client` service serves the build via Nginx on container port 80, mapped to host port 3000.
- The `api` service runs `yarn dev` (hot reload via `ts-node-dev`).

### Without Docker (local development)
Open two terminals: one for the API and another for the client.

1. Install dependencies at the project root:

```bash
yarn install
```

2. Run API (port 8080):

```bash
cd apps/api
nvm use
yarn dev
```

3. Run React client (port 3000):

```bash
cd apps/client
nvm use
yarn dev
```

4. Access:
- API: http://localhost:8080
- Web: http://localhost:3000

## 🔍 Main API Routes
- `GET /health`: health check.
- `GET /ingredients`: list of ingredients.
- `GET /sizes`: list of sizes.
- `GET /pizzas`: list of pizzas.
- `GET /pizzas/:id`: get pizza by id.
- `POST /pizzas`: create a pizza.

## 🗂️ Hot reload-optimized development
With Docker, `docker-compose.yml` is configured with `develop.watch` to sync source changes and rebuild when needed:
- Syncs `apps/api/src` into the API container.
- Rebuilds when relevant `package.json` files change.
- For the client, syncs `apps/client/src` and serves the built app via Nginx.

## 💡 Tips
- If ports 3000 or 8080 are in use, adjust mappings in `docker-compose.yml`.
- On macOS, grant Docker Desktop permissions to mount/sync files in your project directory.

.- **API (unit tests for controllers):**
  - Focused unit tests use Jest with mocked `Request`/`Response`.
  - Run the full API suite from the API folder:

```bash
cd apps/api
yarn test
```

  - Run only the controller unit tests:

```bash
cd apps/api
yarn test -- tests/pizzas.controller.unit.test.ts
```

## 👤 Author
Project developed by Paulo Sérgio.
