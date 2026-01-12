# Repository Guidelines

## Project Structure & Module Organization
- `core/` contains the main runtime, task orchestration, and tooling (e.g., `entry.py`, `run_task.py`, `backend/`).
- `test/` hosts runnable test scripts and sample reports; results live under `test/reports/`.
- `docs/` contains documentation assets; top-level `README*.md` files are user guides in multiple languages.
- `env_sample` is the template for local configuration; copy it to `.env` in the repo root.

## Build, Test, and Development Commands
- `uv venv` creates the local virtual environment (first time only).
- `uv sync` installs dependencies from `pyproject.toml`/`uv.lock`.
- `python core/entry.py` runs Wiseflow locally.
- `python core/run_task.py` runs the task runner directly.
- Example test script: `python test/fetching_test.py -S 'https://example.com'`.

## Coding Style & Naming Conventions
- Python 3.12 is required (`.python-version`).
- Format with `black` (line length 120) and lint with `ruff` (`pyproject.toml`).
- Type-check with `mypy` (`disallow_untyped_defs = true`).
- Use `snake_case` for modules/functions and keep filenames consistent with their purpose (e.g., `*_test.py`).

## Testing Guidelines
- Primary testing is script-based under `test/` (see `test/README_EN.md`).
- When submitting test results, create a folder under `test/reports/` named `{test_content}_{test_date}_{tester}` and update `test/reports/README.md`.
- If adding unit tests, prefer `pytest`/`pytest-asyncio` to align with dev dependencies.

## Commit & Pull Request Guidelines
- Commit history favors short, direct messages (e.g., `fix: windows problems`, `update readme`).
- Use concise present-tense summaries; optional prefixes like `fix`, `update`, `add` are common.
- PRs should describe the change, reference issues when relevant, and include repro steps or logs for bug fixes.

## Configuration & Security Notes
- Copy `env_sample` to `.env` and keep secrets out of git; the app expects OpenAI-compatible LLM endpoints.
- Chrome must be installed in the default path for browser automation (see `README_EN.md`).
