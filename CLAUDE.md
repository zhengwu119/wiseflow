# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WiseFlow is an LLM-driven web crawler and information extraction system that monitors websites, RSS feeds, and search engines to extract information based on user-defined "focuses". It uses real browser automation (not headless) combined with LLM-based extraction to intelligently identify and extract relevant content.

## Build & Run Commands

### Backend (Python)

```bash
# Setup (first time)
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uv sync

# Run full system (API + task scheduler)
python core/entry.py

# Run API server only
python core/backend/main.py

# Run task scheduler only
python core/run_task.py
```

### Frontend (Vue 3)

```bash
cd web
npm install
npm run dev      # Development server (localhost:5173)
npm run build    # Production build to dist/
```

### Docker

```bash
docker-compose up --build  # Full stack
```

## Testing

Test scripts are in `test/` directory. Run individual tests:

```bash
python test/fetching_test.py -S 'https://example.com,https://example2.com'
python test/html2md_test.py -F 'json_file_path' -R 'record_save_path'
python test/get_info_test.py -D 'sample_dir' -I 'include_pattern'
python test/browser_manager_test.py
```

For unit tests: `pytest test/`

## Code Quality

- Format: `black` (line length 120)
- Lint: `ruff`
- Type check: `mypy` (strict mode)
- Python 3.12 required

## Architecture

### Multi-Process Design

`core/entry.py` spawns two processes:
1. **Backend API** (FastAPI on port 8077) - handles REST/WebSocket requests
2. **Task Scheduler** - executes tasks at configured time slots (4 daily slots, 6 hours apart)

Set `WISEFLOW_DISABLE_TASKS=1` to run API only.

### Core Components

**Database** (`core/async_database.py`):
- SQLite database in `work_dir/wiseflow.db`
- AsyncDatabaseManager with connection pooling
- Tables: `tasks`, `infos`, `focuses`, `local_proxies`, `kdl_proxies`, `mc_backup_accounts`
- JSON columns for flexible nested data (focuses, sources, search configs)

**Task Execution** (`core/run_task.py`, `core/general_process.py`):
- Parses time slots to determine execution schedule
- Dispatches to appropriate crawlers based on source type (web, RSS, search engines)
- Runs LLM extraction via ExtractManager

**Crawler Strategy** (`core/wis/async_crawler_strategy.py`):
- Orchestrates browser automation (Patchright/NoDriver), fetching, parsing
- SQLite-based cache with TTL (15 days for web, 2 days for social media)

**LLM Integration** (`core/wis/llmuse.py`, `core/wis/extraction_strategy.py`):
- OpenAI-compatible API client
- Custom extraction prompts with role, purpose, restrictions
- Vision-language model support for image content

**Search Engines** (`core/wis/searchengines/`):
- Implementations for Bing, GitHub, ArXiv

### Frontend Structure

- **Pages**: Dashboard, Feed, Tasks (TaskList/TaskForm), Settings
- **Stores** (Pinia): taskStore, wsStore, configStore, proxyStore
- **API client**: `web/src/services/api.ts` (Axios-based)
- **WebSocket**: Real-time updates via `useWebSocket` composable

### API Documentation

- REST endpoints: `core/backend/HTTP_API.md` (27 endpoints)
- WebSocket messages: `core/backend/WS_API.md` (codes 0-199)

## Configuration

Copy `env_sample` to `.env` in project root:

```
LLM_API_BASE="https://api.siliconflow.cn/v1"
LLM_API_KEY={your_token}
PRIMARY_MODEL=Qwen/Qwen3-32B
VL_MODEL=Pro/Qwen/Qwen2.5-VL-7B-Instruct
```

Optional runtime overrides: `work_dir/custom_config.json`

## Key Dependencies

- **Browser**: Chrome must be installed at default path
- **Python packages**: FastAPI, Patchright (undetected Playwright), httpx, OpenAI SDK
- **Frontend**: Vue 3, Tailwind CSS, Vite, TypeScript

## Terminology

- **Focus** (formerly "focuspoint"): A topic/interest the user wants to track and extract information about
- **Task**: A scheduled job that monitors sources and extracts information based on focuses
- **Time slots**: Four daily execution windows (first, second, third, fourth) - 6 hours apart starting from `TIME_SLOTS_START`
