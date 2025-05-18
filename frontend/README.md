# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- Auto-incrementing ID
    username VARCHAR(255) NOT NULL,  -- Username field
    email VARCHAR(255) NOT NULL UNIQUE,  -- Email field with unique constraint
    password VARCHAR(255) NOT NULL,  -- Password field
    role VARCHAR(50) DEFAULT 'user',  -- Role with a default value of 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp for creation
);

select * from users;
select * from plagiarism_history;

CREATE TABLE plagiarism_history (
    id SERIAL PRIMARY KEY,  -- Auto-incrementing ID
    user_id INTEGER NOT NULL,  -- Foreign key referencing the user
    file_name VARCHAR(255) NOT NULL,  -- File name for the plagiarism check
    plagiarism_percentage FLOAT NOT NULL,  -- Plagiarism percentage
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of when plagiarism was checked
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)  -- Foreign key constraint
);

select * from users;
select * from plagiarism_history;
select * from user_logs;

CREATE TABLE user_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  action VARCHAR(20) NOT NULL CHECK (action IN ('login','file_check')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);



--project run comments

1.uvicorn main:app --reload --port 8000
