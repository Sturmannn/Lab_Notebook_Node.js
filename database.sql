create TABLE Notes(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    tags VARCHAR(255),
    paths_to_files TEXT
);