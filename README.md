# European Fuel Price Explorer  

European Fuel Price Explorer is a data engineering and visualization project that explores fuel prices across European countries over time.  
  
The project collects fuel-price data from the European Commission's Weekly Oil Bulletin, stores the source data in PostgreSQL, transforms it with dbt, and exposes the resulting data through a Next.js dashboard.  

## 1. Sources

### European Commission Weekly Oil Bulletin

All fuel price data used in this project comes from the [European Commission's Weekly Oil Bulletin](https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en).

The project uses the **"Prices with taxes" historical dataset**, which contains weekly observations dating back to 2005. This historical dataset serves as the project's single source of fuel price data.

For the dashboard's current price comparisons, the latest observation date from the historical dataset is used. This latest observation is exposed as a separate weekly data model for easier use by the dashboard, but it is not a separate source dataset.

All prices used in the project include taxes.

The historical dataset is downloaded and processed by the ingestion pipeline, with the data transformed from the original workbook structure into a format suitable for analysis.

### The datasets contains prices for:

- **Petrol 95** — Euro-super 95
- **Diesel** — Gas oil automobile / Automotive gas oil / Dieselkraftstoff
- **Heating gas oil** — Gas oil de chauffage / Heating gas oil / Heizöl
- **Fuel oil (low sulphur)** — Schweres Heizöl, sulphur ≤ 1%
- **Fuel oil (high sulphur)** — Schweres Heizöl, sulphur > 1%
- **LPG motor fuel** — GPL pour moteur / LPG motor fuel

For this project, only **Petrol 95** and **Diesel** prices are used.
   
  
### Unit conversion  

Prices reported in `EUR per 1,000 litres` are converted to `EUR per litre` during transformation.


## 2. The Architecture 
  
![The architecture of the data engineering project.](/assets/images/data-engineering-architecture.svg)
  
## 3. Data Pipeline

The pipeline downloads the European Commission's historical Weekly Oil Bulletin dataset, loads the source data into PostgreSQL, and uses dbt to transform it into analysis-ready models.

### 1. Extract

Python downloads the **"Prices with taxes" historical dataset** from the European Commission's Weekly Oil Bulletin.

The dataset contains weekly fuel price observations dating back to 2005. The latest observation in the historical dataset is used as the dashboard's current price data.

### 2. Validation & minimal clean-up

The ingestion process:

* validates the HTTP response status
* adds pipeline metadata such as the source URL and ingestion timestamp
* renames long and duplicated column names to make them suitable for PostgreSQL
* removes unnecessary rows and footer information from the source workbook
* converts pandas `NaN` values to database-compatible `NULL` values

The ingestion layer performs only the cleaning required to reliably load the source data. Major transformations are handled by dbt.

### 3. Load

The processed source data is inserted into the PostgreSQL raw layer.

The historical table uses `observed_date` as its uniqueness constraint because each historical observation contains all countries and fuel types in a single wide row.

This makes the ingestion process idempotent: running the pipeline again does not create duplicate observations for an already ingested date.

### 4. Transform

dbt converts the raw source data into analysis-ready models and runs data-quality tests during the build.

#### In staging:

* the wide country-column structure is converted into a normalized structure
* country codes are extracted from the source column names
* fuel types are identified
* prices are converted from EUR per 1,000 litres to EUR per litre
* rows without a valid price are filtered out
* country names are added using the country-code seed

#### In the fact model:

The staging data is organized into a historical fuel-price fact table containing country, fuel type, price, and observation date.

#### In the latest-price mart:

The latest observation date is selected from the historical fact table and exposed as a separate model containing the current petrol and diesel prices used by the dashboard.

This is a **derived model, not a separate data source**.

* Only petrol 95 and diesel are selected for analysis for both historical and weekly observations.

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
