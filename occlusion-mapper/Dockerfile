FROM iqtlabs/edgetech-core:latest
COPY pyproject.toml .
COPY poetry.lock .
RUN pip3 install poetry==1.5.1
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev
ADD occlusion_mapper.py .
ENTRYPOINT [ "python3", "occlusion_mapper.py" ]