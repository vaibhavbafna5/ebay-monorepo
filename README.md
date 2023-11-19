# Overview
This monorepo contains a frontend application, which is a React app, and a backend application, which is a Flask app. The application allows eBay sellers to track their listings' performance against their competition. A user would compile a list of products and a given set of keywords for each products, submit their seller IDs, and then retrieve their listings that surface for those keywords as well as any competition that also surfaces for those keywords.

The repo contains a `Dockerfile.combo` and `docker-compose.yml` to build a container that runs this application.

The Dockerfile leverages multi-build steps.

1. Build the frontend
2. Install dependencies for the Flask app & copy the files
3. Copy the files from the frontend build step to a static directory
4. Serve the Flask app with gunicorn

## Running The Container Locally
To build the container and run the application locally, do the following.

1. Install Docker (obviously, install the version compatible with your OS & architecture)
2. Navigate to the directory at the root-level, where `Dockerfile.combo` and `docker-compose.yml`
3. Run `docker-compose build` (builds the container)
4. Run `docker-compose up` (runs the container)

If all this completes successfully, navigate to http://localhost:6001/ to view the running application.'

Some helpful commands are listed below:
- `docker ps -a` to show all running containers
- `docker stop $(docker ps -aq) && docker rm $(docker ps -aq)` to stop & kill all containers

## Running for Development

### Backend
Navigate to the `backend` directory. Run `make`. This will create a virtual environment, install all dependencies. 
Executing `make run` will run the application at `http://localhost:6001/`

<b>Note:</b> the default route, `/` will not work since there are no build files at this point.

### Frontend
Navigate to the `frontend` directory. Run `make`. This will install all dependencies. Note, that node will have to be installed already.

To run it, `make run`. Manually change the API endpoints to point towards the backend.
