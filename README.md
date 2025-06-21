
<img src="logo.svg" alt="DSO-DB Logo" width="200"/><br/><br/>

# DSO-DB
Open source Deep Sky Object database.

![GitHub repo size](https://img.shields.io/github/repo-size/CelestialyXYZ/DSO-data)
![GitHub last commit](https://img.shields.io/github/last-commit/CelestialyXYZ/DSO-data)
![GitHub issues](https://img.shields.io/github/issues/CelestialyXYZ/DSO-data)
![License](https://img.shields.io/github/license/CelestialyXYZ/DSO-data)
![Node.js CI](https://img.shields.io/github/actions/workflow/status/CelestialyXYZ/DSO-data/node.js.yml?branch=main)
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/yourusername/yourgistid/raw/coverage-badge.json)
---

**DSO-DB** is a Node.js + TypeScript tool to build and upload a processed Deep Sky Object (DSO) database from the [OpenNGC catalog](https://github.com/mattiaverga/OpenNGC) to a Supabase PostgreSQL instance.

---

## 📦 Features

- 📥 Downloads and parses the [OpenNGC NGC.csv](https://raw.githubusercontent.com/mattiaverga/OpenNGC/refs/heads/master/database_files/NGC.csv)
- 🛠 Formats astronomical object data into structured JSON
- ☁ Uploads the data to a Supabase database
- 📊 Collects code coverage and supports unit tests using `ava` and `c8` (not done, but frameworks are implemented)

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/CelestialyXYZ/DSO-data.git
cd dso-db
npm install
````

### 2. Setup Environment

Create a `.env` file at the project root:

```env
SUPABASE_URL=<your_supabase_project_url>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```

### 3. Build the DSO database

```bash
npm run dev
```

This:

* Downloads the OpenNGC CSV
* Parses it
* Outputs a JSON file to `./out/openngc_db_parsed.json`

### 4. Upload to Supabase

```bash
npm run upload
```

This:

* Connects to your Supabase project
* Clears the `dso_objects` table
* Uploads all rows from the parsed JSON file

---

## 🧪 Running Tests

```bash
npm run test
```

* Test runner: [`ava`](https://github.com/avajs/ava)
* Code coverage: [`c8`](https://github.com/bcoe/c8)

Reports are generated in `coverage/`.

---

## 📚 Technologies Used

* Node.js + TypeScript
* Supabase JavaScript Client
* Fast-CSV
* CLI tools: `chalk`, `figlet`, `inquirer`, `cli-progress`
* Testing: `ava`, `c8`
* Code structure optimized for ESModules via `ts-node/esm`

---

## 📘 Supabase Table Schema

This project expects a Supabase table called `dso_objects` matching the following TypeScript structure:

<details>
<summary>Click to expand schema</summary>

Refer to the `DSORow_processed` type in `uploadToDB.ts` for detailed field documentation, including object types, magnitudes, identifiers, and source tracking.

</details>

---

## 📝 License

This project is licensed under the **GNU GPL v3.0** for all original software code.

The included data from the [OpenNGC catalog](https://github.com/mattiaverga/OpenNGC) is licensed separately under the **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** license. The final built database is also under this licence.

You must comply with both licenses if you use, modify, or distribute this project.

- GPL v3.0 License (code): See [LICENSE](./LICENSE)
- CC BY-SA 4.0 License (OpenNGC data): See [OpenNGC License Info](https://github.com/mattiaverga/OpenNGC#license)
