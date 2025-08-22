# CI/CD Pipeline with GitHub Actions, Docker, and Minikube (No Cloud)

This repo shows a complete, no-cloud CI/CD pipeline:
- **CI**: GitHub Actions runs tests, builds a Docker image, and pushes to Docker Hub.
- **CD**: A **self-hosted GitHub runner** on your local VM (with Minikube) deploys the new image to Kubernetes.

## Prereqs
- A GitHub repo for this code.
- A Docker Hub account.
- A local VM or your own machine with:
  - Docker
  - Minikube
  - kubectl
  - Node.js 18+ (for local dev, optional)
  - A **self-hosted GitHub Actions runner** registered to your repo or org and running on that VM.

## Quick Start (Local Dev)
```bash
npm ci
npm test
docker compose up --build
# Open http://localhost:3000
```

## Minikube Setup (on your VM)
```bash
minikube start
kubectl apply -f k8s/deployment.yaml
kubectl get pods
# Port access:
minikube service ci-cd-service --url
# or NodePort: http://<minikube-node-ip>:30080
```

## GitHub Secrets (Repository → Settings → Secrets and variables → Actions)
- `DOCKER_USERNAME` – your Docker Hub username
- `DOCKER_PASSWORD` – your Docker Hub access token/password

## Self-Hosted Runner Setup (on your VM)
1. In your repo → **Settings → Actions → Runners → New self-hosted runner**.
2. Follow the shell commands GitHub gives you to install and start the runner service.
3. Ensure the VM has `kubectl` and Minikube configured. Example:
   ```bash
   minikube start
   kubectl config use-context minikube
   kubectl get nodes
   ```

## Pipeline Flow
1. Push to `main` or open a PR.
2. **build_and_push** job (GitHub-hosted):
   - Install deps, run tests.
   - Build image `DOCKER_USERNAME/ci-cd-app:<git-sha>`.
   - Push to Docker Hub.
3. **deploy_minikube** job (self-hosted on your VM):
   - `kubectl apply -f k8s/deployment.yaml`
   - `kubectl set image deployment/ci-cd-app ci-cd-app=DOCKER_USERNAME/ci-cd-app:<git-sha>`
   - Waits for rollout to complete.
4. Access app via:
   - `minikube service ci-cd-service --url`

## Screenshots to Capture
- GitHub Actions successful run (both jobs).
- Docker Hub image page showing pushed tags.
- `kubectl get pods` showing Running pod.
- Browser hitting the service URL (or NodePort 30080).

## Troubleshooting
- **ImagePullBackOff**: Your VM may need `docker login` for private images, or keep images public.
- **Self-hosted job not starting**: Ensure the runner is online and labeled `self-hosted`.
- **NodePort blocked**: On some hypervisors, open port `30080` or use `minikube service ci-cd-service --url`.
- **Different language**: Replace Node app/tests; Dockerfile base image and scripts will still work.
