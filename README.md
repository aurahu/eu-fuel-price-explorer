# European Fuel Price Explorer  

European Fuel Price Explorer is a data engineering and visualization project that explores fuel prices across European countries over time.  
  
The project collects fuel-price data from the European Commission's Weekly Oil Bulletin, stores the source data in PostgreSQL, transforms it with dbt, and exposes the resulting data through a Next.js dashboard.  

## 1. Sources  

### Weekly data  

The weekly dataset contains the latest consumer fuel prices published by the [European Commission's Weekly Oil Bulletin](https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en). The dataset is updated every Thursday, containing prices from Monday. All prices include tax.  
  
### Historical data  

The historical workbook provides longer-term observations for the same fuel types as in the weekly data, dating back to 2005. This dataset is also published by the [European Commission's Weekly Oil Bulletin](https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en). The project uses the "Prices with taxes" dataset to provide historical trends. The historical data also includes the weekly data.

### The datasets contains prices for:

- **Petrol 95** — Euro-super 95
- **Diesel** — Gas oil automobile / Automotive gas oil / Dieselkraftstoff
- **Heating gas oil** — Gas oil de chauffage / Heating gas oil / Heizöl
- **Fuel oil (low sulphur)** — Schweres Heizöl, sulphur ≤ 1%
- **Fuel oil (high sulphur)** — Schweres Heizöl, sulphur > 1%
- **LPG motor fuel** — GPL pour moteur / LPG motor fuel

For this project, only **Petrol 95** and **Diesel** prices are used.
   
  
### Unit conversion  

The source uses `EUR / 1,000 litres` for petrol 95 and diesel. For this project, all prices have been converted to `EUR / L`.  


## 2. The Architecture 
  
![The architecture of the data engineering project.](/assets/images/data-engineering-architecture.svg)
  

## 3. Data Pipeline

This is what happens in the pipeline, step by step:

### 1. Extract
Python downloads the latest European Commission files (the sheet containing latest prices, and the sheet containing latest prices + historical prices).  

### 2. Validation & minimal clean-up
The ingestion process:
* validates the HTTP response status
* adds pipeline metadata (source link and ingestion time)
* renames long column names
* removed unnecessary fields such as footer notes.
* converts pandas NaN to Python None

### 3. Load
The source data is inserted into PostgreSQL raw tables. 
The weekly table uses `(country, observed_date)` as its uniqueness constraint, preventing duplicate observations.
The historical table uses `observed_date` because each historical observation contains all countries in one wide row.

### 4. Transform
dbt converts the raw source data into analysis-ready models.  
For both weekly and historical data, a staging model and mart model is created.  

#### In staging:
* Tables are converted from a wide country-column structure into a normalized structure
* Country codes are added
* Units are converted
* Rows with NULL price are filtered

#### In marts:
* Only petrol 95 and diesel are selected for analysis.

## 4. Data Quality
Data quality is checked with dbt tests, ensuring:
* required fields are not null
* fuel types contain expected values
* prices fall within reasonable bounds
* observation dates are valid
* all expected countries are represented in the latest observation

Data-quality tests run as part of the automated pipeline. A failed dbt test causes the GitHub Actions workflow to fail rather than publishing potentially invalid data.

## 5. Automation
GitHub Actions are used for workflow automation.  
  
Each Thursday:
* download the latest source data
* run Python ingestion
* run dbt transformations
* run dbt tests
* update database 

The dashboard reads from the updated PostgreSQL analytics tables.

[See GitHub Actions workflow](/.github/workflows/update-fuel-prices.yml).

## 6. Tech Stack

![The tech stack of the data engineering project.](/assets/images/tech-stack.svg)

## 7. Limitations
The project relies on the European Commission's published weekly data. Missing observations or changes to the source workbook structure may require adjustments to the ingestion process.

Historical data is sampled to monthly observations for the longer-term dashboard views rather than displaying every weekly observation.

Prices represent consumer prices including taxes and should not be interpreted as real-time station-level prices.

### Historical data ingestion
The historical dataset is currently refreshed as part of the weekly pipeline. Each run downloads the complete historical workbook and inserts any previously unseen observation dates into the raw historical table.  

This means that, under normal weekly operation, only one new historical observation row is added to the database, while the full workbook is downloaded and processed each time.  

A more efficient implementation could use the weekly dataset as the primary source for new observations and append these directly to the historical data model. However, this would require additional transformation logic to reconcile the different structures and schemas of the weekly and historical source files. The current approach was chosen to keep the ingestion pipeline simpler and more reliable while the project is still being developed.  


## 8. Future Improvements

- Improve the historical ingestion pipeline by using the weekly dataset for incremental updates.
- Add additional fuel types and analytical views.
