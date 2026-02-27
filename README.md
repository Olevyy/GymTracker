# MACD Alert System (ETL Pipeline)

Automated ETL pipeline for stock market data. The system fetches live data via `yfinance`, processes technical indicators using Pandas, and stores the results in **Google BigQuery** for long-term analysis.

---

## 📌 How it works

### 1️⃣ Extract
Automatically downloads historical stock data (`Date`, `Close`, `Volume`) using the `yfinance` library.

### 2️⃣ Transform
Uses **Pandas** to calculate Exponential Moving Averages:

- $EMA_{12}$
- $EMA_{26}$


### 3️⃣ Load
Formats and uploads the processed data to **Google BigQuery**.

Supported write modes:
- `WRITE_APPEND` → for daily incremental updates
- `WRITE_TRUNCATE` → for full dataset refresh

### 4️⃣ Alerts (Planned)
Instant notifications via Webhooks (Discord / Slack) for trading signals.

---

## 🛠 Tech Stack

- **Language**: Python  
- **Data Libraries**: Pandas, yfinance  
- **Cloud & Database**: Google Cloud Platform (BigQuery)  
- **Testing**: Pytest  

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Olevyy/macd-alert-system.git
cd macd-alert-system
```

### 2️⃣ Install requirements

```bash
pip install requirements.txt
```

### 3️⃣ GCP Authentication

1. Create a **Service Account** in your Google Cloud Console.
2. Download the JSON key.
3. Save it as:

```
service_account.json
```

in the root directory of the project.

4. Ensure the Service Account has the following roles:
   - BigQuery Data Editor
   - BigQuery Job User

The application automatically looks for the key in the root folder.

---

## 🚀 Usage

### ▶ Running the ETL Pipeline

```bash
python3 main.py
```

---


### 🧪 Running Tests

Run tests from the root directory:

```bash
python3 -m pytest tests/
```


---

## 📈 TODO / Future Improvements

- [ ] Set up GitHub Actions or for daily automation
- [ ] Implement automated alerts for detected MACD crossovers
- [ ] Start using BigQuery to analyze historic data or create visualizations
---

