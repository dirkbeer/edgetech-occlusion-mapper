FROM node:16.17.1-alpine3.16 as build
COPY client  /
WORKDIR /
RUN npm install --force
RUN npm run build



FROM iqtlabs/edgetech-core:latest
RUN mkdir -p /static
WORKDIR /
COPY --from=build /build/ /static
COPY pyproject.toml .
COPY poetry.lock .
RUN pip3 install poetry==1.5.1
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev
ADD occlusion_mapper.py .
ENTRYPOINT [ "python3", "occlusion_mapper.py" ]